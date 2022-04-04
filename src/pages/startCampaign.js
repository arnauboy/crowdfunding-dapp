import ipfs from '../ipfs'
import React from  'react'


class StartCampaign extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ipfsHash: ''
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  captureFile (event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader =  new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
      console.log(this.state.buffer, "holi")
    }
  }


  onSubmit (event) {
    event.preventDefault()
    console.log('Submitting...')
    ipfs.files.add(this.state.buffer, (error,result) => {
      if(error){
        console.error(error)
        return
      }
      this.setState({ipfsHash: result[0].hash})
      console.log('ipfsHash', this.state.ipfsHash)
    })
  }

  render() {
    return (
      <div>
        <h1> Start Campaign</h1>
        <form onSubmit={this.onSubmit}>
          <input type = "file" onChange={this.captureFile}/>
          <input type = 'submit' />
        </form>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
      </div>
    );
  }
};

export default StartCampaign;
