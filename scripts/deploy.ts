import { ethers } from "hardhat";

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

  console.log(JSON.stringify(config, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
