import React from 'react';
import {usersAddress} from '../../utils/addresses'
import Users from '../../artifacts/contracts/Users.sol/Users.json'
import { ethers } from 'ethers'
import {useState, useEffect} from 'react'
import "./NotificationBox.scss"
import {useGlobalState} from '../../state'
import { useNavigate } from 'react-router-dom'
import fundsReachedIcon from '../../images/fundsReached.png'
import commentIcon from '../../images/comment.webp'
import replyIcon from '../../images/reply.webp'

const NotificationBox = () => {
  const [notifications,setNotifications] = useState([])
  const [notisClicked,setNotisClicked] = useState([])
  const account = useGlobalState('accountSignedIn')[0]
  const messages = ["New reply to your comment!", "Reached funding goal!", "New comment on your campaign!"]
  const navigate = useNavigate()

  useEffect(() => {
    loadNotifications()}, [account] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const loadNotifications = async () => {
    if (typeof window.ethereum != 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(usersAddress,Users.abi, provider)
        try {
          const data = await contract.fetchUserNotifications(account)
          let position = 0
          const items = await Promise.all(data.map(async i => {
            let item = {
              message: messages[i.notification_type],
              campaignId: i.campaignId,
              commentId: i.commentId,
              type: i.notification_type,
              position: position
            }
            ++position
            return item
          }))
          setNotifications(items)
          let clicked = []
          for (let i=0; i<items.length; ++i) {
            clicked.push(false)
          }
          setNotisClicked(clicked)
        }
        catch (err){
          console.log("Error: " , err)
        }
    }
  }

  const clickNotification = (noti) => {
    notisClicked[noti.position] = true;
    if (noti.type === 0) navigate(`/campaigns/${noti.campaignId}/threads/${noti.commentId}`)
    else navigate(`/campaigns/${noti.campaignId}`)
  }

  const countNotisNotClicked  = () => {
    let count = 0
    for (let i=0; i<notisClicked.length; ++i) {
      if (!notisClicked[i]) count++
    }
    return count
  }

  if (notifications.length === 0) {
    return (
      <div style = {{position: "fixed", right: 0, marginRight: "50px", width: "300px"}}>
        <div style = {{textAlign: "center"}}> Notifications </div>
        <div className = "notifications_container">
          Empty
        </div>
      </div>
    );
  }
  return (
    <div style = {{position: "fixed", right: 0, marginRight: "50px", width: "300px"}}>
      <div className = "notifications_container">
      <div style = {{textAlign: "center", fontSize: "20px", fontWeight: "bold", marginBottom: "20px"}}> Notifications ({countNotisNotClicked()}) </div>
      {notifications.map((noti, i) => {
        if (!notisClicked[noti.position]) {
          return (
            <button key={i} className = "alert_notification" onClick={() => {clickNotification(noti)}}>
              {//Conditional rendering of an icon
              }
              {noti.type === 0  &&
                <img src = {replyIcon} className = "notification_icon" alt="Comment Icon"/>
              }
              {noti.type === 1  &&
                <img src = {fundsReachedIcon} className = "notification_icon" alt="Funds Reached Icon"/>
              }
              {noti.type === 2  &&
                <img src = {commentIcon} className = "notification_icon" alt="Comment Icon"/>
              }
             {noti.message}
             </button>
          );
        }
        else return (<span> </span>);
        }
      )
    }
      </div>
    </div>
  )};

export default NotificationBox;
