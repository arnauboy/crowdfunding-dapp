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
        bool created;
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

    function configUser(string calldata username, string calldata color) public payable nonReentrant {
        User storage currentUser = addressToUser[msg.sender];
        if(!currentUser.created) {
            addressToUser[msg.sender] = User(
                username,
                payable(msg.sender),
                color,
                new uint[](0),
                true
            );
            _itemIds.increment();
        }
        else {
            currentUser.username = username;
            currentUser.color = color;
        }
    }

    function addFavCampaign(address user, uint campaignId) public nonReentrant{
      User memory currentUser = addressToUser[user];
      if(!currentUser.created) {
           addressToUser[msg.sender] = User(
            "",
            payable(msg.sender),
            "",
            new uint[](0),
            true
        );
        _itemIds.increment();
      }
    User storage finaluser = addressToUser[user];
    finaluser.favCampaigns.push(campaignId);
    }

    function removeFavCampaign(address user, uint campaignId) public nonReentrant {
        User storage currentUser = addressToUser[user];
        uint[] storage favCampaigns = currentUser.favCampaigns;
        uint index = favCampaigns.length;
        //find the index for campaignId
        for(uint i=0; i < favCampaigns.length; ++i) {
            if(favCampaigns[i] == campaignId) index = i;
        }
        //remove item and keep array ordered
        require(index != favCampaigns.length, "Id not found");
        for(uint j = index; j < favCampaigns.length-1; j++){
         favCampaigns[j] = favCampaigns[j+1];
        }
        favCampaigns.pop();
    }

    function fetchFavCampaigns(address user) public view returns (uint[] memory){
        User memory currentUser = addressToUser[user];
        return currentUser.favCampaigns;
    }

    function isFavCampaign(address user, uint campaignId) public view returns (bool){
            User memory currentUser = addressToUser[user];
            uint[] memory favCampaigns = currentUser.favCampaigns;
            for (uint i=0; i < favCampaigns.length; ++i){
                if (favCampaigns[i] == campaignId) return true;
            }
            return false;
        }
}
