import React from 'react';
import {Navigate, useNavigate} from 'react-router-dom'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import Users from '../artifacts/contracts/Users.sol/Users.json'
import {useGlobalState} from '../state'
import {crowdfundingAddress} from "../config"
import {usersAddress} from "../config"
import {useEffect, useState} from 'react'

const Favourites = () => {
  const [favCampaigns, setFavCampaigns] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const account = useGlobalState("accountSignedIn")[0];
  const navigate = useNavigate()

  useEffect(() => {
    loadFavCampaigns() }
  )

  async function loadFavCampaigns() {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(usersAddress,Users.abi, provider)
      try {
        const data = await contract.fetchFavCampaigns(account);
        setFavCampaigns(data);
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

  if (loadingState === 'loaded' && !favCampaigns.length) return(
    <h2 className = "main"> User doesn't have any favourite campaigns </h2>
  )
  else if(loadingState === 'loaded') {
    return (
      <div className = "main">
        <h2> My own campaigns </h2>
        <div className="flex justify-center" style={{maxWidth: "50%", margin: 'auto'}}>
            <div className="grid">
            {
              favCampaigns.map((campaign, i) => {
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

export default Favourites;
