import React from 'react';
import me from '../images/me.png'

const About = () => {
  return (
    <div className = "main">
      <h1 style={{paddingTop: "20px",textAlign: 'center'}}>My Story</h1>
      <p style = {{paddingTop: "20px",maxWidth: '50%',margin: 'auto',textAlign: 'jusitfy'}}>
        Over a year ago, I became interested in blockchain technology and all the possible services it could offer. As a computer science student, I thought it would be a great
        idea to explore a little more and create a decentralized application on the Ethereum blockchain for my final thesis: IvoryFund.
      </p>
      <h2 style={{paddingTop: "20px"}}> Hope you enjoy! </h2>
      <div>
        <img style={{maxWidth: '20%', margin: 'auto', display: 'block', padding: '50px'}} src ={me} alt="Arnau Garcia Rodríguez" title="Me: Arnau Garcia"/>
        <figcaption> Arnau Garcia</figcaption>
      </div>
    </div>
  );
};

export default About;
