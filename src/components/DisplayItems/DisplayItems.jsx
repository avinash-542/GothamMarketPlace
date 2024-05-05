import React, { useState, useEffect } from "react";
import contractABI from "../../contractsComponents/ABIjsons/marketPlaceABI.json";
import Web3 from "web3";
import Style from "./DisplayItems.module.css";
import { Card } from "../componentsindex";

const contractAddress = "0xE80Ccb3d70804555a22e60fEaEC8a3aF7568e6a6"; //working

const DisplayItems = () => {
  const [account, setAccount] = useState(localStorage.getItem("account"));
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [myboughtItems, setMyBoughtItems] = useState([]);
  const [mylistedItems, setMyListedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const handleTabClick = async (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
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

  useEffect(() => {
    const fetchData = async () => {
      if (web3 && contract) {
        try {
          const itemsArray = await contract.methods.viewAllItems().call();

          for (let i = 0; i < itemsArray.length; i++) {
            if (
              itemsArray[i].isSold === true &&
              itemsArray[i].owner.toLowerCase() !== account
            ) {
              setSoldItems((prev) => [...prev, itemsArray[i]]);
            }
            if (itemsArray[i].seller.toLowerCase() === account) {
              setMyListedItems((prev) => [...prev, itemsArray[i]]);
            }
            if (
              itemsArray[i].owner.toLowerCase() === account &&
              itemsArray[i].seller.toLowerCase() !== account
            ) {
              setMyBoughtItems((prev) => [...prev, itemsArray[i]]);
            }
            if (
              itemsArray[i].isSold === false &&
              itemsArray[i].seller.toLowerCase() !== account &&
              itemsArray[i].owner.toLowerCase() !== account &&
              itemsArray[i].seller.toLowerCase() ===
                itemsArray[i].owner.toLowerCase()
            ) {
              setAvailableItems((prev) => [...prev, itemsArray[i]]);
            }
          }
          setItems(itemsArray);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      }
    };

    fetchData();
  }, [web3, contract]);

  return (
    <div>
      <div className={Style.outercard}>
        <h1 className={Style.titlecard}>Itemo-Pedia</h1>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th
                className={activeTab === "all" ? Style.active : ""}
                onClick={() => handleTabClick("all")}
              >
                All Items
              </th>
              <th
                className={activeTab === "available" ? Style.active : ""}
                onClick={() => handleTabClick("available")}
              >
                Available Items
              </th>
              <th
                className={activeTab === "sold" ? Style.active : ""}
                onClick={() => handleTabClick("sold")}
              >
                Sold Items
              </th>

              <th
                className={activeTab === "my" ? Style.active : ""}
                onClick={() => handleTabClick("my")}
              >
                My Items
              </th>
              <th
                className={activeTab === "listed" ? Style.active : ""}
                onClick={() => handleTabClick("listed")}
              >
                Listed Items
              </th>
            </tr>
          </thead>
        </table>
        <p style={{ fontWeight: "bold" }}>
          {activeTab === "all" && "All items"}
          {activeTab === "available" && "Items available for sale"}
          {activeTab === "sold" && "Sold items"}
          {activeTab === "my" && "Your puchases"}
          {activeTab === "listed" && "Your listings"}
        </p>
      </div>
      <div className={Style.container}>
        {activeTab === "all" &&
          items.map((card) => (
            <Card
              className={Style.card}
              key={card.id}
              id={card.id}
              item={card}
              type={activeTab}
            />
          ))}
        {activeTab === "available" &&
          availableItems.map((card) => (
            <Card
              className={Style.card}
              key={card.id}
              id={card.id}
              item={card}
              type={activeTab}
            />
          ))}

        {activeTab === "sold" &&
          soldItems.map((card) => (
            <Card
              className={Style.card}
              key={card.id}
              id={card.id}
              item={card}
              type={activeTab}
            />
          ))}

        {activeTab === "my" &&
          myboughtItems.map((card) => (
            <Card
              className={Style.card}
              key={card.id}
              id={card.id}
              item={card}
              type={activeTab}
            />
          ))}

        {activeTab === "listed" &&
          mylistedItems.map((card) => (
            <Card
              className={Style.card}
              key={card.id}
              id={card.id}
              item={card}
              type={activeTab}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayItems;
