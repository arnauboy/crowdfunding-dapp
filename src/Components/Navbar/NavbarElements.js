import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  height: 100px;
  display: flex;
  padding: 0.2rem calc((100vw - 1000px) / 2);
  position: fixed;
  top: 0;
  background-color: white;
`;

export const NavLink = styled(Link)`
  color: #1CA65A;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #000000;
    text-decoration: none;
  }
  &:hover {
    color: #000000;
    text-decoration: none;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: 100px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;
  /* Third Nav */
  /* justify-content: flex-end;
  width: 100vw; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
