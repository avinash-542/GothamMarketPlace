import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import { SiWalletconnect } from "react-icons/si";
import { SiMarketo } from "react-icons/si";
import { FaHome } from "react-icons/fa";
import { FaDotCircle } from "react-icons/fa";




//INTERNAL IMPORT

import Style from './NavBar.module.css';




const NavBar = ({ onConnect }) => {
  var userAccount;
  const handleRefresh = () => {
    window.location.href = '/';
  };

  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const loadAccount = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            localStorage.setItem('account', accounts[0]);
            setIsConnected(true);
            onConnect(true, accounts[0]); // Notify App.jsx that connection is successful
            localStorage.setItem('account', accounts[0]);
          }
        } catch (error) {
          console.error('Failed to load account', error);
          onConnect(false, ''); // Notify App.jsx that connection failed
        }
      }
    };

    loadAccount();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem('account', accounts[0]);
        onConnect(true, accounts[0]); // Notify App.jsx that connection is successful
      } else {
        setAccount('');
        setIsConnected(false);
        localStorage.removeItem('account');
        onConnect(false, ''); // Notify App.jsx that connection failed
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();

        setAccount(accounts[0]);
        setIsConnected(true);
        userAccount = accounts[0];
        localStorage.setItem('account', accounts[0]);
        onConnect(true, accounts[0]); // Notify App.jsx that connection is successful

      } catch (error) {
        console.error('Failed to connect to MetaMask', error);
        onConnect(false, ''); // Notify App.jsx that connection failed
      }
    } else {
      alert('Please install MetaMask to connect.');
      onConnect(false, ''); // Notify App.jsx that connection failed
    }
  };




  return (
  <nav className={Style.navbar}>
    <FaHome size={30}  onClick={handleRefresh}/>


  <div style={{ display: 'flex', justifyContent:'center', alignItems: 'center' }}>
    <SiMarketo size={40} style={{ marginRight: '20px' }} />
    <h1>Gotham Marketplace </h1>
  </div>

  
  {account ? (<div><button  className={Style.connected} style={{ margin: 10, display: 'flex', justifyContent:'center', alignItems: 'center', padding:'0 0 0 10px'}}><p><FaDotCircle size={15} style={{ color: '#24e600' }}/> {account.substring(0,4)}...{account.substring(38)}</p><SiWalletconnect size={20} style={{ marginRight: '10px', marginLeft:'10px' }} color='white'/></button></div>)
  :(<div><button onClick={connectToMetaMask} className={Style.connect} style={{ margin: 10, display: 'flex', justifyContent:'center', alignItems: 'center', padding:'0 0 0 10px'}}><p>Connect</p><SiWalletconnect size={20} style={{ marginRight: '10px', marginLeft:'10px' }}/></button></div>)}
</nav>

  );
}

export default NavBar
