import React from 'react';
import {
  useNavigate
} from "react-router-dom";
import { ethers } from 'ethers'
import {useEffect, useState} from 'react'
import {ivoryICOAddress, icoComments,usersAddress} from "../utils/addresses"
import ICO from '../artifacts/contracts/ivoryICO.sol/ICO.json'
import ICOComments from '../artifacts/contracts/ICOComments.sol/ICOComments.json'
import Users from '../artifacts/contracts/Users.sol/Users.json'
import ivoryCoinLogo from '../images/ivoyCoin.png'
import {useGlobalState} from '../state'
import {successBuyToast,failedBuyToast,successWithdrawToast,successComment
  ,failedComment,} from '../utils/toasts'

const IvoryICO = () => {
  const [ico, setICO] = useState([])
  const [fundsPercentage, setFundsPercentage] = useState(0)
  const [donation, setDonation] = useState("0")
  const [withdraw, setWithdraw] = useState("0")
  const [comments, setComments] = useState([])
  const [commentBox, setCommentBox] = useState("")
  const [replyBox, setReplyBox] = useState("")
  const [replyId, setReplyId] = useState(0) //ReplyId is the id of the comment user is replying.It is initially set to 0 because Ids start at 1
  const account = useGlobalState("accountSignedIn")[0];
  const username = useGlobalState("username")[0];
  const navigate = useNavigate()

  useEffect(() => {
    loadICO(); loadComments(ivoryICOAddress) } , [account]// eslint-disable-line react-hooks/exhaustive-deps
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

  async function loadComments(ico){
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(icoComments,ICOComments.abi, provider)
      try {
        const data = await contract.getComments(ico);
        const items = await Promise.all(data.map(async i => {
          const user = await getUser(i.commentator)
          const num_replies = await contract.getNumberOfReplies(i.commentId.toNumber())
          let item = {
            commentId: i.commentId.toNumber(),
            commentator : i.commentator,
            message: i.message,
            parentCommentId: i.parentCommentId.toNumber(),
            username: user.username,
            color: user.color,
            num_replies: num_replies.toNumber()
          }
          return item
        }))
        setComments(items);
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  async function addComment(ico){
    if (typeof window.ethereum !== 'undefined'){
      if(username !== '' && commentBox !== "") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(icoComments,ICOComments.abi, signer)
        try {
        const transaction = await contract.comment(account,commentBox,ico)
        await transaction.wait()
        successComment()
        await loadComments(ico)
        }
        catch (err){
          console.log("Error: " , err)
          failedComment()
        }
      }
      else failedComment()
    }
  }

  async function addReply(commentId, ico){
    if (typeof window.ethereum !== 'undefined'){

      if(username !== '') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(icoComments,ICOComments.abi, signer)
        try {
        const transaction = await contract.reply(account,replyBox,commentId,ico)
        await transaction.wait()
        successComment()
        setReplyId(0)
        setReplyBox("")
        await loadComments(ico)
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
          usersAddress : data.usersAddress,
          color: data.color
        }
        return item;
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  return(
    <div className="flex justify-center" style={{maxWidth: "50%", margin: 'auto', marginTop: "150px"}}>
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
      <div style = {{paddingTop: "30px"}}>
        <input
          className="form-control"
          value={commentBox}
          onChange={e => setCommentBox(e.target.value)}
          placeholder="Add a comment..."
          />
        <button style = {{marginTop: "10px"}}type="button" className="btn btn-outline-secondary" onClick={() => addComment(ivoryICOAddress) }>Comment</button>
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
                    {comment.username !== ''
                    ?
                    <div className="tooltip" style={{ color: comment.color}}> {comment.username}
                      <span className="tooltiptext"> {comment.commentator} </span>
                    </div>
                    : comment.commentator
                    }
                    </small> <small className="font-weight-bold">{comment.message}</small></span>
                  </div>
                  </div>
                  <div className="action d-flex justify-content-between mt-2 align-items-center">
                    <div className="reply">
                      <small> <button style = {{textDecoration: "underline"}} onClick={() => setReplyId(comment.commentId)}>Reply </button></small>
                      <small> <button style = {{textDecoration: "underline"}} onClick={() => {  navigate(`/icos/ivoryICO/threads/${comment.commentId}`)}}> Thread ({comment.num_replies} )</button></small>
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
                          <button style = {{marginTop: "10px"}}type="button" className="btn btn-outline-secondary" onClick={() => addReply(comment.commentId, ivoryICOAddress) }>Reply</button>
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

export default IvoryICO;
