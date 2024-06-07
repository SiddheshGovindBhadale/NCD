import React, { useState } from 'react';
import { refreshPage } from '../js/utilityFunctions';
import RingLoader from "react-spinners/RingLoader";

const OrgLogin = ({ toggleForm }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false); // New loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleLogin = async () => {
    if (!validateEmail(loginData.email) || !validatePassword(loginData.password)) {
      alert('Invalid Input, Please enter valid email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/loginOrg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      // Check the response status and handle accordingly
      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('orgId', data.organization.id);
        refreshPage();
        // Additional actions after successful login (e.g., redirect)
      } else {
        alert(`Login failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    } finally {
      setLoading(false); // Set loading to false when login completes (either success or failure)
    }
  };

  return (
    <div>
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
        </div>
      ) : (
        <div className='form_container'>
          <div className='form'>
            <h3>Login</h3>
            <div className='field'>
              <label>Email</label>
              <input className='form-control' type="email" placeholder='Enter your email' name="email" value={loginData.email} onChange={handleInputChange} />
            </div>

            <div className='field'>
              <label>Password</label>
              <input className='form-control' type="password" placeholder='Enter your password' name="password" value={loginData.password} onChange={handleInputChange} />
            </div>

            {/* Display loader while login is in progress */}
            {/* {loading ? <p>Loading...</p> : null} */}

            <button className='button btn' type="button" onClick={handleLogin} disabled={loading}>
              Login
            </button>

            <p>
              Don't have an account? <button onClick={toggleForm}>Register</button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
};

export default OrgLogin;
