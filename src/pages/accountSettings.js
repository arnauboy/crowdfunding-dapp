import {
  usersAddress
} from '../config'
import React from  'react'
import { ethers } from 'ethers'
import Users from '../artifacts/contracts/Users.sol/Users.json'
import { Navigate } from 'react-router'

class AccountSettings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      color: '',
      redirect: false
    }
    this.configUser = this.configUser.bind(this);
  }

  async configUser(event) {
    event.preventDefault()
    if ( this.state.username  === '' && this.state.description  === '') return
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(usersAddress,Users.abi, signer)
      const transaction = await contract.createUser(this.state.username, this.state.color)
      await transaction.wait()
      this.setState({redirect: true})
    }
    else console.log("Ethereum window undefined")
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to="/" />
    }
    return(
      <div>
        <h2 style={{  textAlign: "center", marginTop: "30px"}}> User settings</h2>
        <div style={{  textAlign: "center", margin: "auto", maxWidth: "40%" }}>
          <form onSubmit={this.configUser}>
            <div class="form-group">
              <label> Username </label>
                <input type = "text"  class="form-control" value={this.state.username} onChange = {(event) => this.setState({username: event.target.value})} />
            </div>
            <div class="form-group">
              <label> Color </label>
                <input type = "text"  class="form-control" value={this.state.color}  onChange = {(event) => this.setState({color: event.target.value})} />
            </div>
            <input type = 'submit' value="Confirm"/>
          </form>
        </div>
      </div>
    )
  }
};

export default AccountSettings;
