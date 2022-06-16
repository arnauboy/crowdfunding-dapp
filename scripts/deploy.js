const hre = require("hardhat");

async function main() {
  const Users = await hre.ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.deployed();
  console.log("Users deployed to:", users.address);

  const FundMarket = await hre.ethers.getContractFactory("FundMarket");
  //We pass users address in the constructor function to connect both contracts
  const fundMarket = await FundMarket.deploy(users.address);
  await fundMarket.deployed();
  console.log("FundMarket deployed to:", fundMarket.address);

  const IvoryICO = await hre.ethers.getContractFactory("ICO");
  const ivoryICO = await IvoryICO.deploy("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",10000,100);
  await ivoryICO.deployed();
  console.log("IvoryICO deployed to:", ivoryICO.address);

  const ICOComments = await hre.ethers.getContractFactory("ICOComments");
  const icoComm = await ICOComments.deploy();
  await icoComm.deployed();
  console.log("ICOComments deployed to:", icoComm.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
