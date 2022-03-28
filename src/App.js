import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import About from './pages/about';
import ClosedCampaigns from './pages/closedCampaigns';
import Config from './pages/config';
import SignIn from './pages/signin';
import React, { Component } from 'react';
import { ethers } from 'ethers'
import {useGlobalState,setGlobalState} from './state'
import { ToastContainer } from 'react-toastify';
import FundMarket from './artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import {Navigate} from 'react-router-dom'

// Update with the contract address logged out to the CLI when it was deployed
const crowdfundingAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

export function getAccount() {
  //let web3;
  let setEventListener=false;
  const correctNetwork = "0x89" //Polygon Testnet
  let network;
  //const correctNetwork = "0x13881" //Mumbai Tesnet
 console.log("Call get account for Metamask wallet connection")
 window.ethereum ?
 window.ethereum.request({method: "eth_requestAccounts"}).then((accounts) => {
   setGlobalState('accountSignedIn',accounts[0])
   window.sessionStorage.setItem('accountSignedIn', JSON.stringify(accounts[0]));
   //web3 = new ethers.providers.Web3Provider(window.ethereum)
   network = window.ethereum.chainId;
   setGlobalState('currentNetwork', network)
   window.sessionStorage.setItem('currentNetwork', JSON.stringify(network));

   // Check if network is correct
   network === correctNetwork ?
     console.log("You're on the correct network")
       :
     console.log("You're on the wrong network")

   // Set event listeners
   if (!setEventListener) {
       window.ethereum.on('accountsChanged', function () {
           getAccount()
       })

       window.ethereum.on('chainChanged', function () {
           getAccount()
       })
       setEventListener = true
   }
 }).catch((err) => console.log(err))
: console.log("Please install MetaMask")
}




function App() {

  async function fetchCampaigns() {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, provider)
      try {
        const data = await contract.fetchCampaigns();
        return data;
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  async function requestAccount() {
    await window.ethereum.request({method: "eth_requestAccounts"});
  }

  const openCampaigns = fetchCampaigns();
  console.log("Open campaigns: ", openCampaigns);
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/closedCampaigns' element={<ClosedCampaigns />} />
        <Route path='/config' element={<Config />} />
        <Route path='/signin' element={<SignIn />} />
      </Routes>
    </Router>
  )


}

export default App;
