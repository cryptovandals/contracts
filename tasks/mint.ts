import { task } from "hardhat/config";
import { readFile, writeFile } from "fs/promises";
import { Kitty__factory } from "../typechain";

const METADATA_BASE_URL = "http://localhost:8888/";
const KITTY_BASE_URL =
  "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/";

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateKitty() {
  const id = randomInteger(1, 100000);
  return {
    id,
    name: "Kitty #" + id,
    description: "A kitty!",
    image: KITTY_BASE_URL + id + ".png",
  };
}

task("mint", "Mint some kitties")
  .addOptionalParam("address", "the receiver")
  .setAction(async ({ address }, hre) => {
    const network = JSON.parse(
      await readFile("./artifacts/network.json", "utf8")
    );
    const [alice] = await hre.ethers.getSigners();
    const { chainId } = await hre.ethers.provider.getNetwork();

    const kittyContract = Kitty__factory.connect(
      network[chainId]["Kitty"],
      alice
    );

    for (let i = 0; i < 10; i++) {
      const metadata = generateKitty();
      await writeFile(
        "./artifacts/kitties/" + metadata.id,
        JSON.stringify(metadata)
      );
      const tx = await kittyContract.mint(METADATA_BASE_URL + metadata.id);
      const receipt = await tx.wait();
      const tokenId = receipt.events![0].args!.tokenId;
      if (address) {
        kittyContract.transferFrom(alice.address, address, tokenId);
      }
      console.log("Mint", metadata.name);
    }
  });
