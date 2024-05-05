import React, { useState, useEffect } from 'react'
import Style from './stylings/Display.module.css'
import { DisplayItems } from '../components/componentsindex'
import Web3 from 'web3'

export default function Display () {

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
    <div className={Style.container}>
      <DisplayItems />
    </div>
  )
}


