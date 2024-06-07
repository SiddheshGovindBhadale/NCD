import React, { useState } from 'react';
import '../css/LoginForm.css';
import { refreshPage } from '../js/utilityFunctions';

const RegistrationForm = ({ toggleForm }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    conPassword: '',
  });

  const [loading, setLoading] = useState(false); // New loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegistration = async () => {
    try {
      setLoading(true); // Set loading to true when registration starts

      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Check the response status and show an appropriate alert
      if (response.ok) {
        alert('Registration successful!');
        console.log(data.user);
        localStorage.setItem('userId', data.user._id);
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
    <div className='form_container'>
      <div className='form'>
        <h3>Create Your Account</h3>
        <div className='field'>
          <label>Name</label>
          <input className='form-control' type="text" placeholder='Enter your name' name="name" value={userData.name} onChange={handleInputChange} />
        </div>

        <div className='field'>
          <label>Email</label>
          <input className='form-control' type="email" placeholder='Enter your email' name="email" value={userData.email} onChange={handleInputChange} />
        </div>

        <div className='field'>
          <label>Password</label>
          <input className='form-control' type="password" placeholder='Create password' name="password" value={userData.password} onChange={handleInputChange} />
        </div>

        <div className='field'>
          <label>Retype Password</label>
          <input className='form-control' type="password" placeholder='Retype your password' name="conPassword" value={userData.conPassword} onChange={handleInputChange} />
        </div>

        {/* Display loader while registration is in progress */}
        {loading ? <p>Loading...</p> : null}

        <button className='button btn' type="button" onClick={handleRegistration} disabled={loading}>
          Sign Up
        </button>

        <p>Already have an account? <button onClick={toggleForm}>Sign in</button></p>
      </div>
    </div>
  );
};

export default RegistrationForm;
