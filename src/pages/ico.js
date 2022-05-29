import React from 'react';
import { ethers } from 'ethers'
import {toast } from 'react-toastify';
import {useEffect, useState} from 'react'
import {ivoryICOAddress} from "../config"
import ICO from '../artifacts/contracts/ivoryICO.sol/ICO.json'
import ivoryCoinLogo from '../images/ivoyCoin.png'
import {useGlobalState} from '../state'


const successBuyToast = () => {
    toast.success("Succesfully bought!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const successWithdrawToast = () => {
    toast.success("Succesfully withdrawn!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedBuyToast = () => {
    toast.error("Failed to buy",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };
const IvoryICO = () => {
  const [ico, setICO] = useState([])
  const [fundsPercentage, setFundsPercentage] = useState(0)
  const [donation, setDonation] = useState("0")
  const [withdraw, setWithdraw] = useState("0")
  const account = useGlobalState("accountSignedIn")[0];
  console.log(account)
  useEffect(() => {
    loadICO() }
  )

  async function donateico(donation) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ivoryICOAddress,ICO.abi, signer)
      try {
      const value = parseInt(donation) / ico.rate
      const transaction = await contract.buy({value: ethers.utils.parseUnits(value.toString(),'ether')})
      await transaction.wait()
      successBuyToast()
      await loadICO()
      }
      catch (err){
        console.log("Error: " , err)
        failedBuyToast()
      }
    }
    else console.log("Ethereum window undefined")
}

async function withdrawEther(withdraw) {
  if(typeof window.ethereum !== 'undefined' && withdraw !== "0" ){
    const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
    const signer = provider.getSigner()
    const contract = new ethers.Contract(ivoryICOAddress,ICO.abi, signer)
    try {
    const transaction = await contract.withdraw( ethers.utils.parseUnits(withdraw,'ether'))
    await transaction.wait()
    setWithdraw("0")
    successWithdrawToast()
    }
    catch (err){
      console.log("Error: " , err)
    }
  }
  else console.log("Ethereum window undefined")
}

  async function loadICO() {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(ivoryICOAddress,ICO.abi, provider)
      try {
        const name = await contract.name();
        const leftSupply = await contract.leftSupply();
        const totalSupply = await contract.totalSupply();
        const symbol = await contract.symbol();
        const owner = await contract.owner();
        const title = await contract.title();
        const description = await contract.description();
        const url = await contract.url();
        const info = await contract.info();
        const rate = await contract.rate();
        const balance = await contract.accountBalance();
        const item = {
          name: name,
          leftSupply:  ethers.utils.formatUnits(leftSupply.toString(), 'ether'), //format as ether because my token has 10 ** 18 decimals
          totalSupply: ethers.utils.formatUnits(totalSupply.toString(), 'ether'),
          symbol: symbol,
          description: description,
          info: info,
          url: url,
          title: title,
          owner: owner.toLowerCase(),
          rate: rate,
          balance: ethers.utils.formatUnits(balance.toString(), 'ether')
        }
        setICO(item);
        setFundsPercentage((item.leftSupply / item.totalSupply) * 100)
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  return(
    <div className="flex justify-center" style={{maxWidth: "50%", margin: 'auto', marginTop: "100px"}}>
      <div style = {{display: "flex"}}>
        <div style={{ float: 'left', width: "20%", margin: "23px"}}>
          <img src={ivoryCoinLogo} alt="ico" />
        </div>
        <div style={{width: "70%"}}>
          <div style = {{fontSize: "60px", fontWeight: "bold", paddingLeft: "30px", paddingRight: "10px"}}>
              {ico.title}
          </div>
          <div style = {{fontSize: "30px", fontWeight: "normal", paddingLeft: "30px", paddingRight: "10px",}}>
              {ico.description}
          </div>
        </div>
      </div>
      {ico.owner !== account
        ?
        <div style = {{paddingTop: "30px", display: "flex"}}>
          <input
            style = {{ width: "30%", float: "left"}}
            type="number"
            className="form-control"
            min={0}
            max={ico.totalSupply}
            step={1}
            value={donation}
            onChange={e => setDonation(e.target.value)}
            />
            <p style = {{padding: "5px"}}>
                = {donation / ico.rate } MATIC
            </p>
            <button style = {{marginLeft: "20px"}} className = "submitButton" onClick = {() => donateico(donation)}>Buy tokens</button>
            </div>
        : <div style = {{paddingTop: "30px", display: "flex"}}>
          <input
            style = {{ width: "30%", float: "left"}}
            type = "number"
            className = "form-control"
            min = {0}
            max = {ico.totalSupply / ico.rate}
            step = {0.01}
            value = {withdraw}
            onChange = {e => setWithdraw(e.target.value)}
            />
            <button style = {{marginLeft: "20px",marginRight: "20px", maxHeight: "40px"}} className = "submitButton" onClick = {() => withdrawEther(withdraw)}>Withdraw MATIC</button>
            <div class="alert alert-primary" role="alert">
              Available MATIC: {ico.balance}
            </div>
            </div>
    }

      <div style = {{paddingTop: "30px", fontSize: "20px" }} >
        Supply left: {ico.leftSupply} of {ico.totalSupply} {ico.symbol}
        <div style= {{postion: "relative", display:"flex", justifyContent: "flex-end", border: "1px solid green "}} >
          <div style={{backgroundColor: "#1CA65A", height: "30px", width: `${100 - fundsPercentage}%`}}></div>
          <div
            style={{
              background: "#EEEEEE",
              width: `${fundsPercentage}%`,
              height: "30px"
            }}
          ></div>
        </div>
      </div>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> Information </p>
        <hr/>
        <div>
        {ico.info}
        </div>
      </div>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> External URLs </p>
        <hr/>
        <div>
          <a href = {ico.url} > {ico.url} </a>
        </div>
      </div>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> Adddresses </p>
        <hr/>
        <div>
          Owner: {ico.owner}
        </div>
        <div>
          Contract: {ivoryICOAddress}
        </div>
      </div>
    </div>
  );
};

export default IvoryICO;
