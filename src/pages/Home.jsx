import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel  } from '../components/componentsindex';
import Style from './stylings/Home.module.css';
import Web3 from 'web3';

export default function Home() {
   const navigate = useNavigate();

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



  const handleDisplayClick = () => {
    navigate('/display');
  };

  const handleListingClick = () => {
    navigate('/listing');
  };

  return (
    <div className={Style.container}>
      <h1>A Market place to fund and help the Dark Knight!</h1>
      <Carousel />
      <h3>* this is just for display purpose, please click below button to navigate through listing, displaying and purchasing</h3>
      <div style={{ textAlign: 'center'}}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button onClick={handleDisplayClick} className={Style.seeitems}>Display Items</button>
          <button onClick={handleListingClick} className={Style.seeitems}>List Items</button>
        </div>
      </div>
    </div>
  );
}


