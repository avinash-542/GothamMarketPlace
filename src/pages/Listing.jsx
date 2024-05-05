import React, { useState, useEffect } from 'react'
import Style from './stylings/Listing.module.css'
import { ListingCard, Popup } from '../components/componentsindex'
import Web3 from 'web3'

export default function Listing () {

    const [data, setData] = useState({
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/6298/6298900.png',
        Title: '',
        Description: '',
        Seller: localStorage.getItem('account'),
        Price: '',
      });

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


      const handleDataChange = (e) => {
        if (e.target && e.target.name) {
          const { name, value } = e.target;
          setData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        }
      };

  return (
    <div className={Style.container}>
      <ListingCard data={{
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/6298/6298900.png',
        Title: '',
        Description: '',
        Seller: account,
        Price: '',
      }} onChange={handleDataChange}/>

    </div>
  )
}


