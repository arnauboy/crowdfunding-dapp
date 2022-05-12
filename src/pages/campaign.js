import React from 'react';
import {
  useParams
} from "react-router-dom";
import {useEffect, useState} from 'react'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import {crowdfundingAddress} from "../config"


const Campaign = () => {
  const [campaign, setCampaign] = useState([])
  const [fundsPercentage, setFundsPercentage] = useState(0)
  const [loadingState, setLoadingState] = useState('not-loaded')

  let { id } = useParams();

  useEffect(() => {
    loadCampaign(id) }, [id]
  )

  async function loadCampaign(id) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, provider)
      try {
        const data = await contract.getCampaign(id);
        let fundsRequested = ethers.utils.formatUnits(data.FundsRequested.toString(), 'ether')
        let fundsCollected = ethers.utils.formatUnits(data.FundsCollected.toString(), 'ether')
        let item = {
          fundsRequested,
          fundsCollected,
          itemId: data.itemId.toNumber(),
          owner : data.campaignOwner,
          info: data.info,
          url: data.url,
          description: data.description,
          title: data.title,
          ipfsHash: data.ipfsHash,
          totalDonators: data.totalDonators
        }
        setCampaign(item);
        setLoadingState('loaded')
        setFundsPercentage((item.fundsCollected / item.fundsRequested) * 100)
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  return (
    <div className="flex justify-center" style={{maxWidth: "40%", margin: 'auto'}}>
      <div style = {{display: "flex"}}>
        <div style={{ float: 'left', width: "20%", margin: "23px"}}>
          <img src={`https://ipfs.io/ipfs/${campaign.ipfsHash}`} alt="Campaign" />
        </div>
        <div style={{width: "70%"}}>
          <div style = {{fontSize: "60px", fontWeight: "bold", paddingLeft: "30px", paddingRight: "10px"}}>
              {campaign.title}
          </div>
          <div style = {{fontSize: "30px", fontWeight: "normal", paddingLeft: "30px", paddingRight: "10px",}}>
              {campaign.description}
          </div>
        </div>
      </div>
      <div style = {{paddingTop: "30px", fontSize: "20px" }} >
        Funds collected: {campaign.fundsCollected} of {campaign.fundsRequested} MATIC
        <div style= {{postion: "relative", display:"flex", justifyContent: "flex-end", border: "1px solid green "}} >
          <div style={{backgroundColor: "#1CA65A", height: "30px", width: `${fundsPercentage}%`}}></div>
          <div
            style={{
              background: "#EEEEEE",
              width: `${100 - fundsPercentage}%`,
              height: "30px"
            }}
          ></div>
        </div>
      </div>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> Information </p>
        <hr/>
        <div>
        {campaign.info}
        </div>
      </div>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> External URLs </p>
        <hr/>
        <div>
          <a href = {campaign.url} > {campaign.url} </a>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
