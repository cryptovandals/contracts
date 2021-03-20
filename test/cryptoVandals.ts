import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { solidity } from "ethereum-waffle";
import {
  Kitty__factory,
  Kitty,
  CryptoVandals__factory,
  CryptoVandals,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

chai.use(solidity);
chai.use(chaiAsPromised);
const { expect } = chai;

const AddressZero = ethers.constants.AddressZero;
const AddressOne = AddressZero.replace(/.$/, "1");

describe("CryptoVandals", () => {
  let kitty: Kitty;
  let cryptoVandals: CryptoVandals;
  let alice: SignerWithAddress, charly, bob;
  let aliceK: Kitty, charlyK, bobK;
  let aliceCV: CryptoVandals, charlyCV, bobCV;

  beforeEach(async () => {
    [alice, charly, bob] = await ethers.getSigners();

    const KittyFactory = (await ethers.getContractFactory(
      "Kitty",
      alice
    )) as Kitty__factory;
    kitty = await KittyFactory.deploy();
    await kitty.deployed();

    aliceK = kitty.connect(alice);
    bobK = kitty.connect(bob);
    charlyK = kitty.connect(charly);

    const cryptoVandalsFactory = (await ethers.getContractFactory(
      "CryptoVandals",
      alice
    )) as CryptoVandals__factory;

    cryptoVandals = await cryptoVandalsFactory.deploy();
    await cryptoVandals.deployed();

    aliceCV = cryptoVandals.connect(alice);
    bobCV = cryptoVandals.connect(bob);
    charlyCV = cryptoVandals.connect(charly);
  });

  describe("Single NFT to vandalize", async () => {
    it("mint a new CryptoVandals NFT", async () => {
      await aliceK.mint("kitty/1");
      await aliceK.approve(cryptoVandals.address, 1);
      await aliceK.mint("kitty/2");
      await aliceK.approve(cryptoVandals.address, 2);

      await expect(aliceCV.vandalize(kitty.address, 1, "cryptoVandals/1"))
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, AddressOne, 1)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(AddressZero, alice.address, 1)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(kitty.address, 1, 1);

      await expect(aliceCV.vandalize(kitty.address, 2, "cryptoVandals/2"))
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, AddressOne, 2)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(AddressZero, alice.address, 2)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(kitty.address, 2, 2);
    });
    it("fail if not approved", async () => {
      await aliceK.mint("kitty/1");
      await expect(
        aliceCV.vandalize(kitty.address, 1, "cryptoVandals/1")
      ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });
  });

  describe("Two NFTs to vandalize", async () => {
    it("mint a new CryptoVandals NFT", async () => {
      await aliceK.mint("kitty/1");
      await aliceK.approve(cryptoVandals.address, 1);
      await aliceK.mint("kitty/2");
      await aliceK.approve(cryptoVandals.address, 2);

      await expect(
        aliceCV.vandalize2(
          kitty.address,
          1,
          kitty.address,
          2,
          "cryptoVandals/1"
        )
      )
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, AddressOne, 1)
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, AddressOne, 2)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(AddressZero, alice.address, 1)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(kitty.address, 1, 1)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(kitty.address, 2, 1);
    });
    it("fail if not approved", async () => {
      await aliceK.mint("kitty/1");
      await aliceK.approve(cryptoVandals.address, 1);
      await aliceK.mint("kitty/2");

      await expect(
        aliceCV.vandalize2(
          kitty.address,
          1,
          kitty.address,
          2,
          "cryptoVandals/1"
        )
      ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });
  });

  describe("Single CryptoVandals NFT to vandalize", async () => {
    it("mint a new CryptoVandals NFT", async () => {
      await aliceK.mint("kitty/1");
      await aliceK.approve(cryptoVandals.address, 1);
      await aliceCV.vandalize(kitty.address, 1, "cryptoVandals/1");

      await aliceCV.approve(cryptoVandals.address, 1);

      await expect(
        aliceCV.vandalize(cryptoVandals.address, 1, "cryptoVandals/2")
      )
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(alice.address, AddressOne, 1)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(AddressZero, alice.address, 2)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(cryptoVandals.address, 1, 2);

      await aliceCV.approve(cryptoVandals.address, 2);

      await expect(
        aliceCV.vandalize(cryptoVandals.address, 2, "cryptoVandals/3")
      )
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(alice.address, AddressOne, 2)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(AddressZero, alice.address, 3)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(cryptoVandals.address, 2, 3);
    });
  });

  describe("Two CryptoVandals NFTs to vandalize", async () => {
    it("mint a new CryptoVandals NFT", async () => {
      await aliceK.mint("kitty/1");
      await aliceK.approve(cryptoVandals.address, 1);
      await aliceCV.vandalize(kitty.address, 1, "cryptoVandals/1");
      await aliceK.mint("kitty/2");
      await aliceK.approve(cryptoVandals.address, 2);
      await aliceCV.vandalize(kitty.address, 2, "cryptoVandals/2");

      await aliceCV.approve(cryptoVandals.address, 1);
      await aliceCV.approve(cryptoVandals.address, 2);

      await aliceCV.vandalize(cryptoVandals.address, 1, "cryptoVandals/3");
      await aliceCV.vandalize(cryptoVandals.address, 2, "cryptoVandals/4");

      await aliceCV.approve(cryptoVandals.address, 3);
      await aliceCV.approve(cryptoVandals.address, 4);

      await expect(
        aliceCV.vandalize2(
          cryptoVandals.address,
          3,
          cryptoVandals.address,
          4,
          "cryptoVandals/5"
        )
      )
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(alice.address, AddressOne, 3)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(alice.address, AddressOne, 4)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(AddressZero, alice.address, 5)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(cryptoVandals.address, 3, 5)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(cryptoVandals.address, 4, 5);
    });
  });

  describe("A Kitty and a CryptoVandals NFT to vandalize", async () => {
    it("mint a new CryptoVandals NFT", async () => {
      await aliceK.mint("kitty/1");
      await aliceK.approve(cryptoVandals.address, 1);
      await aliceCV.vandalize(kitty.address, 1, "cryptoVandals/1");
      await aliceCV.approve(cryptoVandals.address, 1);

      await aliceK.mint("kitty/2");
      await aliceK.approve(cryptoVandals.address, 2);

      await expect(
        aliceCV.vandalize2(
          cryptoVandals.address,
          1,
          kitty.address,
          2,
          "cryptoVandals/2"
        )
      )
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(alice.address, AddressOne, 1)
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, AddressOne, 2)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(AddressZero, alice.address, 2)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(cryptoVandals.address, 1, 2)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(kitty.address, 2, 2);
    });
  });
});
