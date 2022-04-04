// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";
contract FundMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _closedCampaigns;

  struct FundingCampaign {
      uint itemId;
      address payable campaignOwner;
      uint256 FundsRequested;
      uint256 FundsCollected;
      uint256 totalDonators;
      bool fundsReached;
      string title;
      string description;
      string info;
      string url;
      string ipfsHash;
  }

  mapping(uint256 => FundingCampaign) private idToFundingCampaign;


  event CampaignStarted (
    uint indexed itemId,
    address campaignOwner,
    uint256 FundsRequested
  );

  function getCampaign(uint256 itemId) public view returns (FundingCampaign memory) {
        return idToFundingCampaign[itemId];
  }

  function createCampaign(
    uint256 FundsRequested, string calldata title, string calldata description, string calldata info, string calldata url, string calldata ipfsHash
  ) public payable nonReentrant {
    require(FundsRequested > 0, "The requested funds must be at least 1 wei");
    uint256 itemId = _itemIds.current();
    idToFundingCampaign[itemId] =  FundingCampaign(
      itemId,
      payable(msg.sender),
      FundsRequested,
      0,
      0,
      false,
      title,
      description,
      info,
      url,
      ipfsHash
    );

  emit CampaignStarted (
      itemId,
       payable(msg.sender),
       FundsRequested
    );

  _itemIds.increment();
  }

  function donateCampaign (
        uint256 itemId
    ) public payable nonReentrant {
      require(itemId < _itemIds.current(), "Item id does not exist");
        require(msg.value > 0, "Please donate a minimum of 1 wei in order to complete the operation");
        FundingCampaign storage campaign = idToFundingCampaign[itemId];
        require(msg.sender != campaign.campaignOwner, "You cannot donate to your own funding campaign");
        campaign.FundsCollected += msg.value;
        campaign.campaignOwner.transfer(msg.value);
        campaign.totalDonators += 1;
        //if s'ha igualat o superat el que es volia recaptar s'elimina del marketplace
        if(campaign.FundsCollected >= campaign.FundsRequested) {
          _closedCampaigns.increment();
          campaign.fundsReached = true;
        }
    }

  function fetchCampaigns() public view returns (FundingCampaign[] memory) {
    uint itemCount = _itemIds.current();
    uint itemClosed = _closedCampaigns.current();
    uint currentIndex = 0;

    FundingCampaign[] memory items = new FundingCampaign[](itemCount - itemClosed);
    for (uint i = 0; i < itemCount; i++) {
      if (!idToFundingCampaign[i].fundsReached) {
        uint currentItemId = i;
        FundingCampaign memory currentItem = idToFundingCampaign[currentItemId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchMyCampaigns() public view returns (FundingCampaign[] memory) {
    uint itemCount = _itemIds.current();
    uint currentIndex = 0;

    uint itemsMine = 0;
    for (uint i =0; i<itemCount; ++i) {
      if (idToFundingCampaign[i].campaignOwner == msg.sender) {
        ++itemsMine;
      }
    }

    FundingCampaign[] memory myItems = new FundingCampaign[](itemsMine);
    for (uint i = 0; i < itemCount; i++) {
      if (idToFundingCampaign[i].campaignOwner == msg.sender) {
        uint currentItemId = i;
        FundingCampaign memory currentItem = idToFundingCampaign[currentItemId];
        myItems[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return myItems;
  }
}
