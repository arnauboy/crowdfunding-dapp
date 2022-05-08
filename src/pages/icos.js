import React from 'react';
import ivoryCoinLogo from '../images/ivoyCoin.png'
import {ivoryICOAddress} from "../config"
import IvoryICO from '../artifacts/contracts/ivoryICO.sol/ICO.json'
import {useEffect, useState} from 'react'
import { ethers } from 'ethers'
import {useGlobalState} from '../state'
import {Navigate} from 'react-router-dom'


const ICOs = () => {
  const [ivoryIcoName, setIvoryIcoName] = useState([])
  const [ivoryLeftSupply, setIvoryLeftSupply] = useState([])
  const [ivoryTotalSupply, setIvoryTotalSupply] = useState([])
  const [ivorySymbol, setIvorySymbol] = useState([])

  useEffect(() => {
    loadICOs() }, []
  )

  async function loadICOs() {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(ivoryICOAddress,IvoryICO.abi, provider)
      try {
        const name = await contract.name();
        setIvoryIcoName(name.toString());
        const leftSupply = await contract.leftSupply();
        setIvoryLeftSupply(leftSupply.toString());
        const totalSupply = await contract.totalSupply();
        setIvoryTotalSupply(totalSupply.toString());
        const symbol = await contract.symbol();
        setIvorySymbol(symbol.toString())
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  async function infoICO() {}
  let network = useGlobalState('currentNetwork')[0]
  if(network !== "0x539" ) {
    return (<Navigate to="/signin"/>);
  }

  return (
    <div className="flex justify-center" style={{maxWidth: "40%", margin: 'auto', maxHeight: "100px"}}>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div style={{maxWidth: "60%", margin: "auto", marginTop: "20px"}}>
            <div className="border shadow rounded-xl" style={{ display: 'flex'}}>
              <div style={{ float: 'left', width: "50%"}}>
                <img src={ivoryCoinLogo} alt="ivoryCoin" />
              </div>
              <div style={{ width: "50%"}}>
                <div className="p-4">
                  <p style={{ height: '40px '}} className="text-2xl font-bold">
                    {ivoryIcoName}
                  </p>
                </div>
                <div className="p-4"  style={{backgroundColor: "#92C9A0"}} >
                  <p className="text-2xl mb-4 font-bold text-white">Tokens left to be sold: {ivoryLeftSupply} of {ivoryTotalSupply} {ivorySymbol}</p>
                  <button style={{backgroundColor: "purple"}} className="w-20 bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={infoICO()}> + Information </button>
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>

  );
}

export default ICOs;
