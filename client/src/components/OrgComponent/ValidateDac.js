import React, { useState } from 'react';
import Otp from './OtpVarification';


const ValidateDoc = ({state}) => {
  const [numberInput, setNumberInput] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValidNumber = /^\d{15}$/.test(numberInput);

    if (isValidNumber) {

    } else {
      alert('Please enter a valid 15-digit number.');
    }
  };

  return (
    <div>
      <Otp state={state}/>
    </div>
  );
};

export default ValidateDoc;
