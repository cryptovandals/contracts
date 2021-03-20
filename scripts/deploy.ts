import { ethers } from "hardhat";
import { writeFile } from "fs/promises";

async function main() {
  const kittyFactory = await ethers.getContractFactory("Kitty");
  const cryptoVandalsFactory = await ethers.getContractFactory("CryptoVandals");

  const kittyContract = await kittyFactory.deploy();
  await kittyContract.deployed();

  const cryptoVandalsContract = await cryptoVandalsFactory.deploy();
  await cryptoVandalsContract.deployed();

  // FIXME: dunno how to get the current provider
  const { chainId } = await kittyContract.provider.getNetwork();

  const config = {
    [chainId]: {
      kitty: kittyContract.address,
      cryptoVandals: cryptoVandalsContract.address,
    },
  };

  console.log("Configuration file in ./artifacts/config.json");
  await writeFile("./artifacts/config.json", JSON.stringify(config, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
