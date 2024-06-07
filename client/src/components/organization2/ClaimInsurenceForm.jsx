import React, { useState, useEffect } from 'react';
import './InsuranceForm.css'; // Import CSS file for styling
import Otp from "../OrgComponent/OtpVarification";

const ClaimInsurenceForm = ({ state }) => {
    const [formData, setFormData] = useState({
        // Personal Information
        name: '',
        address: '',
        contactDetails: '',

        // Policy Details
        policyNumber: '',
        policyHolderName: '',
        effectiveDate: '',
        expirationDate: '',

        // Healthcare Provider Details
        providerName: '',
        providerAddress: '',
        providerContact: '',
        providerType: 'hospital',
        dateOfService: '',
        costOfServices: '',
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(formData.contactDetails);

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            contactDetails: isValidEmail ? undefined : 'Invalid email address',
        }));
    }, [formData.contactDetails]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Clear error message when user starts typing in a field
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined,
        }));
    };

    const handleFormSubmit = () => {
        // Perform additional validation before submitting
        const errors = {};
        for (const key in formData) {
            if (!formData[key]) {
                errors[key] = 'This field is required';
            }
        }

        if (Object.keys(errors).length === 0) {
            // Submit the form data (in this case, just log it)
            console.log('Form Data Submitted:', formData);
            // Show success message or redirect to another page
            alert('Form submitted successfully!');
        } else {
            // Display validation errors
            setFormErrors(errors);
            alert('Please fill in all required fields');
        }
    };

    const handleClearForm = () => {
        setFormData({
            name: '',
            address: '',
            contactDetails: '',
            policyNumber: '',
            policyHolderName: '',
            effectiveDate: '',
            expirationDate: '',
            providerName: '',
            providerAddress: '',
            providerContact: '',
            providerType: 'hospital',
            dateOfService: '',
            costOfServices: '',
        });
        setFormErrors({});
    };

    return (
        <div className="insurance-form-container">
            <h1 style={{
                fontSize: '2.2rem',
                textAlign: 'center',
                marginTop: '40px',
                marginBottom: '30px',
                fontWeight: '700'
            }}>Insurence Claim Form</h1>
            {/* Personal Information */}
            <div className="form-section">
                <h4>Personal Information</h4>
                <div>
                    <label>Name:</label>
                    <input
                        className='form-control'
                        placeholder='Name'
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        placeholder='Address'
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className='form-control'
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        placeholder='email'
                        name="contactDetails"
                        value={formData.contactDetails}
                        onChange={handleInputChange}
                        className='form-control'
                    />
                </div>
                <div>
                    <label>Age:</label>
                    <input
                        type="text"
                        placeholder='Age'
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className='form-control'
                    />
                </div>
                <div>
                    <label>Gender:</label>
                    <input
                        type="text"
                        name="gender"
                        placeholder='Gender'
                        value={formData.gender}
                        onChange={handleInputChange}
                        className='form-control'
                    />
                </div>
            </div>

            {/* Policy Details */}
            <div className="form-section">
                <h4>Policy Details</h4>
                <div>
                    <label>Policy Number:</label>
                    <input
                        type="text"
                        className='form-control'
                        placeholder='Policy Number'
                        name="policyNumber"
                        value={formData.policyNumber}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Policy Holder's Name:</label>
                    <input
                        type="text"
                        className='form-control'
                        placeholder='Policy holder name'
                        name="policyHolderName"
                        value={formData.policyHolderName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Policy Date:</label>
                    <input
                        type="date"
                        className='form-control'
                        placeholder='Policy date'
                        name="effectiveDate"
                        value={formData.effectiveDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Expiration Date:</label>
                    <input
                        type="date"
                        name="expirationDate"
                        className='form-control'
                        placeholder='Expiration date'
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Coverage Amount:</label>
                    <input
                        type="text"
                        className='form-control'
                        placeholder='coverage amount'
                        name="coverageAmount"
                        value={formData.coverageAmount}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Healthcare Provider Details */}
            <div className="form-section">
                <h4>Healthcare Provider Details</h4>
                <div>
                    <label>Provider's Name:</label>
                    <input
                        type="text"
                        name="providerName"
                        className='form-control'
                        placeholder='Provider name'
                        value={formData.providerName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Provider's Address:</label>
                    <input
                        type="text"
                        name="providerAddress"
                        className='form-control'
                        placeholder='Provider address'
                        value={formData.providerAddress}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Provider's Email:</label>
                    <input
                        type="text"
                        name="providerContact"
                        className='form-control'
                        placeholder='Provider email'
                        value={formData.providerContact}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Type of Provider:</label>
                    <select
                        name="providerType"
                        value={formData.providerType}
                        onChange={handleInputChange}
                        className='form-control'
                    >
                        <option value="hospital">Hospital</option>
                        <option value="clinic">Clinic</option>
                        <option value="individual_practitioner">Individual Practitioner</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label>Date of Service:</label>
                    <input
                        type="date"
                        name="dateOfService"
                        className='form-control'
                        placeholder='Date of Service'
                        value={formData.dateOfService}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Cost of Services:</label>
                    <input
                        type="text"
                        name="costOfServices"
                        className='form-control'
                        placeholder='Cost of servies'
                        value={formData.costOfServices}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Document Details */}
            <div className="form-section">
                <h4>Upload Following Documents</h4>

                <Otp state={state} />
                {/* <div>
                    <label>Provider's Name:</label>
                    <input
                        type="text"
                        name="providerName"
                        value={formData.providerName}
                        onChange={handleInputChange}
                    />
                </div> */}

            </div>

            {/* Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',

            }} className="form-buttons">
                <button style={{
                    width: '49%',
                    color: '#333',
                    backgroundColor: '#f0f0f0'
                }} onClick={handleClearForm}>Clear</button>
                <button style={{
                    width: '49%',
                    color: '#fff',
                    backgroundColor: '#4caf50'
                }} onClick={handleFormSubmit}>Claim Insurance</button>
            </div>
        </div>
    );
};

export default ClaimInsurenceForm;
