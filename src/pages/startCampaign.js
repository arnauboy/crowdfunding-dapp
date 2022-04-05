import ipfs from '../ipfs'
import React from  'react'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import { Navigate } from 'react-router'

const fundMarketAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

class StartCampaign extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ipfsHash: '',
      title: '',
      description: '',
      info: '',
      url: '',
      FundsRequested: 0,
      redirect: false
    }
    this.captureFile = this.captureFile.bind(this);
    this.createCampaign = this.createCampaign.bind(this);
  }




  captureFile (event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader =  new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
      console.log("ipfsHash:", this.state.buffer)
    }
  }

  async createCampaign (event) {
    event.preventDefault()
    console.log(this.state)
    ipfs.files.add(this.state.buffer, (error,result) => {
      if(error){
        console.error(error)
        return
      }
      this.setState({ipfsHash: result[0].hash})
      console.log('ipfsHash', this.state.ipfsHash)
    })
    if ( this.state.title  === '' || this.state.description  === '' || this.state.info  === '' ||
       this.state.url === '' || this.state.FundsRequested === 0) return
    if (typeof window.ethereum !== 'undefined') {
      console.log("Start creating campaign")
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(fundMarketAddress,FundMarket.abi, signer)
      const transaction = await contract.createCampaign(ethers.utils.parseUnits(this.state.FundsRequested,'ether'),this.state.title,this.state.description,this.state.info,this.state.url,this.state.ipfsHash)
      await transaction.wait()
      console.log("Finished creating campaign")
      this.setState({redirect: true})
    }
    else console.log("Ethereum window undefined")
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to="/" />
    }
    return (
      <div>
        <h2 style={{  textAlign: "center", marginTop: "30px"}}> Start Campaign</h2>
        <div style={{  textAlign: "center", margin: "auto", maxWidth: "40%" }}>
          <form onSubmit={this.createCampaign}>
            <div class="form-group">
              <label> *Title </label>
                <input type = "text"  class="form-control" value={this.state.title} onChange = {(event) => this.setState({title: event.target.value})} />
            </div>
            <div class="form-group">
              <label> *Description </label>
                <input type = "text"  class="form-control" value={this.state.description}  onChange = {(event) => this.setState({description: event.target.value})} />
            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2"> *Information </label>
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={this.state.info}  onChange = {(event) => this.setState({info: event.target.value})} />
            </div>
            <div class="form-group">
              <label> *URL   </label>
                <input type = "text"  class="form-control" value={this.state.url} onChange = {(event) => this.setState({url: event.target.value})} />
            </div>
            <div class="form-group">
              <label> *Funds Requested (MATIC)   </label>
                <input
                  type="number"
                  class="form-control"
                  min={0}
                  max={10000000}
                  step={0.01}
                  value={this.state.FundsRequested}
                  onChange={e => this.setState({FundsRequested: e.target.value})}
                  />
            </div>
            <div>
              <label> Image  </label>
                <input type = "file" class="form-control-file" onChange={this.captureFile}/>
            </div>
            <input type = 'submit' value="Start"/>
          </form>
          <img  style={{maxWidth: "40%"}}rc={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
        </div>
      </div>
    );
  }
};

export default StartCampaign;
