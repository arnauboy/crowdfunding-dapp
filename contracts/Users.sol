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
    }

    mapping (address => User) private addressToUser;

    function getUser(address user) public view returns (User memory) {
        return addressToUser[user];
    }

    function getCurrentUser() public view returns (User memory) {
        return addressToUser[msg.sender];
    }

     function getNumberOfUsers() public view returns (uint256) {
        return _itemIds.current();
    }

    function createUser(string calldata username, string calldata color) public payable nonReentrant {
        addressToUser[msg.sender] = User(
            username,
            payable(msg.sender),
            color
        );
        _itemIds.increment();
    }



}
