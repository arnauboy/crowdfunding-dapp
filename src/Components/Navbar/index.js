import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to='/' activeStyle>
            Home Page
          </NavLink>
          <NavLink to='/about' activeStyle>
            About
          </NavLink>
          <NavLink to='/config' activeStyle>
            Config
          </NavLink>
          <NavLink to='/signup' activeStyle>
            SignUp
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/signin'>Sign In</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
