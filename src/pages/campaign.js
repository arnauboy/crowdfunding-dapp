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
import star from '../images/star.png'
import star_filled from '../images/star_complete.png'

const successDonationToast = () => {
    toast.success("Succesfully donated!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedDonationToast = () => {
    toast.error("Failed to donate",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const successFav = () => {
    toast.success("Succesfully added to fav list!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const successUnfav = () => {
    toast.success("Succesfully removed from fav list!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedUnfav = () => {
    toast.error("Failed removing from fav list",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedFav = () => {
    toast.error("Failed adding to fav list",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const Campaign = () => {
  const [campaign, setCampaign] = useState([])
  const [fav, setFav] = useState(false)
  const [fundsPercentage, setFundsPercentage] = useState(0)
  const [donation, setDonation] = useState("0")
  const account = useGlobalState("accountSignedIn")[0];
  let { id } = useParams();

  useEffect(() => {
    loadCampaign(id)
    }
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

  async function addFavCampaign(account, id) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const signer = provider.getSigner()
      const contract = new ethers.Contract(usersAddress,Users.abi, signer)
      try {
      const transaction = await contract.addFavCampaign(account, id)
      await transaction.wait()
      successFav()
      await checkFav(id)
      }
      catch (err){
        console.log("Error: " , err)
        failedFav()
      }
    }
  else console.log("Ethereum window undefined")
}

  async function removeFavCampaign(account, id) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const signer = provider.getSigner()
      const contract = new ethers.Contract(usersAddress,Users.abi, signer)
      try {
      const transaction = await contract.removeFavCampaign(account, id)
      await transaction.wait()
      successUnfav()
      await checkFav(id)
      }
      catch (err){
        console.log("Error: " , err)
        failedUnfav()
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

        await checkFav(id)
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  async function checkFav(id) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(usersAddress,Users.abi, provider)
      try {
        const data = await contract.isFavCampaign(account,id);
        setFav(data);
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
          <div style = {{display: "flex"}}>
            <div style = {{fontSize: "60px", fontWeight: "bold", paddingLeft: "30px", paddingRight: "10px", float: "left"}}>
                {campaign.title}
            </div>
            <div style = {{paddingTop: "40px", maxWidth: "5%"}}>
            { !fav
              ?
              <button style = {{border: "none", outline: "none"}} onClick = {() => addFavCampaign(account, id)}>
                <img src = {star} alt = "Not favourite"/>
              </button>
              :
              <button style = {{border: "none", outline: "none"}} onClick = {() => removeFavCampaign(account, id)}>
                <img src = {star_filled} alt = "Favourite"/>
              </button>
            }
            </div>
          </div>
          <div style = {{fontSize: "30px", fontWeight: "normal", paddingLeft: "30px", paddingRight: "10px",}}>
              {campaign.description}
          </div>
        </div>
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
