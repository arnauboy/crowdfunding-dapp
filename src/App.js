import './App.css';
import Navbar from './Components/Navbar';
import LeftComponent from "./Components/LeftComponent"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import About from './pages/about';
import ClosedCampaigns from './pages/closedCampaigns';
import Config from './pages/config';
import SignIn from './pages/signin';
import React from 'react';
import {useGlobalState,setGlobalState} from './state'
import { ToastContainer } from 'react-toastify';


export function getAccount() {
  //let web3;
  let setEventListener=false;
  const correctNetwork = "0x539" //hardhat chainId
  //const correctNetwork = "0x89" //Polygon Testnet
  //const correctNetwork = "0x13881" //Mumbai Tesnet
  let network;
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
     console.log("You're on the wrong network: ", network)

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
  let network = useGlobalState('currentNetwork')[0]
  if(network !== "0x539" ) {
    return (<SignIn/>);
  }
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <LeftComponent />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/closedCampaigns' element={<ClosedCampaigns />} />
        <Route path='/config' element={<Config />} />
      </Routes>
    </Router>
  )


}

export default App;
