import { task } from "hardhat/config";
import { writeFile } from "fs/promises";

task("deploy", "Deploy CryptoVandals", async (_, hre) => {
  console.log("Deploy CryptoVandals contract");
  const factory = await hre.ethers.getContractFactory("CryptoVandals");
  const network = hre.network.name;

  const contract = await factory.deploy();
  console.log("  Address", contract.address);
  const receipt = await contract.deployed();
  console.log("  Receipt", receipt.deployTransaction.hash);

  const { chainId } = await hre.ethers.provider.getNetwork();

  const config = {
    [chainId]: {
      CryptoVandals: contract.address,
    },
  };

  console.log(`Configuration file in ./deployments/networks.${network}.json`);
  await writeFile(
    `./deployments/networks.${network}.json`,
    JSON.stringify(config, null, 2)
  );
});

task("deploy-kitty", "Deploy Kitty", async (_, hre) => {
  console.log("Deploy Kitty contract");
  const factory = await hre.ethers.getContractFactory("Kitty");
  const network = hre.network.name;

  const contract = await factory.deploy();
  console.log("  Address", contract.address);
  const receipt = await contract.deployed();
  console.log("  Receipt", receipt.deployTransaction.hash);

  const { chainId } = await hre.ethers.provider.getNetwork();

  const config = {
    [chainId]: {
      Kitty: contract.address,
    },
  };

  console.log(`Configuration file in ./deployments/networks.${network}.json`);
  await writeFile(
    `./deployments/networks.${network}.json`,
    JSON.stringify(config, null, 2)
  );
});
