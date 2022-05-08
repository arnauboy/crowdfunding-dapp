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
      expect(user.username).to.equal("username_prueba")
      expect(user.color).to.equal("0x111111")
      expect(user.address).to.equal(userAddress.address)
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
      expect(user.username).to.equal("")
      expect(user.color).to.equal("")
    });
});
