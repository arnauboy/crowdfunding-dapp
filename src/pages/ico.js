import React from 'react';
import { ethers } from 'ethers'
import {toast } from 'react-toastify';
import {useEffect, useState} from 'react'
import {ivoryICOAddress} from "../config"
import ICO from '../artifacts/contracts/ivoryICO.sol/ICO.json'
import ivoryCoinLogo from '../images/ivoyCoin.png'

const successBuyToast = () => {
    toast.success("Succesfully bought!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedBuyToast = () => {
    toast.error("Failed to buy",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };
const IvoryICO = () => {
  const [ico, setICO] = useState([])
  const [fundsPercentage, setFundsPercentage] = useState(0)
  const [donation, setDonation] = useState("0")


  useEffect(() => {
    loadICO() }, []
  )

  async function donateico(donation) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
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
        const item = {
          name: name,
          leftSupply:  leftSupply.toString(),
          totalSupply: totalSupply.toString(),
          symbol: symbol,
          description: description,
          info: info,
          url: url,
          title: title,
          owner: owner,
          rate: rate

        }
        console.log("item", item)
        setICO(item);
        setFundsPercentage((item.leftSupply / item.totalSupply) * 100)
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  return(
    <div className="flex justify-center" style={{maxWidth: "40%", margin: 'auto'}}>
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
      <div style = {{paddingTop: "30px", display: "flex"}}>
        <input
          style = {{ width: "30%", float: "left"}}
          type="number"
          class="form-control"
          min={0}
          max={ico.totalSupply}
          step={1}
          value={donation}
          onChange={e => setDonation(e.target.value)}
          />

          <p style = {{padding: "5px"}}>
              = {donation / ico.rate } MATIC
          </p>
          <button style = {{marginLeft: "20px"}}class="submitButton" onClick = {() => donateico(donation)}>Buy tokens</button>
      </div>
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
        <p style = {{fontSize: "20px"}}> Owner </p>
        <hr/>
        <div>
          {ico.owner}
        </div>
      </div>
    </div>
  );
};

export default IvoryICO;
