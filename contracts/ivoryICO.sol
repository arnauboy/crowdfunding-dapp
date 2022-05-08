// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ICO is ERC20, Ownable, ReentrancyGuard {

    uint256 _tokenRate;
    uint256 _supplyLeft;

    constructor(address owner, uint256 initialSupply, uint256 tokenRate) ERC20("ivoryCoin", "IVO") {
      _mint(owner, initialSupply);
      transferOwnership(owner);
      _tokenRate = tokenRate;
      _supplyLeft = initialSupply;
    }

    /**
      * @param account (type address) address of recipient
      * @param amount (type uint256) amount of token
      * @dev function use to mint token
    */
    function mint(address account, uint256 amount) public onlyOwner {
      require(account != address(0) && amount != uint256(0), "ERC20: function mint invalid input");
      _mint(account, amount);
    }

    /**
      * @param account (type address) address of recipient
      * @param amount (type uint256) amount of token
      * @dev function use to burn token
    */
    function burn(address account, uint256 amount) public onlyOwner {
      require(account != address(0) && amount != uint256(0), "ERC20: function burn invalid input");
      _burn(account, amount);
    }

    /**
      * @dev function to buy token with ether
    */
    function buy() public payable nonReentrant {
      require(msg.sender != owner(), "Owner cannot buy his own tokens");
      require(msg.sender.balance >= msg.value && msg.value != 0 ether, "ICO: function buy invalid input");
      uint256 amount =  ( msg.value / 1000000000000000000) * _tokenRate;
      require(amount <= _supplyLeft, "ICO: in function buy, amount to buy > supplyLeft");
      _supplyLeft -= amount;
      _transfer(owner(), _msgSender(), amount);
    }

    /**
      * @param amount (type uint256) amount of ether
        * @dev function use to withdraw ether from contract
      */
    function withdraw(uint256 amount) public onlyOwner {
      require(amount <= address(this).balance, "ICO: function withdraw invalid input");
      payable(_msgSender()).transfer(amount);
    }

    function leftSupply() public view returns (uint256 supplyLeft) {
      return _supplyLeft;
    }
}
