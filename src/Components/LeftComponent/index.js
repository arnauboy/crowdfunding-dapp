import React from 'react';
import "./leftComponent.scss"
import { useNavigate } from 'react-router-dom'

const LeftComponent = () => {
  const navigate = useNavigate()
  return (
    <div style={{position: "fixed", left:"0",marginLeft: "50px"}}>
      <button className="createButton" onClick={() => navigate('/startCampaign')}> START CAMPAIGN</button>
    </div>
  );
};

export default LeftComponent;
