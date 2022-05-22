import React from 'react';
import {
  useParams, useNavigate
} from "react-router-dom";
import FundMarket from '../artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import {crowdfundingAddress} from "../config"
import { ethers } from 'ethers'
import {useEffect, useState} from 'react'

const Search = () => {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { searchWord } = useParams();
  const navigate = useNavigate();

  const [matchingCampaigns, setMatchingCampaigns] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  async function searchCampaignsByWord(searchWord) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, provider)
      try {
          const data = await contract.fetchCampaignsByWord(searchWord);
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
          setMatchingCampaigns(items);
          setLoadingState('loaded')
          console.log(items)
      }
      catch (err){
        console.log("Error in searchword:", searchWord)
        setMatchingCampaigns([]);
        setLoadingState('loaded')
      }
    }
  }

  useEffect(() => {
    searchCampaignsByWord(searchWord) }, [searchWord]
  )

  if (loadingState === 'loaded' && !matchingCampaigns.length) return(
    <h2> No matching campaigns with search word: {searchWord} </h2>
  )
  else if(loadingState === 'loaded') {
    return (
      <div className = "main">
        <h2> Results matching the word {searchWord}: {matchingCampaigns.length} </h2>
        <div className="flex justify-center" style={{maxWidth: "50%", margin: 'auto'}}>
            <div className="grid">
            {
              matchingCampaigns.map((campaign, i) => {
                return (
                  <div key={i} className="border shadow rounded-xl" style={{ display: 'flex'}}>
                    <div style={{ float: 'left', width: "50%", margin: "23px"}}>
                      <img src={`https://ipfs.io/ipfs/${campaign.ipfsHash}`} alt="Campaign" />
                    </div>
                    <div style={{width: "50%"}}>
                      <div style = {{fontWeight: "bold", paddingLeft: "10px", paddingRight: "10px",  paddingTop: "23px"}}>
                          {campaign.title}
                      </div>
                      <div style = {{fontWeight: "normal", paddingLeft: "10px", paddingTop: "10px", paddingRight: "10px",}}>
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
  else return(<h2> loading... </h2>)

};

export default Search;
