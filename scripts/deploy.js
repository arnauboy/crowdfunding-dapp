const hre = require("hardhat");

async function main() {
  const Crowdfunding = await hre.ethers.getContractFactory("FundMarket");
  const crowdfunding = await Crowdfunding.deploy();
  await crowdfunding.deployed();
  console.log("Crowdfunding deployed to:", crowdfunding.address);

  const IvoryICO = await hre.ethers.getContractFactory("ICO");
  const ivoryICO = await IvoryICO.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",10000,100);
  await ivoryICO.deployed();
  console.log("IvoryICO deployed to:", ivoryICO.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
