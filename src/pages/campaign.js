import React from 'react';
import {
  useParams, useNavigate
} from "react-router-dom";
import {useEffect, useState} from 'react'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/Crowdfunding.sol/FundMarket.json'
import Users from '../artifacts/contracts/Users.sol/Users.json'
import {crowdfundingAddress} from "../config"
import {usersAddress} from "../config"
import {toast } from 'react-toastify';
import {useGlobalState} from '../state'
import star from '../images/star.png'
import star_filled from '../images/star_complete.png'

const successDonationToast = () => {
    toast.success("Succesfully donated!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedDonationToast = () => {
    toast.error("Failed to donate",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const successFav = () => {
    toast.success("Succesfully added to fav list!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const successUnfav = () => {
    toast.success("Succesfully removed from fav list!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const successComment = () => {
    toast.success("Succesfully commented!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedUnfav = () => {
    toast.error("Failed removing from fav list",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedFav = () => {
    toast.error("Failed adding to fav list",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const failedComment = () => {
    toast.error("Failed to comment. User must have a username",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const Campaign = () => {
  const [user,setUser] = useState({}) //Used when getting users from blockchain
  const [campaign, setCampaign] = useState([])
  const [comments, setComments] = useState([])
  const [fav, setFav] = useState(false)
  const [fundsPercentage, setFundsPercentage] = useState(0)
  const [donation, setDonation] = useState("0")
  const [commentBox, setCommentBox] = useState("")
  const [replyBox, setReplyBox] = useState("")
  const [replyId, setReplyId] = useState(0) //ReplyId is the id of the comment user is replying.It is initially set to 0 because Ids start at 1
  const account = useGlobalState("accountSignedIn")[0];
  const username = useGlobalState("username")[0];
  const color = useGlobalState("color")[0];
  let { id } = useParams();
  const navigate = useNavigate()


  useEffect(() => {
    loadCampaign(id); loadComments(id)
  }, [account] // eslint-disable-line react-hooks/exhaustive-deps
  )

  async function donateCampaign(id, donation) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const signer = provider.getSigner()
      const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, signer)
      try {
      const transaction = await contract.donateCampaign(id, {value: ethers.utils.parseUnits(donation,'ether')})
      await transaction.wait()
      successDonationToast()
      await loadCampaign(id)
      }
      catch (err){
        console.log("Error: " , err)
        failedDonationToast()
      }
    }
    else console.log("Ethereum window undefined")
}

  async function addFavCampaign(account, id) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const signer = provider.getSigner()
      const contract = new ethers.Contract(usersAddress,Users.abi, signer)
      try {
      const transaction = await contract.addFavCampaign(account, id)
      await transaction.wait()
      successFav()
      await checkFav(id)
      }
      catch (err){
        console.log("Error: " , err)
        failedFav()
      }
    }
  else console.log("Ethereum window undefined")
}

  async function removeFavCampaign(account, id) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const signer = provider.getSigner()
      const contract = new ethers.Contract(usersAddress,Users.abi, signer)
      try {
      const transaction = await contract.removeFavCampaign(account, id)
      await transaction.wait()
      successUnfav()
      await checkFav(id)
      }
      catch (err){
        console.log("Error: " , err)
        failedUnfav()
      }
    }
  else console.log("Ethereum window undefined")
  }

  async function loadCampaign(id) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, provider)
      try {
        const data = await contract.getCampaign(id);
        let fundsRequested = ethers.utils.formatUnits(data.FundsRequested.toString(), 'ether')
        let fundsCollected = ethers.utils.formatUnits(data.FundsCollected.toString(), 'ether')
        let item = {
          fundsRequested,
          fundsCollected,
          itemId: data.itemId.toNumber(),
          owner : data.campaignOwner,
          info: data.info,
          url: data.url,
          description: data.description,
          title: data.title,
          ipfsHash: data.ipfsHash,
          totalDonators: data.totalDonators,
          fundsReached: data.fundsReached
        }
        setCampaign(item);
        setFundsPercentage((item.fundsCollected / item.fundsRequested) * 100)

        await checkFav(id)
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  async function checkFav(id) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(usersAddress,Users.abi, provider)
      try {
        const data = await contract.isFavCampaign(account,id);
        setFav(data);
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  async function loadComments(id){
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, provider)
      try {
        const data = await contract.getComments(id);
        const items = await Promise.all(data.map(async i => {
          let item = {
            commentId: i.commentId.toNumber(),
            commentator : i.commentator,
            message: i.message,
            parentCommentId: i.parentCommentId.toNumber()
          }
          return item
        }))
        setComments(items);
        console.log("Comments:",comments)
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  async function addComment(id){
    if (typeof window.ethereum !== 'undefined'){
      console.log("add comment")
    //  await getUser(account)

      if(username !== '' && commentBox !== "") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, signer)
        try {
        const transaction = await contract.comment(account,commentBox,id)
        await transaction.wait()
        successComment()
        await loadComments(id)
        }
        catch (err){
          console.log("Error: " , err)
          failedComment()
        }
      }
      else failedComment()
    }
  }

  async function addReply(commentId){
    if (typeof window.ethereum !== 'undefined'){

      if(username !== '') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(crowdfundingAddress,FundMarket.abi, signer)
        try {
        console.log(commentId)
        const transaction = await contract.reply(account,replyBox,commentId,id)
        await transaction.wait()
        successComment()
        setReplyId(0)
        setReplyBox("")
        await loadComments(id)
        }
        catch (err){
          console.log("Error: " , err)
          failedComment()
        }
      }
      else failedComment()
    }
  }

  async function getUser(userAccount) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(usersAddress,Users.abi, provider)
      try {
        const data = await contract.getUser(userAccount)
        let item = {
          username: data.username,
          userAddress : data.userAddress,
          color: data.color
        }
        setUser(item);
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  return (
    <div className="flex justify-center" style={{maxWidth: "50%", margin: 'auto', marginTop: "100px"}}>
      <div style = {{display: "flex"}}>
        <div style={{ float: 'left', width: "20%", margin: "23px"}}>
          <img src={`https://ipfs.io/ipfs/${campaign.ipfsHash}`} alt="Campaign" />
        </div>
        <div style={{width: "70%"}}>
          <div style = {{display: "flex"}}>
            <div style = {{fontSize: "60px", fontWeight: "bold", paddingLeft: "30px", paddingRight: "10px", float: "left"}}>
                {campaign.title}
            </div>
            <div style = {{paddingTop: "40px", maxWidth: "5%"}}>
            { !fav
              ?
              <button style = {{border: "none", outline: "none"}} onClick = {() => addFavCampaign(account, id)}>
                <img src = {star} alt = "Not favourite"/>
              </button>
              :
              <button style = {{border: "none", outline: "none"}} onClick = {() => removeFavCampaign(account, id)}>
                <img src = {star_filled} alt = "Favourite"/>
              </button>
            }
            </div>
          </div>
          <div style = {{fontSize: "30px", fontWeight: "normal", paddingLeft: "30px", paddingRight: "10px",}}>
              {campaign.description}
          </div>
        </div>
      </div>

      <div style = {{paddingTop: "30px", display: "flex"}}>
        <input
          style = {{ width: "30%", float: "left"}}
          type="number"
          className="form-control"
          min={0}
          max={10000000}
          step={0.01}
          value={donation}
          onChange={e => setDonation(e.target.value)}
          />
          <button style = {{marginLeft: "20px"}} className="submitButton" onClick = {() => donateCampaign(id, donation)}>Donate MATIC</button>
      </div>
      <div style = {{paddingTop: "30px", fontSize: "20px" }} >
        Funds collected: {campaign.fundsCollected} of {campaign.fundsRequested} MATIC
        <div style= {{postion: "relative", display:"flex", justifyContent: "flex-end", border: "1px solid green "}} >
          <div style={{backgroundColor: "#1CA65A", height: "30px", width: `${fundsPercentage}%`}}></div>
          <div
            style={{
              background: "#EEEEEE",
              width: `${100 - fundsPercentage}%`,
              height: "30px"
            }}
          ></div>
        </div>
      </div>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> Information </p>
        <hr/>
        <div>
        {campaign.info}
        </div>
      </div>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> External URLs </p>
        <hr/>
        <div>
          <a href = {campaign.url} > {campaign.url} </a>
        </div>
      </div>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> Owner </p>
        <hr/>
        <div>
          {campaign.owner}
        </div>
      </div>
      <div style = {{paddingTop: "30px"}}>
        <input
          className="form-control"
          value={commentBox}
          onChange={e => setCommentBox(e.target.value)}
          placeholder="Add a comment..."
          />
        <button style = {{marginTop: "10px"}}type="button" className="btn btn-outline-secondary" onClick={() => addComment(id) }>Comment</button>
      </div>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> User comments </p>
        <hr/>
        {
          comments.map((comment, i) => {
            //getUser(comment.commentator)

            return (
              <div key={i} className="card p-3" style = {{marginTop: "30px"}}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="user d-flex flex-row align-items-center">
                    <span><small className="font-weight-bold text-primary">
                    {username !== ''
                    ?
                    <div className="tooltip" style={{ color: color}}> {username}
                      <span className="tooltiptext"> {account} </span>
                    </div>
                    : account
                    }
                    </small> <small className="font-weight-bold">{comment.message}</small></span>
                  </div>
                  </div>
                  <div className="action d-flex justify-content-between mt-2 align-items-center">
                    <div className="reply">
                      <small> <button style = {{textDecoration: "underline"}} onClick={() => setReplyId(comment.commentId)}>Reply </button></small>
                      <small> <button style = {{textDecoration: "underline"}} onClick={() => {  navigate(`threads/${comment.commentId}`)}}> Thread </button></small>
                     </div>

                  </div>
                  {replyId === comment.commentId &&
                     <div style = {{paddingTop: "30px"}}>
                        <input
                          className="form-control"
                          value={replyBox}
                          onChange={e => setReplyBox(e.target.value)}
                          placeholder="Add a reply..."
                          />
                          <button style = {{marginTop: "10px"}}type="button" className="btn btn-outline-secondary" onClick={() => addReply(comment.commentId) }>Reply</button>
                          <button style = {{marginTop: "10px"}}type="button" className="btn btn-outline-danger" onClick={() => setReplyId(0) }>Close</button>

                      </div>
                 }
                 </div>
               )
            }
          )
        }
      </div>
    </div>
  );
};

export default Campaign;
