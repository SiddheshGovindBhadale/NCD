import React, { useState } from 'react';
import { refreshPage } from '../js/utilityFunctions';

const LoginForm = ({ toggleForm }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false); // New loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      setLoading(true); // Set loading to true when login starts

      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      // Check the response status and show an appropriate alert
      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('userId', data.userID);
        refreshPage();
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
        {loading ? <p>Loading...</p> : null}

        <button className='button btn' type="button" onClick={handleLogin} disabled={loading}>
          Login
        </button>

        <p>Don't have an account? <button onClick={toggleForm}>Register</button></p>
      </div>
    </div>
  );
};

export default LoginForm;
