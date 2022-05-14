// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ICO is ERC20, Ownable, ReentrancyGuard {

    uint256 _tokenRate;
    uint256 _supplyLeft;
    string _title;
    string _description;
    string _info;
    string _url;

    constructor(address owner, uint256 initialSupply, uint256 tokenRate) ERC20("ivoryCoin", "IVO") {
      _mint(owner, initialSupply);
      transferOwnership(owner);
      _tokenRate = tokenRate;
      _title = "IvoryICO";
      _description = "Crowdfunding platform based on ethereum";
      _info = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut aliquet justo. Suspendisse dapibus convallis ipsum, ut imperdiet augue varius venenatis. Sed pharetra tellus quis mattis congue. Fusce et nibh tellus. Integer molestie vulputate sapien, vitae tempus turpis suscipit ullamcorper. Nullam euismod, urna a vehicula placerat, est felis hendrerit quam, eu malesuada risus nunc ut libero. Donec congue velit eu felis euismod, eu mollis diam ultricies. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed vulputate fermentum leo, ac bibendum augue aliquet id. Fusce sagittis enim sit amet diam vulputate vulputate. Donec ultricies sapien nisl. Proin ultrices suscipit sapien, sit amet condimentum nunc pretium id. Ut venenatis sem eu nibh dignissim cursus. Donec vel tellus sit amet mauris auctor hendrerit.Vestibulum mattis eros sit amet erat maximus scelerisque. Nunc lacus nunc, sagittis ac ullamcorper ac, rutrum non ligula. Pellentesque sit amet metus mi. In ullamcorper ligula sed neque dignissim, vitae dapibus orci suscipit. Aenean hendrerit erat sit amet velit luctus condimentum quis tincidunt odio. Donec eget ornare diam. Suspendisse gravida nulla viverra neque efficitur vulputate.Donec sapien metus, sodales ut tristique nec, tincidunt vitae lacus. Quisque et nibh dui. Donec tincidunt orci libero, at dapibus dolor efficitur non. Phasellus pellentesque dapibus nisl, vel suscipit nulla commodo quis. Ut quis convallis nisi. Sed eget quam luctus, finibus tortor id, finibus enim. Sed quis libero vitae orci mollis vulputate at ut risus. Vestibulum vehicula vitae enim eget ultricies. Aliquam urna lacus, tincidunt et pretium at, luctus vel eros.Proin viverra ante ac nisi posuere, vel ornare tortor tempus. Curabitur dui arcu, vulputate sed fermentum vitae, scelerisque non diam. Aenean gravida mi vitae diam porttitor, non suscipit ligula facilisis. Quisque in rhoncus ex. Cras augue tortor, lobortis id volutpat vitae, porta eget lacus. Praesent massa urna, fringilla eget mi et, laoreet aliquet neque. Phasellus a lorem id odio maximus finibus.Vivamus ut elit sed sem semper commodo. Suspendisse ac congue erat. Proin at elit non augue pretium venenatis. Integer pellentesque vulputate egestas. Aenean cursus enim at odio pulvinar, eget rhoncus augue vestibulum. Donec condimentum finibus leo non hendrerit. Nam euismod nulla orci, sed interdum dui fermentum non. Donec id pharetra felis. Mauris finibus non urna eget pellentesque. Vestibulum ipsum mauris, consectetur eu odio eget, commodo pulvinar turpis.";
      _url = "https://ivoryfund.netlify.app/";
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

    function description() public view returns (string memory) {
      return _description;
    }

    function title() public view returns (string memory) {
      return _title;
    }

    function info() public view returns (string memory) {
      return _info;
    }

     function url() public view returns (string memory) {
      return _url;
    }

      function rate() public view returns (uint256) {
      return _tokenRate;
    }
}
