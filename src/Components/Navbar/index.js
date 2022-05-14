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
  setGlobalState("color",'')
  window.sessionStorage.removeItem('accountSignedIn')
  window.sessionStorage.removeItem('currentNetwork')
  window.sessionStorage.removeItem('username')
  window.sessionStorage.removeItem('color')
}

const Navbar = () => {
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [searchWord,setSearchWord] = useState('')
  const account = useGlobalState("accountSignedIn")[0];
  const username = useGlobalState("username")[0];
  const color = useGlobalState("color")[0];
  const navigate = useNavigate()
  console.log('color:', color)
  console.log('username: ', username)

  getUser() //Not using useEffect because it was not being updated when username and color are changed in global variables

  //Same function as in signin.js. Hook calls can only be done from function component body
  async function getUser() {
    console.log("get user is executed")
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(usersAddress,Users.abi, provider)
      try {
        const user = await contract.getUser(account)
        let item = {
          username: user.username,
          userAddress : user.userAddress,
          color: user.color
        }
        console.log("user logged in", item)
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

  const searchCampaigns = (event) => {
    if (event.key === 'Enter') {
      const word = event.target.value
      setSearchWord('')
      navigate(`/search/${word}`)
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
          <NavLink to='/about' activeStyle>
            About
          </NavLink>
          <div className="input-group rounded">
            <input type="search" className="form-control rounded" placeholder="Search..."
             aria-label="Search" aria-describedby="search-addon" value = {searchWord} onChange = {(event) => setSearchWord(event.target.value)} onKeyDown={searchCampaigns}  />
          </div>
        </NavMenu>
        <div style={{display: "flex", alignItems: "center"}}>
          {loadingState === 'loaded' && username !== ''
          ?
          <div className="tooltip" style={{ color: color}}> {username}
            <span className="tooltiptext"> {account} </span>
          </div>
          : account
          }
          <button className="imgButton" style={{width: "45px", marginLeft: "10px"}} onClick={logout}>
            <img style={{maxWidth: '50%'}} src ={logoutImg} alt="logout"/>
          </button>
          <button className="imgButton" style={{width: "45px", marginLeft: "-10px"}} onClick={() => navigate('/accountSettings')}>
            <img style={{maxWidth: '70%'}} src ={userSettings} alt="settings"/>
          </button>
        </div>
      </Nav>
    </>
  );
};

export default Navbar;
