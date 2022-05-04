const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ICO", function() {
  it("Should mint the owner of the contract the initial supply of IVOs", async function () {
    const IvoryICO = await hre.ethers.getContractFactory("ICO");
    const ivoryICO = await IvoryICO.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",10000,100);
    await ivoryICO.deployed();
    let item = await ivoryICO.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    console.log("Balance of IVO in owner account:", item.toNumber());
  });
});
