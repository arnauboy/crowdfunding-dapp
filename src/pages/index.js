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
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
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
            info: i.info,
            description: i.description,
            title: i.title,
            ipfsHash: i.ipfsHash
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

  async function donateCampaign(campaign) {}
  let network = useGlobalState('currentNetwork')[0]
  if(network !== "0x539" ) {
    return (<Navigate to="/signin"/>);
  }

  if (loadingState === 'loaded' && !openCampaigns.length) return(
    <h2> No open campaigns</h2>
  )
  else if(loadingState === 'loaded') {
    return (
      <div>
        <h2> Open campaigns </h2>
        <div className="flex justify-center" style={{maxWidth: "50%", margin: 'auto'}}>
            <div className="grid">
            {
              openCampaigns.map((campaign, i) => {
                return (
                <div style={{marginTop: "20px"}}>
                  <div key={i} className="border shadow rounded-xl" style={{ display: 'flex'}}>
                    <div style={{ float: 'left', width: "50%"}}>
                      <img src={`https://ipfs.io/ipfs/${campaign.ipfsHash}`} alt="Campaign" />
                    </div>
                    <div style={{width: "50%"}}>
                      <div className="p-4">
                        <p style={{ height: '40px '}} className="text-2xl font-bold">
                          {campaign.title}
                        </p>
                        <div style={{ overflow:'hidden'}}>
                          <p className="text-gray-400">{campaign.description} </p>
                        </div>
                      </div>
                      <div className="p-4"  style={{backgroundColor: "#92C9A0"}} >
                        <p className="text-2xl mb-4 font-bold text-white">{campaign.fundsCollected} /{campaign.fundsRequested} MATIC</p>
                        <button style={{backgroundColor: "purple"}} className="w-20 bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={donateCampaign(campaign)}> + Information </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
              })
            }
            </div>
          </div>

      </div>
    );
  }
  else return(<h2> loading... </h2>)
};

export default Home;
