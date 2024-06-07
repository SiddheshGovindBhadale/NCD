import abi from "./contract/doc.json";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Buy from "./components/Buy";
// import Memos from "./components/Memos";
import "./App.css";
import Navigation from './components/Navigation';
import Organization from './components/Organization';
import User from './components/User';
import Invoice from './components/OrgComponent/InvoiceForm';
import ClaimInsurenceForm from "./components/organization2/ClaimInsurenceForm";
import PrescriptionForm from "./components/OrgComponent/PrescriptionForm";
import LabReportForm from "./components/OrgComponent/LabReportForm";
import Home from "./components/organization2/Home";
// smart contract address = 0x0174Bc5c1504DCe7608BA711c32843e47Dc6AeCb


function App() {

  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("None");
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x0174Bc5c1504DCe7608BA711c32843e47Dc6AeCb";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setAccount(account);
          setState({ provider, signer, contract });
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);




  return (
    <div>
      <Router>
        <div>
          <Routes>
            <Route path='/' element={<Navigation />} />
            <Route path='/organization' element={<Organization state={state} />} />
            <Route path='/user' element={<User state={state} />} />
            <Route path='/invoice' element={<Invoice state={state} />} />
            <Route path='/PrescriptionForm' element={<PrescriptionForm state={state} />} />
            <Route path='/LabReportForm' element={<LabReportForm state={state} />} />
            <Route path='/Home' element={<Home state={state} />} />
            <Route path='/claimform' element={<ClaimInsurenceForm state={state} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
