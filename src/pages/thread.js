import React from 'react';
import {
  useParams, useNavigate
} from "react-router-dom";
import {useEffect, useState} from 'react'
import { ethers } from 'ethers'
import FundMarket from '../artifacts/contracts/fundMarket.sol/FundMarket.json'
import Users from '../artifacts/contracts/Users.sol/Users.json'
import {fundMarketAddress} from "../utils/addresses.js"
import {usersAddress} from "../utils/addresses"
import {useGlobalState} from '../state'
import {toast } from 'react-toastify';

const failedComment = () => {
    toast.error("Failed to comment. User must have a username",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

const successComment = () => {
    toast.success("Succesfully commented!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };
const Thread = () => {
  let { commentId } = useParams();
  let { id } = useParams();
  console.log(commentId)
  const [replies, setReplies] = useState([])
  const [comment, setComment] = useState([])
  const account = useGlobalState("accountSignedIn")[0];
  const username = useGlobalState("username")[0];

  const navigate = useNavigate()
  const [replyBox, setReplyBox] = useState("")
  const [replyId, setReplyId] = useState(0) //ReplyId is the id of the comment user is replying.It is initially set to 0 because Ids start at 1
  console.log(commentId, replyId)

  useEffect(() => {
    loadComment(commentId);loadReplies(commentId)
  }, [account] // eslint-disable-line react-hooks/exhaustive-deps
  )

  async function loadComment(commentId) {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum); //we could use provier JsonRpcProvider()
      const contract = new ethers.Contract(fundMarketAddress,FundMarket.abi, provider)
      try {
        const data = await contract.getComment(commentId);
        const user = await getUser(data.commentator)
        let item = {
          commentId: data.commentId.toNumber(),
          commentator : data.commentator,
          message: data.message,
          parentCommentId: data.parentCommentId.toNumber(),
          username: user.username,
          color: user.color
        }
        setComment(item);
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  async function addReply(commentId){
    if (typeof window.ethereum !== 'undefined'){
      if(username !== '') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(fundMarketAddress,FundMarket.abi, signer)
        try {
        const transaction = await contract.reply(account,replyBox,commentId,id)
        await transaction.wait()
        successComment()
        setReplyId(0)
        setReplyBox("")
        await loadReplies(commentId)
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
        return item;
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }


  async function loadReplies(commentId){
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(fundMarketAddress,FundMarket.abi, provider)
      try {
        const data = await contract.getReplies(commentId);
        const items = await Promise.all(data.map(async i => {
          const user = await getUser(i.commentator)
          let item = {
            commentId: i.commentId.toNumber(),
            commentator : i.commentator,
            message: i.message,
            parentCommentId: i.parentCommentId.toNumber(),
            username: user.username,
            color: user.color
          }
          return item
        }))
        setReplies(items);
        console.log("Replies:",replies)
      }
      catch (err){
        console.log("Error: " , err)
      }
    }
  }

  return (
    <div className="flex justify-center" style={{maxWidth: "50%", margin: 'auto', marginTop: "100px"}}>
      <div style = {{paddingTop: "30px"}} >
        <p style = {{fontSize: "20px"}}> Answers </p>
        <hr/>
        <div className="card p-3" style = {{marginTop: "30px"}}>
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
                <small> <button style = {{textDecoration: "underline"}} onClick={() => setReplyId(commentId)}>Reply </button></small>
               </div>
            </div>
            {replyId === commentId &&
               <div style = {{paddingTop: "30px"}}>
                  <input
                    className="form-control"
                    value={replyBox}
                    onChange={e => setReplyBox(e.target.value)}
                    placeholder="Add a reply..."
                    />
                    <button style = {{marginTop: "10px"}}type="button" className="btn btn-outline-secondary" onClick={() => addReply(commentId) }>Reply</button>
                    <button style = {{marginTop: "10px"}}type="button" className="btn btn-outline-danger" onClick={() => setReplyId(0) }>Close</button>
                </div>
           }
           </div>
        {
          replies.map((reply, i) => {
            //getUser(comment.commentator)

            return (
              <div key = {i} className="card p-3" style = {{marginTop: "30px",marginLeft: "50px"}}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="user d-flex flex-row align-items-center">
                    <span><small className="font-weight-bold text-primary">
                    {reply.username !== ''
                    ?
                    <div className="tooltip" style={{ color: reply.color}}> {reply.username}
                      <span className="tooltiptext"> {reply.commentator} </span>
                    </div>
                    : reply.commentator
                    }
                    </small> <small className="font-weight-bold">{reply.message}</small></span>
                  </div>
                  </div>
                  <div className="action d-flex justify-content-between mt-2 align-items-center">
                    <div className="reply">
                      <small> <button style = {{textDecoration: "underline"}} onClick={() => setReplyId(reply.commentId)}>Reply </button></small>
                      <small> <button style = {{textDecoration: "underline"}} onClick={() => { navigate(`${reply.commentId}`) }}> Thread </button></small>
                     </div>

                  </div>
                  {replyId === reply.commentId &&
                     <div style = {{paddingTop: "30px"}}>
                        <input
                          className="form-control"
                          value={replyBox}
                          onChange={e => setReplyBox(e.target.value)}
                          placeholder="Add a reply..."
                          />
                          <button style = {{marginTop: "10px"}}type="button" className="btn btn-outline-secondary" onClick={() => addReply(reply.commentId) }>Reply</button>
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
}

export default Thread;
