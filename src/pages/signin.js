import React from 'react';
import App, {getAccount} from '../App.js'
import { ethers } from 'ethers'
import {setGlobalState,useGlobalState} from '../state'
import {Navigate} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const successToast = () => {
    toast.success("Succesfully signed in!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

function SignIn() {
  let correctNetwork=false;
  let triedConnection = false;
  let network = useGlobalState('currentNetwork')[0]
  if(network == "0x89" ) {
    correctNetwork = true;
    successToast();
    return (<Navigate to="/"/>);
  }
  else if(network != ''){
     triedConnection = true;
  }
  console.log(correctNetwork.toString())
  return (
    <div>
      <div style={{maxWidth: '50%',margin: 'auto'}}>
        <button class="button-24" role="button" onClick={getAccount}>Connect Metamask Wallet</button>
      </div>
      <div>
      {triedConnection
      ? correctNetwork
              ? <> </>
              :<div style={{maxWidth: '50%',margin: 'auto', marginTop: '30px'}} class="alert alert-warning" role="alert">
                Oops! You should connect Metamask to Polygon Mainnet Network!
              </div>
      : <> </>
      }

      </div>
    </div>

  );
}

export default SignIn;
