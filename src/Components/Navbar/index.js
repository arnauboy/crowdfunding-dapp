import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';
import {setGlobalState,useGlobalState} from '../../state'

const Navbar = () => {
  const currentNetwork = useGlobalState("currentNetwork");
  const account = useGlobalState("accountSignedIn");
  let signedIn = (currentNetwork[0] == "0x89");
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
        {
        signedIn ?
        <div style={{display: "flex", alignItems: "center"}}>
          {account}
        </div>
        :
        <NavBtn>
          <NavBtnLink to='/signin'>Sign In</NavBtnLink>
        </NavBtn>
        }
      </Nav>
    </>
  );
};

export default Navbar;
