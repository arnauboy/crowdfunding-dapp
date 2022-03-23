import React from 'react';
import App, {getAccount} from '../App.js'
import { ethers } from 'ethers'

function SignIn() {

  return (
    <div style={{maxWidth: '50%',margin: 'auto'}}>
      <button class="button-24" role="button" onClick={getAccount}>Connect Metamask Wallet</button>
    </div>
  );
}

export default SignIn;
