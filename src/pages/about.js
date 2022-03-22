import React from 'react';
import me from '../images/me.jpg'

const About = () => {
  return (
    <div>
      <h1 style={{textAlign: 'center'}}>My Story</h1>
        <p style = {{  maxWidth: '50%',margin: 'auto',textAlign: 'jusitfy'}}>
          Over a year ago, I became interested in blockchain technology and all the possible services it could offer. As a computer science student, I thought it would be agreat
          idea to explore a little more and create a decentralized application on the Ethereum blockchain for my final thesis: Elefund.

          Hope you enjoy!
        </p>
        <img src ={me} alt="Arnau Garcia Rodríguez"/>
    </div>
  );
};

export default About;
