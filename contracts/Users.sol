// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract Users is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _notifsIds;
    enum notiType{ REPLY, FUNDS_REACHED, FAV_CAMPAIGN_FUNDS_REACHED } //REPLY = 0, FUNDS_REACHED = 1, FAV_CAMPAIGN_FUNDS_REACHED = 2

    struct User {
        string username;
        address payable userAddress;
        string color;
        uint[] favCampaigns;
        bool created;
    }

    struct Notification {
        uint id;
        notiType notification_type; //"comment", "fundsReached" or "favCampaignClosed"
        uint campaignId;
        uint commentId;
        address user;
    }

    mapping (address => User) private addressToUser;
    mapping (uint256 => Notification) private idToNotification;


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

    function isFavCampaign(address user, uint campaignId) public view returns (bool) {
            User memory currentUser = addressToUser[user];
            uint[] memory favCampaigns = currentUser.favCampaigns;
            for (uint i=0; i < favCampaigns.length; ++i){
                if (favCampaigns[i] == campaignId) return true;
            }
            return false;
        }

    function notifyCommentReplies(address user,uint campaignId, uint commentId) public nonReentrant {
        User memory currentUser = addressToUser[user];
        if(!currentUser.created) {
            addressToUser[msg.sender] = User(
                "",
                payable(user),
                "",
                new uint[](0),
                true
            );
            _itemIds.increment();
        }
        //Create notification
        uint256 notiId = _notifsIds.current();
        idToNotification[notiId] = Notification(
            notiId,
            notiType.REPLY,
            campaignId,
            commentId,
            user
        );
        _notifsIds.increment();
    }

    function notifyFundsReached(address user,uint campaignId) public nonReentrant {
        User memory currentUser = addressToUser[user];
        if(!currentUser.created) {
            addressToUser[msg.sender] = User(
                "",
                payable(user),
                "",
                new uint[](0),
                true
            );
            _itemIds.increment();
        }
        //Create notification
        uint256 notiId = _notifsIds.current();
        idToNotification[notiId] = Notification(
            notiId,
            notiType.FUNDS_REACHED,
            campaignId,
            0,
            user
        );
        _notifsIds.increment();
    }

    function notifyFavCampaignFundsReached(address user,uint campaignId) public nonReentrant {
        User memory currentUser = addressToUser[user];
        if(!currentUser.created) {
            addressToUser[msg.sender] = User(
                "",
                payable(user),
                "",
                new uint[](0),
                true
            );
            _itemIds.increment();
        }
        //Create notification
        uint256 notiId = _notifsIds.current();
        idToNotification[notiId] = Notification(
            notiId,
            notiType.FAV_CAMPAIGN_FUNDS_REACHED,
            campaignId,
            0,
            user
        );
        _notifsIds.increment();
    }

    //Function that returns 6 last user notifications
    function fetchUserNotifications (address user) public view returns (Notification[] memory) {
        uint num_notis = _notifsIds.current();

        //Count number of user notifications to declare dynamic array
        uint count_user_notis = 0;
        for (uint i = 0; i<num_notis; ++i) {
            if (idToNotification[i].user == user) ++count_user_notis;
        }

        if(count_user_notis > 6) count_user_notis = 6;

        Notification[] memory user_notifications = new Notification[](count_user_notis);

        //Push notifications to the array and return. They are returned from new to old
        uint currentIndex = 0;
        for (uint i = num_notis; i>0 && currentIndex < count_user_notis; --i) {
            if (idToNotification[i-1].user == user){
                user_notifications[currentIndex] = idToNotification[i-1];
                ++currentIndex;
            }
        }

        return user_notifications;
    }
}
