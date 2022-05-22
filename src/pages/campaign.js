import React from 'react';
import {
  useParams
} from "react-router-dom";
import {useEffect, useState} from 'react'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import Users from '../artifacts/contracts/Users.sol/Users.json'
import {crowdfundingAddress} from "../config"
import {usersAddress} from "../config"
import {toast } from 'react-toastify';
import {useGlobalState} from '../state'

const successDonationToast = () => {
    toast.success("Succesfully donated!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedDonationToast = () => {
    toast.error("Failed to donate",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const successFav = () => {
    toast.success("Succesfully added to fav list!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedFav = () => {
    toast.error("Failed adding to fav list",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const Campaign = () => {
  const [campaign, setCampaign] = useState([])
  const [fundsPercentage, setFundsPercentage] = useState(0)
  const [donation, setDonation] = useState("0")
  const account = useGlobalState("accountSignedIn")[0];
  let { id } = useParams();

  useEffect(() => {
    loadCampaign(id)}, [id]
  )

  async function donateCampaign(id, donation) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const signer = provider.getSigner()
      const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, signer)
      try {
      const transaction = await contract.donateCampaign(id, {value: ethers.utils.parseUnits(donation,'ether')})
      await transaction.wait()
      successDonationToast()
      await loadCampaign(id)
      }
      catch (err){
        console.log("Error: " , err)
        failedDonationToast()
      }
    }
    else console.log("Ethereum window undefined")
}

  async function addFavCampaign(id) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const signer = provider.getSigner()
      const contract = new ethers.Contract(usersAddress,Users.abi, signer)
      try {
      const transaction = await contract.addFavCampaign(account, id)
      await transaction.wait()
      successFav()
      await loadCampaign(id)
      }
      catch (err){
        console.log("Error: " , err)
        failedFav()
      }
    }
  else console.log("Ethereum window undefined")
}

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
          totalDonators: data.totalDonators,
          fundsReached: data.fundsReached
        }
        setCampaign(item);
        setFundsPercentage((item.fundsCollected / item.fundsRequested) * 100)
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  return (
    <div className="flex justify-center" style={{maxWidth: "40%", margin: 'auto', marginTop: "100px"}}>
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
      <div style = {{paddingTop: "30px"}}>
      <input type="checkbox" id="checkbox" />
<label for="checkbox">
 <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
   <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
     <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2"/>
     <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/>

     <g id="grp7" opacity="0" transform="translate(7 6)">
       <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
       <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
     </g>

     <g id="grp6" opacity="0" transform="translate(0 28)">
       <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
       <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
     </g>

     <g id="grp3" opacity="0" transform="translate(52 28)">
       <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
       <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
     </g>

     <g id="grp2" opacity="0" transform="translate(44 6)">
       <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
       <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
     </g>

     <g id="grp5" opacity="0" transform="translate(14 50)">
       <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
       <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
     </g>

     <g id="grp4" opacity="0" transform="translate(35 50)">
       <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
       <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
     </g>

     <g id="grp1" opacity="0" transform="translate(24)">
       <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
       <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
     </g>
   </g>
 </svg>
</label>
      </div>
      <div style = {{paddingTop: "30px", display: "flex"}}>
        <input
          style = {{ width: "30%", float: "left"}}
          type="number"
          className="form-control"
          min={0}
          max={10000000}
          step={0.01}
          value={donation}
          onChange={e => setDonation(e.target.value)}
          />
          <button style = {{marginLeft: "20px"}} className="submitButton" onClick = {() => donateCampaign(id, donation)}>Donate MATIC</button>
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
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> Owner </p>
        <hr/>
        <div>
          {campaign.owner}
        </div>
      </div>
    </div>
  );
};

export default Campaign;
