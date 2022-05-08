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
import {useState} from 'react'

const logout = () => {
  setGlobalState("accountSignedIn",'')
  setGlobalState("currentNetwork",'')
  setGlobalState("username",'')
  window.sessionStorage.removeItem('accountSignedIn')
  window.sessionStorage.removeItem('currentNetwork')
  window.sessionStorage.removeItem('username')
}

const Navbar = () => {
  const [loadingState, setLoadingState] = useState('not-loaded')
  const account = useGlobalState("accountSignedIn")[0];
  const username = useGlobalState("username")[0];
  const color = useGlobalState("color")[0];
  const navigate = useNavigate()
  console.log('color:', color)
  console.log('username: ', username)

  getUser()

  //Same function as in signin.js. Hook calls can only be done from function component body
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
        setGlobalState('username',item.username)
        window.sessionStorage.setItem('username', JSON.stringify(item.username));
        setGlobalState('color',item.color)
        window.sessionStorage.setItem('color', JSON.stringify(item.color));
        console.log("actualizado: ", item.username, item.color)
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
          <NavLink to='/icos' activeStyle>
            ICOs
          </NavLink>
          <NavLink to='/search' activeStyle>
            Search
          </NavLink>
          <NavLink to='/about' activeStyle>
            About
          </NavLink>
        </NavMenu>
        <div style={{display: "flex", alignItems: "center"}}>
          {loadingState === 'loaded' && username !== ''
          ?
          <div class="tooltip" style={{ color: color}}> {username}
            <span className="tooltiptext"> {account} </span>
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
