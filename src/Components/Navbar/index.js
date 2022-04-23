import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu
} from './NavbarElements';
import {setGlobalState,useGlobalState} from '../../state'
import logoutImg from "../../images/logout.png"
import ivoryLogo from '../../images/ivoryLogo.png'
import userSettings from '../../images/user_settings.jpg'
import { useNavigate } from 'react-router-dom'
import {
  usersAddress
} from '../../config'
import Users from '../../artifacts/contracts/Users.sol/Users.json'
import { ethers } from 'ethers'
import {useEffect, useState} from 'react'

const logout = () => {
  setGlobalState("accountSignedIn",'')
  setGlobalState("currentNetwork",'')
  window.sessionStorage.removeItem('accountSignedIn')
  window.sessionStorage.removeItem('currentNetwork')
}

const Navbar = () => {
  const [user, setUser] = useState('')
  const [loadingState, setLoadingState] = useState('not-loaded')
  const account = useGlobalState("accountSignedIn");
  const navigate = useNavigate()

  useEffect(() => {
    getUser() }, []
  )

  async function getUser() {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(usersAddress,Users.abi, provider)
      try {
        const user = await contract.getCurrentUser()
        let item = {
          username: user.username,
          userAddress : user.userAddress,
          color: user.color
        }
        setUser(item);
        setLoadingState('loaded')
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }


  return (
    <>
      <Nav>
        <NavMenu>
          <a href="/"><img src={ivoryLogo} style={{width: "50px",marginLeft:""}}alt= "Ivory Fund" /></a>
          <NavLink to='/' activeStyle>
            Home
          </NavLink>
          <NavLink to='/closedCampaigns' activeStyle>
            Closed campaigns
          </NavLink>
          <NavLink to='/about' activeStyle>
            About
          </NavLink>
        </NavMenu>
        <div style={{display: "flex", alignItems: "center"}}>
          {loadingState === 'loaded'
          ?
          <div class="tooltip" style={{color: user.color}}> {user.username}
            <span className="tooltiptext"> {user.userAddress} </span>
          </div>

          : account
          }
          <button class="imgButton" style={{width: "45px", marginLeft: "10px"}} onClick={logout}>
            <img style={{maxWidth: '50%'}} src ={logoutImg} alt="logout"/>
          </button>
          <button class="imgButton" style={{width: "45px", marginLeft: "-10px"}} onClick={() => navigate('/accountSettings')}>
            <img style={{maxWidth: '70%'}} src ={userSettings} alt="settings"/>
          </button>
        </div>
      </Nav>
    </>
  );
};

export default Navbar;
