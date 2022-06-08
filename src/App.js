import './App.css';
import Navbar from './Components/Navbar';
import LeftComponent from "./Components/LeftComponent"
import NotificationBox from "./Components/notificationBox"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import About from './pages/about';
import Search from './pages/search';
import SignIn from './pages/signin';
import StartCampaign from './pages/startCampaign'
import AccountSettings from './pages/accountSettings'
import ICOs from './pages/icos'
import Campaign from './pages/campaign'
import IvoryICO from './pages/ico'
import MyCampaigns from './pages/myCampaigns'
import Favourites from './pages/favourites'
import Thread from './pages/thread'
import React from 'react';
import {useGlobalState} from './state'
import { ToastContainer } from 'react-toastify';


function App() {
  let network = useGlobalState('currentNetwork')[0]
  if(network !== "0x13881" ) {
    return (<SignIn/>);
  }
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <LeftComponent />
      <NotificationBox />
      <Routes>
        <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/search/:searchWord' element={<Search />} />
          <Route path='/startCampaign' element={<StartCampaign />} />
          <Route path='/accountSettings' element={<AccountSettings />} />
          <Route path='/icos' element={<ICOs />} />
          <Route path='/campaigns/:id' element={<Campaign />} />
          <Route path='/campaigns/:id/threads/:commentId' element={<Thread />} />
          <Route path='/icos/ivoryICO' element={<IvoryICO />} />
          <Route path='/my-campaigns' element={<MyCampaigns />} />
          <Route path='/favourites' element={<Favourites />} />
      </Routes>
    </Router>
  )


}

export default App;
