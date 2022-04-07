import React from 'react';
import {setGlobalState,useGlobalState} from '../state'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import metamaskLogo from '../images/metamask.png'
import ivoryLogo from '../images/ivoryLogo.png'

const successToast = () => {
    toast.success("Succesfully signed in!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export function getAccount() {
  //let web3;
  let setEventListener=false;
  const correctNetwork = "0x539" //hardhat chainId
  //const correctNetwork = "0x89" //Polygon Testnet
  //const correctNetwork = "0x13881" //Mumbai Tesnet
  let network;
  console.log("Call get account for Metamask wallet connection")
  window.ethereum ?
  window.ethereum.request({method: "eth_requestAccounts"}).then((accounts) => {
   setGlobalState('accountSignedIn',accounts[0])
   window.sessionStorage.setItem('accountSignedIn', JSON.stringify(accounts[0]));
   //web3 = new ethers.providers.Web3Provider(window.ethereum)
   network = window.ethereum.chainId;
   setGlobalState('currentNetwork', network)
   window.sessionStorage.setItem('currentNetwork', JSON.stringify(network));

   // Check if network is correct
   network === correctNetwork ?
     console.log("You're on the correct network")
       :
     console.log("You're on the wrong network: ", network)

   // Set event listeners
   if (!setEventListener) {
       window.ethereum.on('accountsChanged', function () {
           getAccount()
       })

       window.ethereum.on('chainChanged', function () {
           getAccount()
       })
       setEventListener = true
   }
  }).catch((err) => console.log(err))
  : console.log("Please install MetaMask")
}

function SignIn() {
  let correctNetwork=false;
  let triedConnection = false;
  let network = useGlobalState('currentNetwork')[0]
  if(network === "0x539" ) {
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
    marginTop: "-350px",
    marginLeft: "-500px"}}>
      <h1> Welcome to Ivory Fund! </h1>
      <h2> The place for funding new projects or creating your own campaign! </h2>
      <h2 style={{color: "black"}}> Sign in and join our community!</h2>
      <div style={{margin: 'auto', maxWidth: "80%"}}>
        <div>
          <img style={{maxWidth: "50%",float: "left", marginTop: "-100px"}} src ={ivoryLogo} alt="MetamaskLogo"/>
        </div>
        <div>
          <p class="alert alert-info" role="alert" style={{ maxWidth: "50%", float: "right"}}>
          If you have not installed the Metamask plugin yet, install it <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ca" class="alert-link">here</a>.
           To add Polygon Network follow this <a href="https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/" class="alert-link"> documentation</a>.
          </p>
          <div style = {{ maxWidth: "50%", float: "right"}}>
            <button class="button-24"  onClick={getAccount}>
              <img style={{maxWidth: '15%'}} src ={metamaskLogo} alt="MetamaskLogo"/> Connect Metamask Wallet
            </button>
          </div>
          {triedConnection
          ? correctNetwork
                  ? <> </>
                  :<div style={{maxWidth: '50%',float: "right", marginTop: '30px'}} class="alert alert-warning" role="alert">
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
