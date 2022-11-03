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
import { defaultAbiCoder } from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);
chai.use(chaiAsPromised);
const { expect } = chai;

const AddressZero = ethers.constants.AddressZero;

function opTokenURI(uri: string) {
  return defaultAbiCoder.encode(["uint", "string"], [0x10, uri]);
}

function opDelegateVandalize(vandalizer: string) {
  return defaultAbiCoder.encode(["uint", "address"], [0x02, vandalizer]);
}

describe("CryptoVandals", () => {
  let kitty: Kitty;
  let cv: CryptoVandals;
  let deployer: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    carol: SignerWithAddress;

  beforeEach(async () => {
    [deployer, alice, bob, carol] = await ethers.getSigners();

    const KittyFactory = (await ethers.getContractFactory(
      "Kitty",
      deployer
    )) as Kitty__factory;
    kitty = await KittyFactory.deploy();
    await kitty.deployed();

    const cryptoVandalsFactory = (await ethers.getContractFactory(
      "CryptoVandals",
      deployer
    )) as CryptoVandals__factory;

    cv = await cryptoVandalsFactory.deploy();
    await cv.deployed();
  });

  describe("Wrap", async () => {
    it("mint a new CryptoVandals NFT that wraps the original token", async () => {
      await kitty.connect(alice).safeMint(alice.address, 1, "kitty/1");

      await expect(
        kitty
          .connect(alice)
          ["safeTransferFrom(address,address,uint256)"](
            alice.address,
            cv.address,
            1
          )
      )
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, cv.address, 1)
        .to.emit(cv, "Transfer")
        .withArgs(AddressZero, alice.address, 1)
        .to.emit(cv, "Vandalize")
        .withArgs(alice.address, kitty.address, 1, 1);

      expect(await cv.tokenURI(1)).equal("kitty/1");
    });

    it("mint a new CryptoVandals NFT that changes the token URI", async () => {
      await kitty.connect(alice).safeMint(alice.address, 1, "kitty/1");

      await expect(
        kitty
          .connect(alice)
          ["safeTransferFrom(address,address,uint256,bytes)"](
            alice.address,
            cv.address,
            1,
            opTokenURI("vandalized-kitty/1")
          )
      )
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, cv.address, 1)
        .to.emit(cv, "Transfer")
        .withArgs(AddressZero, alice.address, 1)
        .to.emit(cv, "Vandalize")
        .withArgs(alice.address, kitty.address, 1, 1);

      expect(await cv.tokenURI(1)).equal("vandalized-kitty/1");
    });

    it("mint a new CryptoVandals NFT that wraps the original token but allows vandalization", async () => {
      await kitty.connect(alice).safeMint(alice.address, 1, "kitty/1");

      await expect(
        kitty
          .connect(alice)
          ["safeTransferFrom(address,address,uint256,bytes)"](
            alice.address,
            cv.address,
            1,
            opDelegateVandalize(bob.address)
          )
      )
        .to.emit(kitty, "Transfer")
        .withArgs(alice.address, cv.address, 1)
        .to.emit(cv, "Transfer")
        .withArgs(AddressZero, alice.address, 1)
        .to.emit(cv, "Vandalize")
        .withArgs(alice.address, kitty.address, 1, 1);

      expect(await cv.tokenURI(1)).equal("kitty/1");
      await cv.connect(bob).setTokenURI(1, "vandalized-kitty/1");
      expect(await cv.tokenURI(1)).equal("vandalized-kitty/1");
    });
  });
});
