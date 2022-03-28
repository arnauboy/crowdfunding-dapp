import React from 'react';
import {getAccount} from '../App.js'
//import { ethers } from 'ethers'
import {useGlobalState} from '../state'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import metamaskLogo from '../images/metamask.png'
import logo from '../images/logoFalso.jpg'

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
  }
  else if(network !== ''){
     triedConnection = true;
  }
  console.log(correctNetwork.toString())
  return (
    <div style={{height: "400px",width: "1000px",
    //background: "black",
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-250px",
    marginLeft: "-500px"}}>
      <h1> Welcome to Ivory Fund </h1>
      <h2> Sign in and join our community!</h2>
      <div style={{margin: 'auto', maxWidth: "70%"}}>
        <div>
          <img style={{maxWidth: "30%",float: "left"}} src ={logo} alt="MetamaskLogo"/>
        </div>
        <div>
          <p class="alert alert-info" role="alert" style={{ maxWidth: "60%", float: "right"}}>
          Make sure you are connected to the Polygon Mainnet in Metamask.
          If you have not installed the Metamask plugin yet, install it <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ca" class="alert-link">here</a>
          </p>
          <div style = {{ maxWidth: "60%", float: "right"}}>
            <button class="button-24"  onClick={getAccount}>
              <img style={{maxWidth: '15%'}} src ={metamaskLogo} alt="MetamaskLogo"/> Connect Metamask Wallet
            </button>
          </div>
          {triedConnection
          ? correctNetwork
                  ? <> </>
                  :<div style={{maxWidth: '60%',float: "right", marginTop: '30px'}} class="alert alert-warning" role="alert">
                    Oops, wrong network! You should connect Metamask to Polygon Mainnet Network!
                  </div>
          : <> </>
          }
        </div>
      </div>
      <div>
      </div>
    </div>

  );
}

export default SignIn;
