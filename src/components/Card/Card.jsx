import React, { useState, useEffect } from "react";
import Style from "./Card.module.css";
import contractABI from "../../contractsComponents/ABIjsons/marketPlaceABI.json";
import Web3 from "web3";
import image from "../../img";
import { set } from "firebase/database";
import Progress from "../Progress/Progress";

import { FaLink } from "react-icons/fa";

const contractAddress = "0xE80Ccb3d70804555a22e60fEaEC8a3aF7568e6a6"; //Working

const Card = ({ id, item, type }) => {
  const [showProgress, setShowProgress] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const [tranData, setTranData] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  var resdata;
  const [account, setAccount] = useState(localStorage.getItem("account"));

  useEffect(() => {
    const loadAccount = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Failed to load account", error);
        }
      }
    };
    loadAccount();
  }, []);

  const web = new Web3(window.ethereum);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setContract(contractInstance);
      }
    };

    initWeb3();
  }, []);

  async function handlePurchase() {
    setShowProgress(true);

    if (web3 && contract) {
      try {

        const result = await contract.methods
          .purchaseItem(id)
          .send({ from: account, value: item.price });
          if(result) {
          const data = {
            transactionHash : result.transactionHash.toString(),
            blockHash : result.blockHash.toString(),
            blockNumber : result.blockNumber.toString(),
            tranURL: "https://sepolia.etherscan.io/tx/"+result.transactionHash,
          }
        resdata = result;
        setTranData(data);
        setShowProgress(false);
        setIsOpen(true);
      }
      } catch (error) {
        console.error("Error:", error);
        setShowProgress(false);
        alert("Transaction Failed");
        window.location.reload();
        
      }
    }
  }

  return (
    <>
    <div key={id} className={Style.card}>
      <h3>{item.title}</h3>
      {item.imgUrl ? (
        <img src={item.imgUrl} alt="Uploaded" className={Style.cardimg} />
      ) : (
        <img
          src={image.collection}
          alt="Placeholder"
          className={Style.cardimg}
        />
      )}

      {/* <img src={image.collection} alt="item" className={Style.cardimg} onClick={handleImageUpload}/> */}
      <p style={{ fontWeight: "bold" }}>Description</p>
      <p>{item.description}</p>
      <p style={{ fontWeight: "bold" }}>
        {" "}
        Price :{" "}
        <span style={{ fontWeight: "normal" }}>
          {" "}
          {web.utils.fromWei(item.price.toString(), "ether")} ether
        </span>
      </p>


{type === "all" && (
  (item.isSold === true && item.owner.toLowerCase() !== account) ? <><button
  className={Style.bought} >
    Sold
  </button>
  </> :
  (item.seller.toLowerCase() === account.toLowerCase()) ? <button className={Style.listing}>Your Listing</button> :
  (item.isSold === false && item.seller.toLowerCase() !== account.toLowerCase()) ? <button className={Style.buy} onClick={handlePurchase}>Buy</button> :
  (item.owner.toLowerCase() === account.toLowerCase() && item.seller.toLowerCase() !== account.toLowerCase()) ? <button className={Style.bought}>Bought</button> :
  null
)}


      {type === "available" && (
        <button
        className={Style.buy} onClick={handlePurchase}>
          Buy
        </button>
      )}

      {type === "my" && (
        <button
          className={Style.bought} disabled>
          Purchased
        </button>
      )}

      {type === "listed" && (
        <><button
          className={item.isSold ? Style.bought : Style.available} disabled>
          {item.isSold ? "Sold" : "Available"}
        </button>
        {item.isSold ? <h3 Style={{fontWeight:'bold'}}>to {item.owner.substring(0,6)}....{item.owner.substring(38)}</h3> : null}</>
      )}

{type === "sold" && (
        <><button
        className={Style.bought} onClick={handlePurchase}>
          Sold
        </button>
        </>
      )}

 
    </div>


    {isOpen && (
        <div className={Style.popupoverlay}>
          <div className={Style.popup}>
            <div className={Style.popupcontent}>
              <h2>TRANSACTION COMPLETE</h2>
              <h3>Transaction details</h3>

              <div className={Style.popupcontent}>
                <table
                  style={{
                    borderCollapse: "collapse",
                    borderRadius: "10px",
                    border: "2px solid #ccc",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "8px",
                        borderRight: "2px solid #ccc",
                      }}
                    >
                      Block Hash
                    </th>
                    <td
                      style={{ padding: "8px", borderRight: "2px solid #ccc" }}
                    >
                      {tranData.blockHash}
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "8px",
                        borderRight: "2px solid #ccc",
                      }}
                    >
                      Transaction Hash
                    </th>
                    <td
                      style={{ padding: "8px", borderRight: "2px solid #ccc" }}
                    >
                      {tranData.transactionHash}
                    </td>
                  </tr>
                  
                  <tr>
                    <th
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "8px",
                        borderRight: "2px solid #ccc",
                      }}
                    >
                      Sepolia link
                    </th>
                    <td
                      style={{ padding: "8px", borderRight: "2px solid #ccc" }}
                    >
                      <a
                        href={tranData.tranURL}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        <i>
                          View Block <FaLink size={20} color="#0237f6" />
                        </i>
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <button
                onClick={() => window.location.reload()}
                className={Style.button}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

{showProgress && <Progress />}

</>

  );
};

export default Card;
