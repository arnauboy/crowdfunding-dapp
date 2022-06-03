const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FundMarket", function () {
  let fundMarket = null
  beforeEach('prepare test environment', async function () {
    const FundMarket = await ethers.getContractFactory("FundMarket");
    fundMarket = await FundMarket.deploy();
    await fundMarket.deployed();
  });
  it("Should create campaigns, execute donations and fetch campaigns", async function () {
    await fundMarket.createCampaign(ethers.utils.parseUnits('100','ether'),'Ivory Fund','bla bla bla','bla bla bla', 'bla bla bla','ipfshash');

    const [_,donatorAddress] = await ethers.getSigners(); //We need an address for the donator user, not the one creating the campaign

    await fundMarket.connect(donatorAddress).donateCampaign(0, { value: ethers.utils.parseUnits('99','ether')}); //Last {} is the message

    let items = await fundMarket.fetchCampaigns();

    items = await Promise.all(items.map(async i => {
      let item = {
        FundsRequested: i.FundsRequested.toString(),
        FundsCollected: i.FundsCollected.toString(),
        totalDonators: i.totalDonators.toString(),
        fundsReached: i.fundsReached,
        title: i.title,
        description: i.description,
        info: i.info,
        url: i.url,
        campaignOwner: i.campaignOwner,
        itemId: i.itemId.toString(),
        ipfsHash: i.ipfsHash
      }
      return item;
    }))
    expect(items).to.have.lengthOf(1)
    expect(items[0].fundsReached).to.equal(false)
  });
  it("Should fetch a specific campaign", async function() {
    await fundMarket.createCampaign(ethers.utils.parseUnits('100','ether'),'Ivory Fund','bla bla bla','bla bla bla', 'bla bla bla','ipfshash');
    let item = await fundMarket.getCampaign(0)
    expect(item).to.not.equal(null)
  })
  it("Should fetch campaigns that include a word", async function() {
    await fundMarket.createCampaign(ethers.utils.parseUnits('100','ether'),'Ivory Fund','bla bla bla','bla bla bla', 'bla bla bla','ipfshash');
    let item = await fundMarket.fetchCampaignsByWord("Ivory")
    expect(item).to.not.equal(null)
  })
  it("Should create a campaign and fetch created ones", async function () {
    const [_,userAddress] = await ethers.getSigners();
    await fundMarket.connect(userAddress).createCampaign(ethers.utils.parseUnits('100','ether'),'Ivory Fund','bla bla bla','bla bla bla', 'bla bla bla','ipfshash');
    let items = await fundMarket.fetchMyCampaigns(userAddress.address);
    expect(items).to.have.lengthOf(1)
  });
  it("Should comment a campaign, reply it, and get both comments", async function () {
    const [_,userAddress] = await ethers.getSigners();
    await fundMarket.connect(userAddress).createCampaign(ethers.utils.parseUnits('100','ether'),'Ivory Fund','bla bla bla','bla bla bla', 'bla bla bla','ipfshash');
    await fundMarket.comment(userAddress.address, "This is a test comment",0)
    await fundMarket.reply(userAddress.address, "This is a test reply",1,0)
    let comments = await fundMarket.getComments(0)
    let replies = await fundMarket.getReplies(1)
    expect(comments).to.have.lengthOf(1)
    expect(replies).to.have.lengthOf(1)
    expect(comments[0].message).to.equal("This is a test comment")
    expect(replies[0].message).to.equal("This is a test reply")
  });
});
