import React from 'react';
import { useNavigate } from 'react-router-dom'
import {usersAddress} from '../../utils/addresses'
import Users from '../../artifacts/contracts/Users.sol/Users.json'
import { ethers } from 'ethers'
import {useState} from 'react'
import "./NotificationBox.scss"


const NotificationBox = () => {
  const [notifications,setNotifications] = useState([])
  const account = useGlobalState('accountSignedIn')
  const messages = ["New reply to your comment", "Your campaign has reached the funding goal!", "One of your favourite campaigns has reached the funding goal"]

  useEffect(() => {
    loadNotifications()}, account
  })

  const loadNotifications = () => {
    if (typeof window.ethereum != 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(usersAddress,Users.abi, provider)
        try {
          const data = await contract.fetchUserNotifications(account)
          const items = new Promise.all(data.map(async i => {
            let item = {
              message: messages[i.notification_type],
              campaignId: i.campaignId,
              commentId: i.commentId
            }
            return item
          }))
          setNotifications(items)
        }
        catch (err){
          console.log("Error: " , err)
        }
    }
  }
  return (
    <div style = {{position: "absolute", right: 0, marginRight: "50px", width: "300px"}}>
      <div style = {{textAlign: "center"}}> Notifications </div>
      <div className = "notifications_container">
      {notifications.map((noti, i) => {
        return (
        <div key={i} className = "alert alert__primary"> {noti.message} </div>
        );
      })}
      </div>
    </div>
  )};

export default NotificationBox;
