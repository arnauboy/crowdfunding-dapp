import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import About from './pages/about';
import ClosedCampaigns from './pages/closedCampaigns';
import Config from './pages/config';
import SignIn from './pages/signin';
import React, { Component } from 'react';
//import { ethers } from 'ethers'
import {setGlobalState} from './state'
import { ToastContainer } from 'react-toastify';
//import Crowdfunding from './artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'

// Update with the contract address logged out to the CLI when it was deployed
//const crowdfundingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

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

class App extends Component {

  render() {
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

  };
}

export default App;
