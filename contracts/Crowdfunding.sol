// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";
contract FundMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _closedCampaigns;
  Counters.Counter private _commentIds;

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

  //Comments and replies to comments
  struct Comment {
    uint commentId;
    address commentator;
    string message;
    uint campaignId;
    uint parentCommentId; //0 if not a reply to a comment
  }

  mapping(uint256 => FundingCampaign) private idToFundingCampaign;
  mapping(uint256 => Comment) private idToComment;

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

   function contains(string memory what, string memory where) private pure returns (bool )
   {
    bytes memory whatBytes = bytes (what);
    bytes memory whereBytes = bytes (where);

    bool found = false;

    if(whereBytes.length < whatBytes.length) return found;

    for (uint i = 0; i <= whereBytes.length - whatBytes.length; i++) {
        bool flag = true;
        for (uint j = 0; j < whatBytes.length; j++)
            if (whereBytes [i + j] != whatBytes [j]) {
                flag = false;
                break;
            }
        if (flag) {
            found = true;
            break;
        }
    }
    return found;
  }

  function fetchCampaignsByWord(string calldata searchWord) public view returns (FundingCampaign[] memory) {
    uint itemCount = _itemIds.current();

    //Returning dynamic-length array of struct is still a bit tricky in Solidity (even in the current 0.8 version)
    //That's why we need to determine the count to create the fixed-length array afterwards

    uint countOfMatchingCampaigns = 0;
    for (uint i = 0; i < itemCount; i++) {
      FundingCampaign storage currentItem1 = idToFundingCampaign[i];
      if(contains(searchWord, currentItem1.title)) {
        countOfMatchingCampaigns += 1;
      }
    }

    uint currentIndex = 0;


    FundingCampaign[] memory items = new FundingCampaign[](countOfMatchingCampaigns);
    if(countOfMatchingCampaigns > 0) {
      for (uint i = 0; i < itemCount && currentIndex < countOfMatchingCampaigns; i++) {
        FundingCampaign memory currentItem2 = idToFundingCampaign[i];
        if(contains(searchWord, currentItem2.title)) {
          items[currentIndex] = currentItem2;
          currentIndex += 1;
        }
      }
    }
    return items;
  }

  function fetchMyCampaigns(address myAddress) public view returns (FundingCampaign[] memory) {
    uint itemCount = _itemIds.current();
    uint currentIndex = 0;

    uint itemsMine = 0;
    for (uint i =0; i<itemCount; ++i) {
      if (idToFundingCampaign[i].campaignOwner == myAddress) {
        ++itemsMine;
      }
    }

    FundingCampaign[] memory myItems = new FundingCampaign[](itemsMine);
    for (uint i = 0; i < itemCount; i++) {
      if (idToFundingCampaign[i].campaignOwner == myAddress) {
        uint currentItemId = i;
        FundingCampaign memory currentItem = idToFundingCampaign[currentItemId];
        myItems[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return myItems;
  }

  //Comment have id >= 1, because we use parentCommentId = 0 for those comments which are not replies
  function comment(address user, string calldata message, uint campaignId) public nonReentrant{
    _commentIds.increment();
    uint id = _commentIds.current();
    idToComment[id] = Comment(
      id,
      user,
      message,
      campaignId,
      0
    );
  }

  function reply(address user, string calldata message, uint parentCommentId, uint campaignId) public nonReentrant{
    require(parentCommentId != 0, "Wrong parent identifier");
    _commentIds.increment();
    uint id = _commentIds.current();
    idToComment[id] = Comment(
      id,
      user,
      message,
      campaignId,
      parentCommentId
    );
  }

  //Get campaign comments. Replies excluded
  function getComments(uint campaign) public view returns (Comment[] memory){
    uint commentsCount = _commentIds.current();
    uint nComments = 0;
    for (uint i = 1; i <= commentsCount; ++i) {
      if (idToComment[i].campaignId == campaign && idToComment[i].parentCommentId == 0) {
        ++nComments;
      }
    }

    Comment[] memory comments = new Comment[](nComments);
    uint currentIndex = 0;
    for (uint i = 1; i <= commentsCount; i++) {
      if (idToComment[i].campaignId == campaign && idToComment[i].parentCommentId == 0) {
        uint currentItemId = i;
        Comment memory currentItem = idToComment[currentItemId];
        comments[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return comments;
  }

  //Get comment replies
  function getReplies(uint commentId) public view returns (Comment[] memory) {
    require(commentId != 0, "Comment identifier cannot be zero");
    uint commentsCount = _commentIds.current();
    uint nReplies = 0;
    for (uint i = 1; i<= commentsCount; ++i) {
      if (idToComment[i].parentCommentId == commentId) {
        ++nReplies;
      }
    }

    Comment[] memory replies = new Comment[](nReplies);
    uint currentIndex = 0;
    for (uint i = 1; i <= commentsCount; i++) {
      if (idToComment[i].parentCommentId == commentId) {
        uint currentItemId = i;
        Comment memory currentItem = idToComment[currentItemId];
        replies[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return replies;
  }

  function getComment(uint256 id) public view returns (Comment memory) {
        return idToComment[id];
  }

}
