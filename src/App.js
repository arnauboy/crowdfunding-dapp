import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import About from './pages/about';
import ClosedCampaigns from './pages/closedCampaigns';
import Config from './pages/config';
import React from 'react';

//import { useState } from 'react';
//import { ethers } from 'ethers'
//import Crowdfunding from './artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'

// Update with the contract address logged out to the CLI when it was deployed
//const crowdfundingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
function App() {
  // store greeting in local state

  // request access to the user's MetaMask account
  /* async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
   if (typeof window.ethereum !== 'undefined') {
     await requestAccount()
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
     const transation = await contract.transfer(userAccount, amount);
     await transation.wait();
     console.log(`${amount} Coins successfully sent to ${userAccount}`);
   }
 } */

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/closedCampaigns' element={<ClosedCampaigns />} />
        <Route path='/config' element={<Config />} />
      </Routes>
    </Router>
  );
}

export default App;
