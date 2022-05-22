import {
  usersAddress
} from '../config'
import React from  'react'
import { ethers } from 'ethers'
import Users from '../artifacts/contracts/Users.sol/Users.json'
import { Navigate } from 'react-router'
import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'

class AccountSettings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      color: '#000000',
      redirect: false,
      showPicker: false,
    }
    this.configUser = this.configUser.bind(this);
  }

  onClick = () => {
        this.setState({
          showPicker: !this.state.showPicker
        })
    };

    onClose = () => {
      this.setState({
        showPicker: false
      })
    };

    onChange = (color) => {
        this.setState({
          color: color.hex
        })
    };

  async configUser(event) {
    event.preventDefault()
    if ( this.state.username  === '') return
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(usersAddress,Users.abi, signer)
      const transaction = await contract.configUser(this.state.username, this.state.color)
      await transaction.wait()
      this.setState({redirect: true})
    }
    else console.log("Ethereum window undefined")
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to="/" />
    }

    const styles = reactCSS({
       'default': {
         color: {
           width: '40px',
           height: '15px',
           borderRadius: '3px',
           background: this.state.color,
         },
         popover: {
           position: 'absolute',
           zIndex: '3',
         },
         cover: {
           position: 'fixed',
           top: '0px',
           right: '0px',
           bottom: '0px',
           left: '0px',
         },
         swatch: {
           padding: '6px',
           background: '#ffffff',
           borderRadius: '2px',
           cursor: 'pointer',
           display: 'inline-block',
           boxShadow: '0 0 0 1px rgba(0,0,0,.2)',
         },
       },
     });

    return(
      <div className = "main">
        <h2 style={{  textAlign: "center", marginTop: "30px"}}> User settings</h2>
        <div style={{  textAlign: "center", margin: "auto", maxWidth: "40%" }}>
          <form onSubmit={this.configUser}>
            <div class="form-group">
              <label> Username </label>
                <input type = "text"  class="form-control" value={this.state.username} onChange = {(event) => this.setState({username: event.target.value})} />
            </div>
            <div class="form-group">
              <label> Color </label>
                <input type = "text"  class="form-control" style={{maxWidth: "100px", margin: "auto"}}value={this.state.color}  onChange = {(event) => this.setState({color: event.target.value})} />
            </div>
            <div>
              <div style={ styles.swatch } onClick={ this.onClick }>
                <div style={ styles.color } />
              </div>
              { this.state.showPicker ? <div style={ styles.popover }>
                <div style={ styles.cover } onClick={ this.onClose }/>
                <SketchPicker color={ this.state.color } onChange={ this.onChange } />
              </div> : null }

            </div>
            <div style = {{padding: "30px"}}>
              <button class="submitButton" type = "submit">Confirm</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
};

export default AccountSettings;
