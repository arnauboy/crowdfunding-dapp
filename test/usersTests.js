const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Users", function() {
    it("Should create user and get current user", async function () {
      const Users = await hre.ethers.getContractFactory("Users");
      const users = await Users.deploy();
      await users.deployed();

      const [_,userAddress] = await ethers.getSigners();
      await users.connect(userAddress).createUser("username_prueba", "0x111111");
      let item = await users.connect(userAddress).getCurrentUser();
      const user = {
        username: item.username,
        color: item.color,
        address: item.userAddress
      }
      console.log("Current user:", user);
    });
    it("Should get user with no username and no color", async function () {
      const Users = await hre.ethers.getContractFactory("Users");
      const users = await Users.deploy();
      await users.deployed();

      const [_,userAddress] = await ethers.getSigners();
      let item = await users.getUser(userAddress.address)
      const user = {
        username: item.username,
        color: item.color,
        address: item.userAddress
      }
      console.log("User:", user);

    });
});
