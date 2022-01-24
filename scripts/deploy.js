
const hre = require("hardhat");

const deployedContracts = {};

async function deployContract(name, ...constructorArgs) {
  if (constructorArgs.length === 0) {
    constructorArgs = null;
  }

  const Contract = await hre.ethers.getContractFactory(name);
  const contract = await Contract.deploy.apply(Contract, constructorArgs);

  return await contract
    .deployed()
    .then(() => {
      console.log(`${name} deployed to:`, contract.address);
      deployedContracts[name] = contract.address;
      return contract;
    }).catch((err) => {
      console.log(arguments);
    });
};


async function main() {

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
