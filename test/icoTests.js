const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ICO", function() {
  let ivoryICO = null
  beforeEach('prepare test environment', async function () {
    const IvoryICO = await hre.ethers.getContractFactory("ICO");
    ivoryICO = await IvoryICO.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",1000,100);
    await ivoryICO.deployed();
  });
  it("Should buy all tokens and final balance should be 0", async function () {
    let initialBalance = await ivoryICO.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    const [_,userAddress] = await ethers.getSigners();
    await ivoryICO.connect(userAddress).buy({value: ethers.utils.parseUnits('10','ether')})
    let finalBalance = await ivoryICO.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    expect(initialBalance).to.equal(ethers.utils.parseUnits("1000",'ether'))
    expect(finalBalance).to.equal(0)
  });
  it("Should withdraw the ether another user used to buy tokens", async function () {
    const IvoryICO = await hre.ethers.getContractFactory("ICO");
    const [_,userAddress,ownerAddress] = await ethers.getSigners();
    const ivoryICO = await IvoryICO.deploy(ownerAddress.address,1000,100);
    await ivoryICO.deployed();
    let initialBalance = await ivoryICO.balanceOf(ownerAddress.address)
    await ivoryICO.connect(userAddress).buy({value: ethers.utils.parseUnits('1','ether')})
    await ivoryICO.connect(ownerAddress).withdraw(ethers.utils.parseUnits('1','ether'));
  });
  it("Should fetch all contract atributes", async function () {
    let rate = await ivoryICO.rate()
    expect(rate).to.equal(100)
    let url = await ivoryICO.url()
    expect(url).to.equal("https://ivoryfund.netlify.app/")
    let info = await ivoryICO.info()
    expect(info).to.equal( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut aliquet justo. Suspendisse dapibus convallis ipsum, ut imperdiet augue varius venenatis. Sed pharetra tellus quis mattis congue. Fusce et nibh tellus. Integer molestie vulputate sapien, vitae tempus turpis suscipit ullamcorper. Nullam euismod, urna a vehicula placerat, est felis hendrerit quam, eu malesuada risus nunc ut libero. Donec congue velit eu felis euismod, eu mollis diam ultricies. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed vulputate fermentum leo, ac bibendum augue aliquet id. Fusce sagittis enim sit amet diam vulputate vulputate. Donec ultricies sapien nisl. Proin ultrices suscipit sapien, sit amet condimentum nunc pretium id. Ut venenatis sem eu nibh dignissim cursus. Donec vel tellus sit amet mauris auctor hendrerit.Vestibulum mattis eros sit amet erat maximus scelerisque. Nunc lacus nunc, sagittis ac ullamcorper ac, rutrum non ligula. Pellentesque sit amet metus mi. In ullamcorper ligula sed neque dignissim, vitae dapibus orci suscipit. Aenean hendrerit erat sit amet velit luctus condimentum quis tincidunt odio. Donec eget ornare diam. Suspendisse gravida nulla viverra neque efficitur vulputate.Donec sapien metus, sodales ut tristique nec, tincidunt vitae lacus. Quisque et nibh dui. Donec tincidunt orci libero, at dapibus dolor efficitur non. Phasellus pellentesque dapibus nisl, vel suscipit nulla commodo quis. Ut quis convallis nisi. Sed eget quam luctus, finibus tortor id, finibus enim. Sed quis libero vitae orci mollis vulputate at ut risus. Vestibulum vehicula vitae enim eget ultricies. Aliquam urna lacus, tincidunt et pretium at, luctus vel eros.Proin viverra ante ac nisi posuere, vel ornare tortor tempus. Curabitur dui arcu, vulputate sed fermentum vitae, scelerisque non diam. Aenean gravida mi vitae diam porttitor, non suscipit ligula facilisis. Quisque in rhoncus ex. Cras augue tortor, lobortis id volutpat vitae, porta eget lacus. Praesent massa urna, fringilla eget mi et, laoreet aliquet neque. Phasellus a lorem id odio maximus finibus.Vivamus ut elit sed sem semper commodo. Suspendisse ac congue erat. Proin at elit non augue pretium venenatis. Integer pellentesque vulputate egestas. Aenean cursus enim at odio pulvinar, eget rhoncus augue vestibulum. Donec condimentum finibus leo non hendrerit. Nam euismod nulla orci, sed interdum dui fermentum non. Donec id pharetra felis. Mauris finibus non urna eget pellentesque. Vestibulum ipsum mauris, consectetur eu odio eget, commodo pulvinar turpis.")
    let title = await ivoryICO.title()
    expect(title).to.equal("IvoryICO")
    let description = await ivoryICO.description()
    expect(description).to.equal("Crowdfunding platform based on ethereum")
  });
  it("Should fetch ether balance of the contract address", async function() {
    let balance = await ivoryICO.accountBalance()
    expect(balance).to.equal(0)
  })
});
