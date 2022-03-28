import React from 'react';
import {Navigate} from 'react-router-dom'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import {useGlobalState} from '../state'

// Update with the contract address logged out to the CLI when it was deployed
const crowdfundingAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

const Home = () => {
  async function fetchCampaigns() {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, provider)
      try {
        const data = await contract.fetchCampaigns();
        return data;
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  /*async function requestAccount() {
    await window.ethereum.request({method: "eth_requestAccounts"});
  }*/

  const openCampaigns = fetchCampaigns();
  console.log("Open campaigns: ", openCampaigns);

  let network = useGlobalState('currentNetwork')[0]
  if(network !== "0x89" ) {
    return (<Navigate to="/signin"/>);
  }
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
