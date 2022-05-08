import './App.css';
import Navbar from './Components/Navbar';
import LeftComponent from "./Components/LeftComponent"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import About from './pages/about';
import Search from './pages/search';
import Config from './pages/config';
import SignIn from './pages/signin';
import StartCampaign from './pages/startCampaign'
import AccountSettings from './pages/accountSettings'
import ICOs from './pages/icos'
import React from 'react';
import {useGlobalState} from './state'
import { ToastContainer } from 'react-toastify';


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
          <Route path='/search' element={<Search />} />
          <Route path='/config' element={<Config />} />
          <Route path='/startCampaign' element={<StartCampaign />} />
          <Route path='/accountSettings' element={<AccountSettings />} />
          <Route path='/icos' element={<ICOs />} />
      </Routes>
    </Router>
  )


}

export default App;
