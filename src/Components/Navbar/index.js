import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu
} from './NavbarElements';
import {setGlobalState,useGlobalState} from '../../state'
import logoutImg from "../../images/logout.png"
import ivoryLogo from '../../images/ivoryLogo.png'



const logout = () => {
  setGlobalState("accountSignedIn",'')
  setGlobalState("currentNetwork",'')
  window.sessionStorage.removeItem('accountSignedIn')
  window.sessionStorage.removeItem('currentNetwork')
}

const Navbar = () => {
  const account = useGlobalState("accountSignedIn");
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
          <NavLink to='/config' activeStyle>
            Config
          </NavLink>
        </NavMenu>
        <div style={{display: "flex", alignItems: "center"}}>
          {account}
          <button class="imgButton" style={{width: "45px", marginLeft: "10px"}} onClick={logout}>
            <img style={{maxWidth: '50%'}} src ={logoutImg} alt="logout"/>
          </button>
        </div>
      </Nav>
    </>
  );
};

export default Navbar;
