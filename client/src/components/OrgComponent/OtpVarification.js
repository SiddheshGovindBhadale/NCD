// AccessRequestForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Invoice from '../UserComponent/InvoiceDoc';
import RingLoader from "react-spinners/RingLoader";
import { ethers } from "ethers";

const AccessRequestForm = ({ state }) => {
    const [Doc_ID, setDoc_ID] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [docData, setDocData] = useState(null);
    const [otp, setOtp] = useState('');
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [upload, setUpload] = useState(true);
    const [loading, setLoading] = useState(false); // New loading state
    const [messaage, setMessage] = useState(''); // New loading state

    // call contract to get documwnt data from blockchain 
    const [memos, setMemos] = useState([]);
    // const { contract } = state;
    
    const initializeContract = () => {
        const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/7339593de9f84ea8af876f3833715c45');
        const signer = new ethers.Wallet('5b0ef70baf5ff12a9763fca42c9118783c5851515769c6037ac0edaffbe40a63', provider);
        const { abi } = require('../../contract/doc.json');
        return new ethers.Contract('0x0174Bc5c1504DCe7608BA711c32843e47Dc6AeCb', abi, signer);
    };
    
    const contractInstance = initializeContract();
    
    useEffect(() => {
        const memosMessage = async () => {
            const memos = await contractInstance.getDocs();
            setMemos(memos);
        };
        contractInstance && memosMessage();
    }, [contractInstance]);

    // current date and time 
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const updateDateTime = () => {
        const dateObj = new Date();

        // Get current date
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', optionsDate);
        setCurrentDate(formattedDate);

        // Get current time with AM/PM format
        const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        const formattedTime = dateObj.toLocaleTimeString('en-US', optionsTime);
        setCurrentTime(formattedTime);
    };

    useEffect(() => {
        // Initial update on component mount
        updateDateTime();
    }, []);



    const handleGenerateOTP = async () => {
        const findUserId = async () => {
            const DocData = memos.find(([NCD_ID]) => NCD_ID === Doc_ID);

            if (DocData) {
                setLoading(true);
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${DocData[2]}`);
                    const data = await response.json();

                    try {
                        // Send a request to the server to generate and send OTP
                        setMessage('OTP sending to your email...')
                        const response = await axios.post(`${process.env.REACT_APP_API_URL}/generate-otp`, {
                            userEmail: data.email,
                        });

                        if (response.data.success === true) {
                            alert(response.data.message)
                            setUserEmail(data.email);
                            setDocData(DocData)
                            setIsOTPSent(true);
                            setMessage('')
                            setLoading(false);
                        } else {
                            alert(`${response.data.error}, check internet connection`)
                            setLoading(false);
                        }


                    } catch (error) {
                        alert(`Check internet connection`)
                        console.error(error);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    setLoading(false);
                }
            } else {
                alert("User not found, check document ID");
                setLoading(false);
            }
        };
        findUserId()
    };

    const handleValidateOTP = async () => {
        try {
            setMessage('Validating Otp....')
            setLoading(true);
            // Send a request to the server to validate the entered OTP
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/validate-otp`, {
                userEmail,
                enteredOTP: otp,
            });

            if (response.data.success === true) {
                updateDateTime()
                alert(response.data.message)

                // store visited history
                const orgId = localStorage.getItem('orgId');
                // Doc_ID
                const history = [
                    orgId.toString(),
                    currentDate.toString(),
                    currentTime.toString()
                ];
                // const { contract } = state;

                setMessage('Connecting to server....')
                const transaction = await contractInstance.addHistoryArray(Doc_ID.toString(), history);
                setMessage('Storing history....')
                await transaction.wait();
                alert('Document upload successfull!')
                setSelectedData(docData)
                setMessage('')
                setLoading(false)
            } else {
                alert("Invalid OTP")
                setLoading(false);
            }
        } catch (error) {
            alert(`Check internet connection`)
            console.error(error);
            setLoading(false);
        }
    };

    // back button 
    const handleBackClick = () => {
        setSelectedData(null);
    };
    return (
        <div>
            {loading ? (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    height: '100vh'
                }}>
                    <RingLoader
                        color={"#000000"}
                        loading={loading}
                        cssOverride={{}}
                        size={40}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                    <p style={{
                        color: '#000000',
                        textAlign: 'center',
                        marginTop: '5px'
                    }}>{messaage}</p>
                </div>
            ) : (
                <div>
                    {selectedData ? (
                        upload ? (
                            <button className='button btn' style={{
                                // border:'1px solid red',
                                width: '100%',
                                backgroundColor: '#808080',
                                color: '#ffffff',
                                fontSize: '0.9rem',
                                fontWeight: '700'
                            }} onClick={() => {setUpload(!upload)}}>See Uploaded Document</button>
                        ) : (
                            <Invoice data={selectedData} onBack={() => { setUpload(!upload) }} />
                        )
                    ) : (
                        <>
                            {/* user documents */}
                            <div className=''>
                                <div className=''>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        marginTop: '30px'
                                    }}>Upload Invoice</h3>
                                    <div className='field'>
                                        {/* <label>Document Id</label> */}
                                        <input className='form-control' type="text" placeholder='Enter your document id' value={Doc_ID} onChange={(e) => setDoc_ID(e.target.value)} required />
                                    </div>
                                    {isOTPSent ? (
                                        <>
                                            <div className='field'>
                                                <label>Enter OTP</label>
                                                <input className='form-control' type="text" placeholder='Enter opt send in email' value={otp} onChange={(e) => setOtp(e.target.value)} pattern="\d{6}" required />
                                            </div>
                                            <button className='button btn' style={{
                                                // border:'1px solid red',
                                                width: '100%',
                                                backgroundColor: '#808080',
                                                color: '#ffffff',
                                                fontSize: '0.9rem',
                                                fontWeight: '700'
                                            }} type="button" onClick={handleValidateOTP}>
                                                Validate OTP
                                            </button>
                                        </>
                                    ) : (
                                        <button className='button btn' style={{
                                            // border:'1px solid red',
                                            width: '100%',
                                            backgroundColor: '#808080',
                                            color: '#ffffff',
                                            fontSize: '0.9rem',
                                            fontWeight: '700'
                                        }} type="button" onClick={handleGenerateOTP}>
                                            Generate OTP
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccessRequestForm;
