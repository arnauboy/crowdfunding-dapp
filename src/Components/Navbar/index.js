import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu
} from './NavbarElements';
import {setGlobalState,useGlobalState} from '../../state'
import logoutImg from "../../images/logout.png"

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
          <NavLink to='/' activeStyle>
            Home Page
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
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <div style={{display: "flex", alignItems: "center", fontWeight: "bold"}}>
          {account}
          <button class="imgButton" style={{maxWidth: '10%'}} onClick={logout}>
            <img style={{maxWidth: '50%'}} src ={logoutImg} alt="logout"/>
          </button>
        </div>
      </Nav>
    </>
  );
};

export default Navbar;
