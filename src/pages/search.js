import React from 'react';
import {
  useParams
} from "react-router-dom";
import FundMarket from '../artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import {crowdfundingAddress} from "../config"
import { ethers } from 'ethers'
import {useEffect, useState} from 'react'

const Search = () => {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { searchWord } = useParams();

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

  async function donateCampaign(campaign) {}

  if (loadingState === 'loaded' && !matchingCampaigns.length) return(
    <h2> No matching campaigns with search word: {searchWord} </h2>
  )
  else if(loadingState === 'loaded') {
    return (
      <div>
        <h2> Results matching the word {searchWord}: {matchingCampaigns.length} </h2>
        <div className="flex justify-center" style={{maxWidth: "40%", margin: 'auto', maxHeight: "100px"}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
              matchingCampaigns.map((campaign, i) => {
                return (
                <div style={{maxWidth: "60%", margin: "auto", marginTop: "20px"}}>
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

export default Search;
