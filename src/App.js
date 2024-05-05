import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home  from './pages/Home';
import Display from './pages/Display';
import Listing from './pages/Listing';
import { NavBar, Footer } from './components/componentsindex';
import Web3 from 'web3';
import './App.css';

const App = () => {
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

  const handleConnect = (isConnected, acc) => {
    if (isConnected) {
      setAccount(acc);
    } else {
      setAccount('');
    }
  };
 
  return (
    <div style={{ marginBottom: '20px'}}>
      <NavBar onConnect={handleConnect} />
      <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/display" element={<Display/>} />
        <Route path="/listing" element={<Listing/>} />
      </Routes>
      </Router>
      <footer className="footercontainer">
      <div>
        <h3>Avinash Reddy Nuthalapati [OU ID: 113596827]; MSCS 2022-2024</h3>
      </div>
    </footer>
      </div>
  );
};

export default App;
