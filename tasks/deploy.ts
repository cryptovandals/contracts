import { task } from "hardhat/config";
import { writeFile } from "fs/promises";

task("deploy", "Deploy Kitty and CryptoVandals", async (_, hre) => {
  const kittyFactory = await hre.ethers.getContractFactory("Kitty");
  const cryptoVandalsFactory = await hre.ethers.getContractFactory(
    "CryptoVandals"
  );

  const kittyContract = await kittyFactory.deploy();
  await kittyContract.deployed();

  const cryptoVandalsContract = await cryptoVandalsFactory.deploy();
  await cryptoVandalsContract.deployed();

  const { chainId } = await hre.ethers.provider.getNetwork();

  const config = {
    [chainId]: {
      Kitty: kittyContract.address,
      CryptoVandals: cryptoVandalsContract.address,
    },
  };

  console.log("Configuration file in ./artifacts/network.json");
  await writeFile("./artifacts/network.json", JSON.stringify(config, null, 2));
});
