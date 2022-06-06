const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("User", function() {
    let users = null
    beforeEach('prepare test environment', async function () {
      const Users = await ethers.getContractFactory("Users");
      users = await Users.deploy();
      await users.deployed();
    });
    it("Should configure a user and get the current user", async function () {
      const [_,userAddress] = await ethers.getSigners();
      await users.connect(userAddress).configUser("username_prueba", "0x111111");
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
    it("Should get number of users", async function () {
      const [_,userAddress] = await ethers.getSigners();
      let number = await users.getNumberOfUsers()
      expect(number).to.equal(0)
    });
    it("Should add fav campaign and check that it is successfully added to the list", async function () {
      const [_,userAddress] = await ethers.getSigners();
      await users.addFavCampaign(userAddress.address, 0)
      let favCampaigns = await users.fetchFavCampaigns(userAddress.address)
      let fav = await users.isFavCampaign(userAddress.address, 0)
      expect(fav).to.equal(true)
      expect(favCampaigns[0]).to.equal(0)
    });
    it("Should remove fav campaign and check that it is successfully removed from the list", async function () {
      const [_,userAddress] = await ethers.getSigners();
      await users.addFavCampaign(userAddress.address, 0)
      await users.removeFavCampaign(userAddress.address, 0)
      let fav = await users.isFavCampaign(userAddress.address, 0)
      expect(fav).to.equal(false)
    });
    it("Should create a notification for replying", async function () {
      const [_,userAddress] = await ethers.getSigners();
      await users.notifyCommentReplies(userAddress.address,0,1)
      let notis = await users.fetchUserNotifications(userAddress.address)
      expect(notis.length).to.equal(1)
    })
    it("Should create a notification for reaching funding goal", async function () {
      const [_,userAddress] = await ethers.getSigners();
      await users.notifyFundsReached(userAddress.address,0)
      let notis = await users.fetchUserNotifications(userAddress.address)
      expect(notis.length).to.equal(1)
    })
    it("Should create a notification for commenting", async function () {
      const [_,userAddress] = await ethers.getSigners();
      await users.notifyCommentInYourCampaign(userAddress.address,0)
      let notis = await users.fetchUserNotifications(userAddress.address)
      expect(notis.length).to.equal(1)
    })
});
