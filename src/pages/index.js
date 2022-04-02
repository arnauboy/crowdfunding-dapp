import React from 'react';
import {Navigate} from 'react-router-dom'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import {useGlobalState} from '../state'
import {crowdfundingAddress} from "../config"
import {useEffect, useState} from 'react'

const Home = () => {
  const [openCampaigns, setOpenCampaigns] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadCampaigns() }, []
  )

  async function loadCampaigns() {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider() from Web3Modal
      const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, provider)
      try {
        const data = await contract.fetchCampaigns();

        const items = await Promise.all(data.map(async i => {
          let fundsRequested = ethers.utils.formatUnits(i.FundsRequested.toString(), 'ether')
          let fundsCollected = ethers.utils.formatUnits(i.FundsCollected.toString(), 'ether')
          let item = {
            fundsRequested,
            fundsCollected,
            itemId: i.itemId.toNumber(),
            owner : i.campaignOwner,
          }
          return item
        }))
        setOpenCampaigns(items);
        setLoadingState('loaded')
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  /*async function requestAccount() {
    await window.ethereum.request({method: "eth_requestAccounts"});
  }*/
  console.log("Open campaigns: ", openCampaigns);
  let network = useGlobalState('currentNetwork')[0]
  if(network !== "0x539" ) {
    return (<Navigate to="/signin"/>);
  }

  if (loadingState === 'loaded' && !openCampaigns.length) return(
    <h1> No open campaigns</h1>
  )
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
