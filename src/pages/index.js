import React from 'react';
import {Navigate} from 'react-router-dom'
import {useGlobalState,setGlobalState} from '../state'

const Home = () => {
  let network = useGlobalState('currentNetwork')[0]
  if(network !== "0x89" ) {
    return (<Navigate to="/signin"/>);
  }
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
