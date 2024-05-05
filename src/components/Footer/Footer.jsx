import React, { useState } from 'react';
import Style from './Footer.module.css';

const Footer = () => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
  };

  return (
    <footer>
      <div className={Style.footercontainer}> 
        <h4>Avinash Reddy Nuthalapati [OU ID: 113596827]; MSCS 2022-2024</h4>
      </div>
    </footer>
  );
};

export default Footer;
