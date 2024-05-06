import React, { useState, useEffect } from "react";
import contractABI from "../../contractsComponents/ABIjsons/marketPlaceABI.json";
import Web3 from "web3";
import Style from "./ListingCard.module.css";
import image from "../../img";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../firebase";
import { set } from "firebase/database";
import { FaLink } from "react-icons/fa";
import Progress from "../Progress/Progress";
import { FaUpload } from "react-icons/fa6";

const contractAddress = "0xE80Ccb3d70804555a22e60fEaEC8a3aF7568e6a6"; //Working

const ListingCard = ({ data, onChange }) => {
  const [showProgress, setShowProgress] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [tranData, setTranData] = useState({});
  const [formData, setFormData] = useState({});
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [buttonVisible, setButtonVisible] = useState(true);

  const [imageUrl, setImageUrl] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState(null);

  const [account, setAccount] = useState("");

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

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    console.log('selectedFile ::', selectedFile)
    if (!selectedFile) return;
    const storageRef = ref(imageDB, `images/${selectedFile.name}`);
          uploadBytes(storageRef, selectedFile).then((snapshot) => {
            console.log('SnapShot :: ', snapshot);
            
              const url =  getDownloadURL(ref(imageDB, `images/${selectedFile.name}`)).then((url) => {
                setUploadUrl(url);
                console.log('URL :: inside gdu :: ', url);
              });
              //console.log('URL :: ', url[0][0]);
              setUploadUrl(url);
          
          }); 

    setFile(selectedFile);
    //console.log('file', file)
    console.log('selectedFile', selectedFile)
    const objectUrl = URL.createObjectURL(selectedFile);
    setImageUrl(objectUrl);

  };

  const handleDefaultImageClick = () => {
    document.getElementById("fileInput").click();
  };

  useEffect(() => {
    setFormData(data); // Initialize form data when data prop changes
  }, [data]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request account access if needed
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    if (onChange) {
      onChange(newFormData);
    }
  };

  async function handleButtonClick({ title, desc, addr, price }) {
    setShowProgress(true);
    if(title === "" || desc === "" || price === "") {
      alert("Please fill all the fields");
      setShowProgress(false);
    }
    if(addr === "") {
      alert("Please connect your wallet and refresh page");

      setShowProgress(false);
    }
    if ((title && desc && addr && file) && price <= 0) {
      alert("Price should be greater than 0");
      setShowProgress(false);
      return;
    }
    if (!file) {
      alert("Please upload an image");
      console.log('file ::', file);
      setShowProgress(false);
    }
    if (web3 && contract) {
      try {
        // Example: Call a view function
        const priceInWei = web3.utils.toWei(price.toString(), "ether");
        console.log("File from upload : ",file)
        if (file) {
          // const storageRef = ref(imageDB, `images/${file.name}`);
          // uploadBytes(storageRef, file).then((snapshot) => {

          // });
          //const url = await getDownloadURL(ref(imageDB, `images/${file.name}`));
          console.log('upload url here : ', uploadUrl)
          if (uploadUrl) {
            setButtonVisible(false);
            const res = await contract.methods
              .listItem(title, desc, priceInWei, uploadUrl)
              .send({ from: addr });
              console.log('res ::', res)
              console.log('res url ::', res.events.ItemListed.returnValues.imageUri)
              console.log('upload url ::', uploadUrl)
            if (res) {
              data = {
                transactionHash: res.transactionHash.toString(),
                blockHash: res.blockHash.toString(),
                blockNumber: res.blockNumber.toString(),
                tranURL:
                  "https://sepolia.etherscan.io/tx/" + res.transactionHash,
                title: res.events.ItemListed.returnValues.title,
                from: res.events.ItemListed.returnValues.seller,
              };
              setTranData(data);
              setShowProgress(false);
              setIsOpen(true);

            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error listing item", error);
        window.location.reload();
        setButtonVisible(true);
      }
    }
  }

  return (
    <>
      <div className={Style.outercard}>
        <h1 className={Style.titlecard}>List your Item</h1>
        <div className={Style.card}>
          <div>
            <div className={Style.image}>
              <img
                src={imageUrl || image.batLogo}
                alt="Default"
                className={Style.imageStyle}
                style={{ width: "200px", height: "200px", cursor: "pointer"  }}
                
              />
              
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              /> 
            </div>
            {/* <p style={{ textAlign: "center" }}>Click above to upload image</p> */}
            <button onClick={handleDefaultImageClick} className={Style.upload}><FaUpload/> Upload </button>
          </div>
          <div className={Style.form}>
            <div className={Style.form1}>
              {Object.entries(formData).map(
                ([key, value]) =>
                  key !== "imageUrl" && (
                    <div key={key} style={{ marginBottom: "10px" }}>
                      <label style={{ fontWeight: "bold" }}>{key}:</label>
                      {key === "Seller" ? (
                        <span style={{ fontWeight: "bold" }}> {value}</span> // Display wallet address as text
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={value}
                          onChange={handleChange}
                          style={{ marginLeft: "10px" }}
                        />
                      )}
                    </div>
                  )
              )}
            </div>
            {buttonVisible ? (
              <button
                onClick={() =>
                  handleButtonClick({
                    imageUri: formData.imageUrl || "",
                    title: formData.Title || "",
                    desc: formData.Description || "",
                    addr: formData.Seller || "",
                    price: formData.Price || "0",
                  })
                }
                className={Style.list_button}
              >
                List Item
              </button>
            ) : (
              <button className={Style.progressing_button} disabled>
                Listing...
              </button>
            )}
          </div>
        </div>
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
                      Block No.
                    </th>
                    <td
                      style={{ padding: "8px", borderRight: "2px solid #ccc" }}
                    >
                      {tranData.blockNumber}
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
                      Title
                    </th>
                    <td
                      style={{ padding: "8px", borderRight: "2px solid #ccc" }}
                    >
                      {tranData.title}
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
                      Sender
                    </th>
                    <td
                      style={{ padding: "8px", borderRight: "2px solid #ccc" }}
                    >
                      {tranData.from}
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

export default ListingCard;
