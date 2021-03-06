import React from 'react';
import {setGlobalState,useGlobalState} from '../state'
import 'react-toastify/dist/ReactToastify.css';
import ivoryLogo from '../images/ivoryLogo.png'
import {blockchain} from '../utils/addresses'
import {successToast} from '../utils/toasts'

  const logout = () => {
    setGlobalState("accountSignedIn",'')
    setGlobalState("currentNetwork",'')
    setGlobalState("username",'')
    setGlobalState("color",'')
    window.sessionStorage.removeItem('accountSignedIn')
    window.sessionStorage.removeItem('currentNetwork')
    window.sessionStorage.removeItem('username')
    window.sessionStorage.removeItem('color')
  }


export function getAccount() {
  logout()
  let setEventListener=false;
  const correctNetwork = blockchain
  let network;
  window.ethereum ?
  window.ethereum.request({method: "eth_requestAccounts"}).then((accounts) => {
   setGlobalState('accountSignedIn',accounts[0])
   window.sessionStorage.setItem('accountSignedIn', JSON.stringify(accounts[0]));
   network = window.ethereum.chainId;
   setGlobalState('currentNetwork', network)
   window.sessionStorage.setItem('currentNetwork', JSON.stringify(network));

   // Check if network is correct
   network === correctNetwork ?
      //getUser()
      console.log("You are on the correct network: ", network)
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
  if(network === blockchain ) {
    correctNetwork = true;
    successToast();
  }
  else if(network !== ''){
     triedConnection = true;
  }
  return (
    <div style={{height: "400px",width: "1000px",
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
          <img style={{maxWidth: "50%",float: "left", marginTop: "-100px"}} src ={ivoryLogo} alt="IvoryLogo"/>
        </div>
        <div>
          <p className = "alert alert-info" role="alert" style={{ maxWidth: "50%", float: "right"}}>
          If you have not installed the Metamask plugin yet, install it <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ca" className = "alert-link">here</a>.
           To add Polygon Network follow this <a href="https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/" className = "alert-link"> documentation</a>.
          </p>
          <div style = {{width: "100%"}}>
            <button className = "button-24"  onClick={getAccount}>
               Connect Metamask Wallet
            </button>
          </div>
          {triedConnection
          ? correctNetwork
                  ? <> </>
                  :<div style={{maxWidth: '50%',float: "right", marginTop: '30px'}} className = "alert alert-warning" role="alert">
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
