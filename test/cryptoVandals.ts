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
      await aliceK.mint("https://example.com/1");
      await aliceK.approve(cryptoVandals.address, 1);
      await aliceK.mint("https://example.com/2");
      await aliceK.approve(cryptoVandals.address, 2);

      await expect(aliceCV.vandalize(kitty.address, 1, "https://ipfs/1"))
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, AddressOne, 1)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(AddressZero, alice.address, 1)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(kitty.address, 1, 1);

      await expect(aliceCV.vandalize(kitty.address, 2, "https://ipfs/2"))
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, AddressOne, 2)
        .to.emit(cryptoVandals, "Transfer")
        .withArgs(AddressZero, alice.address, 2)
        .to.emit(cryptoVandals, "Vandalize")
        .withArgs(kitty.address, 2, 2);
    });
    it("fail if not approved", async () => {
      await aliceK.mint("https://example.com/1");
      await expect(
        aliceCV.vandalize(kitty.address, 1, "https://ipfs/1")
      ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });
  });

  /*
  describe("count down", async () => {
    // 5
    it("should fail due to underflow exception", () => {
      return expect(counter.countDown()).to.eventually.be.rejectedWith(Error, 'Uint256 underflow');
    });

    it("should count down", async () => {
      await counter.countUp();

      await counter.countDown();
      const count = await counter.getCount();
      expect(count).to.eq(0);
    });
  });
  */
});
