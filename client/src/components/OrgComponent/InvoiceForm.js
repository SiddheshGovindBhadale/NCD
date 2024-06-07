import React, { useEffect, useState } from 'react';
import './InvoiceForm.css'; // Import a CSS file for styling
import RingLoader from "react-spinners/RingLoader";
import { Link, useNavigate } from 'react-router-dom';
// import { useHistory } from 'history';

const InvoiceForm = ({ state }) => {
    const navigate = useNavigate();

    const InvoiceCode = 11;
    // call contract to get documwnt data from blockchain 
    const [memos, setMemos] = useState([]);
    const { contract } = state;
    const [loading, setLoading] = useState(false); // New loading state
    const [messaage, setMessage] = useState(''); // New loading state

    useEffect(() => {
        const memosMessage = async () => {
            const memos = await contract.getDocs();
            setMemos(memos);
        };
        contract && memosMessage();
    }, [contract]);


    const [orgDetails, setOrgDetails] = useState(null);

    useEffect(() => {
        const checkOrgLogin = async () => {
            const orgId = localStorage.getItem('orgId');

            if (orgId) {
                try {
                    setLoading(true); // Set loading to true when fetching user details

                    const response = await fetch(`${process.env.REACT_APP_API_URL}/orgs/${orgId}`);
                    const data = await response.json();

                    setOrgDetails(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    setLoading(false);
                } finally {
                    // Set loading to false when user details are fetched
                }
            }
        };

        checkOrgLogin();
    }, []);

    // console.log(orgDetails)

    // generating unique document number 
    const [uniqueNumber, setUniqueNumber] = useState('xxxxxxxxxxxxxxx');

    const generateUniqueNumber = () => {
        const min = 1000000; // 7-digit number starts from 1000000
        const max = 9999999; // 7-digit number ends at 9999999

        let randomNum;
        do {
            // Generate a random number
            randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (!isNumberUnique(randomNum));

        // Set the unique number in the state
        setUniqueNumber(`${orgDetails.code}${InvoiceCode}${randomNum}`);
    };

    const isNumberUnique = (number) => {
        const numberToCheck = `${orgDetails.code}${InvoiceCode}${number}`;
        return !memos.some((obj) => obj.NCD_ID === numberToCheck);
    };



    // invoice data fetching 
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    // const [documentNumber, setDocumentNumber] = useState('');
    const [providerName, setProviderName] = useState('');
    const [providerEmail, setProviderEmail] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [receiverEmail, setReceiverEmail] = useState('');
    const [items, setItems] = useState([{ itemName: '', quantity: 0, price: 0 }]);

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleAddItem = () => {
        setItems([...items, { itemName: '', quantity: 0, price: 0 }]);
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const calculateTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const calculateTotalPrice = () => {
        return items.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleCreateInvoice = async () => {
        if (!validateEmail(providerEmail) || !validateEmail(receiverEmail) || uniqueNumber === "xxxxxxxxxxxxxxx") {
            alert('Invalid Input, Please enter valid Details.');
            return;
        }

        setLoading(true);
        try {
            // check user is exist or not 
            const response = await fetch(`${process.env.REACT_APP_API_URL}/useremail/${receiverEmail}`);
            const data = await response.json();
            setMessage('Checking Details...')
            if (data.userData) {
                // Convert array of objects to a single string
                const concatenatedString = items.map(obj => `${obj.itemName},${obj.quantity},${obj.price}`).join(';');


                const InvoiceData = [
                    date,
                    providerName,
                    providerEmail,
                    receiverName,
                    receiverEmail,
                    calculateTotalPrice().toString(),
                    concatenatedString
                ];

                const Memo = {
                    NCD_ID: uniqueNumber,
                    DocType_ID: InvoiceCode,
                    user_ID: data.userData._id,
                    data: InvoiceData,
                    history: []
                }

                setMessage('Loading Metamask...')

                // store document in blockchain 
                const { contract } = state;

                const transaction = await contract.addDocs(uniqueNumber, InvoiceCode.toString(), data.userData._id, InvoiceData, [[]]);
                setMessage('Transaction proccessing...')
                await transaction.wait();
                setMessage('')
                alert("Document is store successfully");
                setLoading(false);
                navigate('/organization');
                window.location.reload(false);
            } else {
                alert('User not found, Check User Details');
                setLoading(false);
            }

        } catch (error) {
            console.error('Error fetching user details:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('orgId');
        window.location.reload();
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
                        size={80}
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
                    <div className="head-title">
                        <div className="left">
                            <h1>Dashboard</h1>
                            <ul className="breadcrumb">
                                <li>
                                    <a href="#">Dashboard</a>
                                </li>
                                <li><i className='bx bx-chevron-right' ></i></li>
                                <li>
                                    <a className="active" href="#">Invoice</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='invoice_container'>
                        <div className="invoice-form-container">
                            {/* <h4 style={{marginBottom:'60px', textAlign:'center', fontWeight:'600'}}>Invoice Form</h4> */}
                            <div className="head">
                                <div>
                                    <label>Date:</label>
                                    <input className='form-control' type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ width: '120px' }}>Document No:</label>
                                    <input className='form-control' type="text" placeholder='XXXXXXXXXXXXXXX' value={uniqueNumber} />
                                    <button className='generateCodeBtn btn btn-secondary' onClick={generateUniqueNumber}>Generate</button>
                                </div>
                            </div>

                            <div className='details'>
                                <div className='from'>
                                    <h3>From:</h3>
                                    <div>
                                        <input className='form-control' type="text" placeholder='Provider Name' value={providerName} onChange={(e) => setProviderName(e.target.value)} />
                                    </div>
                                    <div>
                                        <input className='form-control' placeholder='Provider Email' type="text" value={providerEmail} onChange={(e) => setProviderEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className='to'>
                                    <h3>To:</h3>
                                    <div>
                                        <input className='form-control' type="text" placeholder='Receiver Name' value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
                                    </div>
                                    <div>
                                        <input className='form-control' type="email" placeholder='Receiver Email' value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="items-section">
                                <h3>Items:</h3>
                                <table className="table ">
                                    <thead>
                                        <tr>
                                            <th scope="col">Item Name</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        className='form-control'
                                                        type="text"
                                                        placeholder='Item Name'
                                                        value={item.itemName}
                                                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='form-control'
                                                        type="number"
                                                        placeholder='Quantity'
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='form-control'
                                                        type="number"
                                                        placeholder='Price'
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                                    />
                                                </td>
                                                <td>
                                                    <button style={{ padding: '5px 5px' }} className='btn btn-danger' type="button" onClick={() => handleDeleteItem(index)}>
                                                        <i style={{ fontSize: '20px', marginBottom: '0px' }} className='bx bx-x'></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button className='btn btn-secondary' type="button" onClick={handleAddItem}>
                                    <i className='bx bx-plus-medical'></i>
                                </button>
                            </div>
                            <div className='bottom'>
                                <div className="totals-section">
                                    <p>Total Items: {calculateTotalItems()}</p>
                                    <p>Total Price: ₹{calculateTotalPrice()}</p>
                                </div>
                                <div className='buttons'>
                                    <Link to="/organization" className="cancel">
                                        <button className='btn btn-danger'>Cancel</button>
                                    </Link>
                                    <button className='create btn btn-success' type="button" onClick={handleCreateInvoice}>
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                </div>
            )}
        </div>
    );
};

export default InvoiceForm;