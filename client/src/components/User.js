import React, { useEffect, useState } from 'react';
import Register from './UserComponent/RegistrationForm';
import Login from './UserComponent/LoginForm';
import Invoice from './UserComponent/InvoiceDoc';
import History from './UserComponent/History';
import Logo from './img/logo.png';
import User from './img/user.png';
import Docs from './img/docs.png';
import './css/Navbar.css';
import './css/User.css';

const UserDash = ({ state }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [showRegistration, setShowRegistration] = useState(true);
  const [loading, setLoading] = useState(false); // New loading state

  const toggleForm = () => {
    setShowRegistration(!showRegistration);
  };

  const [memos, setMemos] = useState([]);
  const { contract } = state;

  useEffect(() => {
    const memosMessage = async () => {
      setLoading(true); // Set loading to true when fetching memos

      const memos = await contract.getDocs();
      setMemos(memos);

      setLoading(false); // Set loading to false when memos are fetched
    };

    contract && memosMessage();
  }, [contract]);

  useEffect(() => {
    const checkUserLogin = async () => {
      const userId = localStorage.getItem('userId');

      if (userId) {
        try {
          setLoading(true); // Set loading to true when fetching user details

          const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`);
          const data = await response.json();

          setUserDetails(data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false); // Set loading to false when user details are fetched
        }
      }
    };

    checkUserLogin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.reload();
  };

  const [invoiceData, setInvoiceData] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  const handleButtonClick = (data) => {
    setInvoiceData(data);
  };

  const handleBackClick = () => {
    setInvoiceData(null);
  };

  const handleButtonClick2 = (data) => {
    setHistoryData(data);
  };

  const handleBackClick2 = () => {
    setHistoryData(null);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : userDetails ? (
        <div>
          <div className="navbar">
            <div className="left">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="right">
              {/* <div className="nav_links">
                <button onClick={handleCreateDocClick}>Create Doc</button>
                <button onClick={handleValidateDocClick}>Validate Doc</button>
              </div> */}
              <div className="details">
                <img src={User} alt="Logo" />
                <p>{userDetails.name}</p>
                <i className='bx bx-log-out' onClick={handleLogout}></i>
              </div>
            </div>
          </div>

          <div>
            {invoiceData ? (
              <Invoice data={invoiceData} onBack={handleBackClick} />
            ) : historyData ? (
              <History data={historyData} onBack={handleBackClick2} />
            ) : (
              <>
                {/* user documents */}
                <div className='user_container'>
                  <h3>Documents</h3>
                  <div className='box_container'>
                    {memos.map((memo) => {
                      return (
                        <div className='box' key={memo.NCD_ID}>
                          <div className='left'>
                            <img src={Docs} alt="Document" />
                          </div>
                          <div className='right'>
                            <p><strong>Doc ID : </strong>{memo.NCD_ID}</p>
                            <p><strong>Doc Type : </strong>{memo.DocType_ID === "11" ? 'Invoice' : 'Not Found'}</p>
                            <button className='btn' onClick={() => handleButtonClick(memo)}>Print</button>
                            <button className='btn' style={{ marginLeft: 10 }} onClick={() => handleButtonClick2(memo)}>History</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="app-container">
            {showRegistration ? (
              <Register toggleForm={toggleForm} />
            ) : (
              <Login toggleForm={toggleForm} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDash;
