// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract Users is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    struct User {
        string username;
        address payable userAddress;
        string color;
        uint[] favCampaigns;
    }

    mapping (address => User) private addressToUser;

    function getUser(address user) public view returns (User memory) {
        User memory userGot = addressToUser[user];
        return userGot;
    }

    function getCurrentUser() public view returns (User memory) {
        User memory currentUser = addressToUser[msg.sender];
        return currentUser;
    }

     function getNumberOfUsers() public view returns (uint256) {
        return _itemIds.current();
    }

    function createUser(string calldata username, string calldata color) public payable nonReentrant {
        addressToUser[msg.sender] = User(
            username,
            payable(msg.sender),
            color,
            new uint[](0)
        );
        _itemIds.increment();
    }

    function addFavCampaign(address user, uint campaignId) public nonReentrant {
      User storage currentUser = addressToUser[user];
      currentUser.favCampaigns.push(campaignId);
  }

  function fetchFavCampaigns(address user) public view returns (uint[] memory){
      User memory currentUser = addressToUser[user];
      return currentUser.favCampaigns;
  }
}
