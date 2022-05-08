const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ICO", function() {
  it("It should have 0 balance at the end of the execution", async function () {
    const IvoryICO = await hre.ethers.getContractFactory("ICO");
    const ivoryICO = await IvoryICO.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",1000,100);
    await ivoryICO.deployed();
    let initialBalance = await ivoryICO.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    const [_,userAddress] = await ethers.getSigners();
    await ivoryICO.connect(userAddress).buy({value: ethers.utils.parseUnits('10','ether')})
    let finalBalance = await ivoryICO.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    expect(initialBalance).to.equal(1000)
    expect(finalBalance).to.equal(0)
  });
  it("Owner should withdraw the ether another user used to buy tokens", async function () {
    const IvoryICO = await hre.ethers.getContractFactory("ICO");
    const [_,userAddress,ownerAddress] = await ethers.getSigners();
    const ivoryICO = await IvoryICO.deploy(ownerAddress.address,1000,100);
    await ivoryICO.deployed();
    let initialBalance = await ivoryICO.balanceOf(ownerAddress.address)
    await ivoryICO.connect(userAddress).buy({value: ethers.utils.parseUnits('1','ether')})
    await ivoryICO.connect(ownerAddress).withdraw(ethers.utils.parseUnits('1','ether'));
  });
});
