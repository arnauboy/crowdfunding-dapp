import React from 'react';
import {Navigate, useNavigate} from 'react-router-dom'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/fundMarket.sol/FundMarket.json'
import Users from '../artifacts/contracts/Users.sol/Users.json'
import {useGlobalState} from '../state'
import {fundMarketAddress} from "../config"
import {usersAddress} from "../config"
import {useEffect, useState} from 'react'

const Favourites = () => {
  const [favCampaigns, setFavCampaigns] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const account = useGlobalState("accountSignedIn")[0];
  const navigate = useNavigate()

  useEffect(() => {
    loadFavCampaigns(account) }, [account]
  )

  async function loadFavCampaigns(account) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(usersAddress,Users.abi, provider)
      const provider2 = new ethers.providers.Web3Provider(window.ethereum);
      const contract2 = new ethers.Contract(crowdfundingAddress,FundMarket.abi, provider2)
      try {
        const data = await contract.fetchFavCampaigns(account);
        const favCampaignsIDs = data;
        let campaigns = []
        for(const id of favCampaignsIDs) {
            const campaignId = id.toNumber()
            const data2 = await contract2.getCampaign(campaignId)
            let fundsRequested = ethers.utils.formatUnits(data2.FundsRequested.toString(), 'ether')
            let fundsCollected = ethers.utils.formatUnits(data2.FundsCollected.toString(), 'ether')
            let item = {
              fundsRequested,
              fundsCollected,
              itemId: data2.itemId.toNumber(),
              description: data2.description,
              title: data2.title,
              ipfsHash: data2.ipfsHash,
            }
            campaigns.push(item)
          }
        setFavCampaigns(campaigns);
        setLoadingState('loaded')
      }
      catch (err){
        console.log("Error: " , err)
          setFavCampaigns([]);
      }
    }
  }

  let network = useGlobalState('currentNetwork')[0]
  if(network !== "0x539" ) {
    return (<Navigate to="/signin"/>);
  }


  console.log("when display", favCampaigns)

  if (loadingState === 'loaded' && !favCampaigns.length) return(
    <h2 className = "main"> User doesn't have any favourite campaigns </h2>
  )
  else if(loadingState === 'loaded') {
    return (
      <div className = "main">
        <h2> Favourite campaigns </h2>
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
