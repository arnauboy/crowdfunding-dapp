const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding", function () {
  it("Should create campaigns, execute donations and fetch campaigns", async function () {
    const FundMarket = await ethers.getContractFactory("FundMarket");
    const fundMarket = await FundMarket.deploy();
    await fundMarket.deployed();

    //const auctionPrice = ethers.utils.parseUnits('100','ethers')
    await fundMarket.createCampaign(ethers.utils.parseUnits('100','ether'));

    const [_,donatorAddress] = await ethers.getSigners(); //We need an address for the donator user, not the one creating the campaign

    await fundMarket.connect(donatorAddress).donateCampaign(0, { value: ethers.utils.parseUnits('10','ether')}); //Last {} is the message

    let items = await fundMarket.fetchCampaigns();

    items = await Promise.all(items.map(async i => {
      let item = {
        FundsRequested: i.FundsRequested.toString(),
        FundsCollected: i.FundsCollected.toString(),
        totalDonators: i.totalDonators.toString(),
        fundsReached: i.fundsReached,
        info: i.info,
        url: i.url,
        campaignOwner: i.campaignOwner,
        itemId: i.itemId.toString()
      }
      return item;
    }))
    console.log("Campaigns:", items);
  });
});
