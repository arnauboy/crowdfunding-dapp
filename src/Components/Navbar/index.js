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
  const [username, setUsername] = useState('')
  const [loadingState, setLoadingState] = useState('not-loaded')
  const account = useGlobalState("accountSignedIn");
  const navigate = useNavigate()

  useEffect(() => {
    getUser() }, []
  )

  const getUser = async () => {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(usersAddress,Users.abi, provider)
      try {
        const user = await contract.getCurrentUser()
        const item = await Promise.all(user.map(async i => {
          let item = {
            username: i.username,
            userAddress : i.userAddress,
            color: i.color
          }
          console.log('username:',i.username)
          return item
        }))
        console.log(item)
        setUsername(item.username);
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
          <a href="/"><img src={ivoryLogo} style={{maxWidth: "50%",marginLeft:""}}alt= "Ivory Fund" /></a>
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
           username
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
