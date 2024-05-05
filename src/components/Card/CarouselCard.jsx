import React, {useState, useEffect} from 'react';
import Style from './Card.module.css';
import image from '../../img';
import Web3 from 'web3';

const CarouselCard = ({ id, title, description, price, img }) => {

  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadAccount = async () => {
      if (window.ethereum) {
        try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Failed to load account', error);
        }
      }
    };
    loadAccount();
  }, []);

  return (
    <div key={id} className={Style.card}>
      <h3>{title}</h3>
      <img
          src={img}
          alt="Image of the item"
          className={Style.cardimg_carousel}
        />
      <p style={{ fontWeight:'bold' }}>Description</p>
      <p>{description}</p>
      <p style={{ fontWeight:'bold' }}> Price : <span style={{ fontWeight: 'normal'}}>{price} ether</span></p>
    </div>
  );
};

export default CarouselCard;