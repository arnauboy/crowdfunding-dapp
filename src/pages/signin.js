import React from 'react';
import {getAccount} from '../App.js'
//import { ethers } from 'ethers'
import {useGlobalState} from '../state'
import {Navigate} from 'react-router-dom'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import metamaskLogo from '../images/metamask.png'

const successToast = () => {
    toast.success("Succesfully signed in!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

function SignIn() {
  let correctNetwork=false;
  let triedConnection = false;
  let network = useGlobalState('currentNetwork')[0]
  if(network === "0x89" ) {
    correctNetwork = true;
    successToast();
    return (<Navigate to="/"/>);
  }
  else if(network !== ''){
     triedConnection = true;
  }
  console.log(correctNetwork.toString())
  return (
    <div>
      <div style={{maxWidth: '50%',margin: 'auto'}}>
        <div class="alert alert-info" role="alert">
        Make sure you are connected to the Polygon Mainnet in Metamask.
        If you still have not installed the Metamask plugin, install it <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ca" class="alert-link">here</a>
        </div>
        <div style = {{ margin: 'auto', display: 'block'}}>
          <img style={{maxWidth: '5%'}} src ={metamaskLogo} alt="MetamaskLogo"/>
          <button class="button-24"  onClick={getAccount}>Connect Metamask Wallet</button>
        </div>
      </div>
      <div>
      {triedConnection
      ? correctNetwork
              ? <> </>
              :<div style={{maxWidth: '50%',margin: 'auto', marginTop: '30px'}} class="alert alert-warning" role="alert">
                Oops, wrong network! You should connect Metamask to Polygon Mainnet Network!
              </div>
      : <> </>
      }

      </div>
    </div>

  );
}

export default SignIn;
