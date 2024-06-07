import React, { useState } from 'react';
import { refreshPage } from '../js/utilityFunctions';
import RingLoader from "react-spinners/RingLoader";

const OrgRegister = ({ toggleForm }) => {
  const [organizationData, setOrganizationData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false); // New loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganizationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleRegistration = async () => {
    if (!validateEmail(organizationData.email) || !validatePassword(organizationData.password)) {
      alert('Invalid Input, Please enter valid email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/registerOrg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizationData),
      });

      const data = await response.json();

      // Check the response status and show an appropriate alert
      if (response.ok) {
        alert('Registration successful!');
        localStorage.setItem('orgId', data.organization._id);
        refreshPage();
      } else {
        alert(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration.');
    } finally {
      setLoading(false); // Set loading to false when registration completes (either success or failure)
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
            <h3>Create Your Account</h3>

            <div className='field'>
              <label>Name</label>
              <input className='form-control' type="text" placeholder='Enter your name' name="name" value={organizationData.name} onChange={handleInputChange} />
            </div>

            <div className='field'>
              <label>Email</label>
              <input className='form-control' type="email" placeholder='Enter your email' name="email" value={organizationData.email} onChange={handleInputChange} />
            </div>

            <div className='field'>
              <label>Password</label>
              <input className='form-control' type="password" placeholder='Create password' name="password" value={organizationData.password} onChange={handleInputChange} />
            </div>

            <div className='field'>
              <label>Retype Password</label>
              <input className='form-control' type="password" placeholder='Retype your password' name="confirmPassword" value={organizationData.confirmPassword} onChange={handleInputChange} />
            </div>

            {/* Display loader while registration is in progress */}
            {loading ? <p>Loading...</p> : null}

            <button className='button btn' type="button" onClick={handleRegistration} disabled={loading}>
              Register
            </button>

            <p>
              Already have an account? <button onClick={toggleForm}>Sign in</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgRegister;
