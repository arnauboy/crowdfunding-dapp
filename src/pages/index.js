import React from 'react';
import {Navigate, useNavigate} from 'react-router-dom'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/fundMarket.sol/FundMarket.json'
import {useGlobalState} from '../state'
import {fundMarketAddress} from "../utils/addresses"
import {useEffect, useState} from 'react'

const Home = () => {
  const [openCampaigns, setOpenCampaigns] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const navigate = useNavigate()

  useEffect(() => {
    loadCampaigns() }, []
  )

  async function loadCampaigns() {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(fundMarketAddress,FundMarket.abi, provider)
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

  let network = useGlobalState('currentNetwork')[0]
  if(network !== "0x539" ) {
    return (<Navigate to="/signin"/>);
  }

  if (loadingState === 'loaded' && !openCampaigns.length) return(
    <h2 className = "main"> No open campaigns</h2>
  )
  else if(loadingState === 'loaded') {
    return (
      <div className = "main">
        <h2> Open campaigns </h2>
        <div className="flex justify-center" style={{maxWidth: "50%", margin: 'auto'}}>
            <div className="grid">
            {
              openCampaigns.map((campaign, i) => {
                return (
                  <div key={i} className="border shadow rounded-xl" style={{ display: 'flex'}}>
                    <div style={{ float: 'left', width: "50%", margin: "23px"}}>
                      <img src={`https://ipfs.io/ipfs/${campaign.ipfsHash}`} alt="Campaign" />
                    </div>
                    <div style={{width: "50%"}}>
                      <div style = {{fontWeight: "bold", paddingLeft: "10px", paddingRight: "10px",  paddingTop: "23px"}}>
                          {campaign.title}
                      </div>
                      <div style = {{fontWeight: "normal", paddingLeft: "10px", paddingTop: "10px", paddingRight: "10px"}}>
                          {campaign.description}
                      </div>
                      <div className="p-2"  style={{backgroundColor: "#FFFFFF", maxHeight: "50%"}} >
                        <p className="text-2xl mb-2 font-bold text-black">{campaign.fundsCollected} /{campaign.fundsRequested} MATIC</p>
                        <button style={{backgroundColor: "#92C9A0"}} className=" text-white font-bold py-2 px-12 rounded" onClick={(event) => {  navigate(`/campaigns/${campaign.itemId}`)}}>
                          <div style={{padding: "5px"}}>
                            Information
                          </div>
                        </button>
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
  else return(<h2 className = "main"> loading... </h2>)
};

export default Home;
