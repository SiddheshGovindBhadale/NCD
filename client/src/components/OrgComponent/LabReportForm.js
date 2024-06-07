import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RingLoader from "react-spinners/RingLoader";
import '../css/LabReportForm.css'
const LabReportForm = ({ state }) => {
    const navigate = useNavigate();

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


    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [documentNumber, setDocumentNumber] = useState('');
    const [labReportData, setLabReportData] = useState({
        patientInformation: {
            fullName: '',
            age: '',
            gender: '',
            dateOfBirth: '',
            address: '',
            email: '',
        },
        testDetails: [
            {
                testName: '',
                dateOfTest: '',
                orderingPhysician: '',
            },
        ],
        specimenInformation: {
            typeOfSpecimen: '',
            collectionDateTime: '',
            instructionsForCollection: '',
        },
        testResults: {
            numericResults: '',
            referenceRanges: '',
            unitsOfMeasurement: '',
        },
        interpretationComments: {
            interpretation: '',
            additionalComments: '',
        },
        laboratoryInformation: {
            labName: '',
            labAddress: '',
            contactInformation: '',
        },
    });

    const handleInputChange = (section, field, value) => {
        setLabReportData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value,
            },
        }));
    };

    const handleTestInputChange = (index, field, value) => {
        setLabReportData((prevData) => ({
            ...prevData,
            testDetails: prevData.testDetails.map((test, i) =>
                i === index ? { ...test, [field]: value } : test
            ),
        }));
    };

    const handleAddTest = () => {
        setLabReportData((prevData) => ({
            ...prevData,
            testDetails: [...prevData.testDetails, { testName: '', dateOfTest: '', orderingPhysician: '' }],
        }));
    };

    const handleDeleteTest = (index) => {
        setLabReportData((prevData) => ({
            ...prevData,
            testDetails: prevData.testDetails.filter((_, i) => i !== index),
        }));
    };


    // unique number generater 
    const InvoiceCode = 13;
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



    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async () => {
        if (!validateEmail(labReportData.patientInformation.email) || !validateEmail(labReportData.laboratoryInformation.contactInformation) || uniqueNumber === "xxxxxxxxxxxxxxx") {
            alert('Invalid Input, Please enter valid Details.');
            return;
        }

        setLoading(true);
        try {
            // check user is exist or not 
            const response = await fetch(`${process.env.REACT_APP_API_URL}/useremail/${labReportData.patientInformation.email}`);
            const data = await response.json();
            setMessage('Checking Details...')
            if (data.userData) {

                // Convert array of objects to a single string
                const concatenatedString = labReportData.testDetails.map(obj => `${obj.testName},${obj.dateOfTest},${obj.orderingPhysician}`).join(';');
                
                const InvoiceData = [
                    labReportData.patientInformation.fullName,
                    labReportData.patientInformation.age,
                    labReportData.patientInformation.gender,
                    labReportData.patientInformation.dateOfBirth,
                    labReportData.patientInformation.address,
                    labReportData.patientInformation.email,
                    concatenatedString,
                    labReportData.specimenInformation.typeOfSpecimen,
                    labReportData.specimenInformation.collectionDateTime,
                    labReportData.specimenInformation.instructionsForCollection,
                    labReportData.testResults.numericResults,
                    labReportData.testResults.referenceRanges,
                    labReportData.testResults.unitsOfMeasurement,
                    labReportData.interpretationComments.interpretation,
                    labReportData.interpretationComments.additionalComments,
                    labReportData.laboratoryInformation.labName,
                    labReportData.laboratoryInformation.labAddress,
                    labReportData.laboratoryInformation.contactInformation,
                ];

                const Memo = {
                    NCD_ID: uniqueNumber,
                    DocType_ID: InvoiceCode,
                    user_ID: data.userData._id,
                    data: InvoiceData,
                    history: []
                }

                console.log(Memo)
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
                                    <a className="active" href="#">Lab Report</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='invoice_container'>
                        <div className="invoice-form-container">
                            <div className="head">
                                <div>
                                    <label>Date:</label>
                                    <input className='form-control' type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ width: '120px' }}>Document No:</label>
                                    <input className='form-control' type="text" placeholder='XXXXXXXXXXXXXXX' value={uniqueNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
                                    <button className='generateCodeBtn btn btn-secondary' onClick={generateUniqueNumber}>Generate</button>
                                </div>
                            </div>
                            {/* Patient Information */}
                            <div>
                                <h3>Patient Details</h3>
                                <div className='PatientDetailsWrapper'>
                                    <div>
                                        <label>Full Name:</label>
                                        <input
                                            className='form-control'
                                            placeholder='Patient Name'
                                            type="text"
                                            value={labReportData.patientInformation.fullName}
                                            onChange={(e) => handleInputChange('patientInformation', 'fullName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Age:</label>
                                        <input
                                            className='form-control'
                                            placeholder='Patient Age'
                                            type="number"
                                            value={labReportData.patientInformation.age}
                                            onChange={(e) => handleInputChange('patientInformation', 'age', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Gender:</label>
                                        <select
                                            style={{ width: '230px' }}
                                            className='form-control'
                                            value={labReportData.patientInformation.gender}
                                            onChange={(e) => handleInputChange('patientInformation', 'gender', e.target.value)}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Date of Birth:</label>
                                        <input
                                            type="date"
                                            className='form-control'
                                            value={labReportData.patientInformation.dateOfBirth}
                                            onChange={(e) => handleInputChange('patientInformation', 'dateOfBirth', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Address:</label>
                                        <input
                                            type="text"
                                            placeholder='Address'
                                            className='form-control'
                                            value={labReportData.patientInformation.address}
                                            onChange={(e) => handleInputChange('patientInformation', 'address', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Email:</label>
                                        <input
                                            type="text"
                                            placeholder='Email'
                                            className='form-control'
                                            value={labReportData.patientInformation.email}
                                            onChange={(e) => handleInputChange('patientInformation', 'email', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Test Details */}
                            <h3>Test Details</h3>
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th scope="col">Test Name</th>
                                        <th scope="col">Date of Test</th>
                                        <th scope="col">Ordering Physician</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {labReportData.testDetails.map((test, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="text"
                                                    className='form-control'
                                                    placeholder='Test Name'
                                                    value={test.testName}
                                                    onChange={(e) => handleTestInputChange(index, 'testName', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    className='form-control'
                                                    value={test.dateOfTest}
                                                    onChange={(e) => handleTestInputChange(index, 'dateOfTest', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className='form-control'
                                                    placeholder='Ordering Physician'
                                                    value={test.orderingPhysician}
                                                    onChange={(e) => handleTestInputChange(index, 'orderingPhysician', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <button style={{ padding: '5px 5px' }} className='btn btn-danger' onClick={() => handleDeleteTest(index)}>
                                                    <i style={{ fontSize: '20px', marginBottom: '0px' }} className='bx bx-x'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className='btn btn-secondary' onClick={handleAddTest}>
                                <i className='bx bx-plus-medical'></i>
                            </button>

                            {/* Specimen Information */}
                            <div className='specimenContainer'>
                                <h3>Specimen Information</h3>
                                <label>Type of Specimen:</label>
                                <input
                                    type="text"
                                    placeholder='Type of Specimen'
                                    className='form-control'
                                    value={labReportData.specimenInformation.typeOfSpecimen}
                                    onChange={(e) => handleInputChange('specimenInformation', 'typeOfSpecimen', e.target.value)}
                                />
                                <label>Collection Date and Time:</label>
                                <input
                                    type="date"
                                    className='form-control'
                                    value={labReportData.specimenInformation.collectionDateTime}
                                    onChange={(e) => handleInputChange('specimenInformation', 'collectionDateTime', e.target.value)}
                                />
                                <label>Any specific instructions for specimen collection:</label>
                                <textarea
                                    type="text"
                                    className='form-control'
                                    value={labReportData.specimenInformation.instructionsForCollection}
                                    onChange={(e) => handleInputChange('specimenInformation', 'instructionsForCollection', e.target.value)}
                                />

                                {/* Test Results */}
                                <label>Numeric Results:</label>
                                <input
                                    type="text"
                                    placeholder='Numeric Results'
                                    className='form-control'
                                    value={labReportData.testResults.numericResults}
                                    onChange={(e) => handleInputChange('testResults', 'numericResults', e.target.value)}
                                />
                                <label>Reference Ranges (normal values):</label>
                                <input
                                    type="text"
                                    placeholder='Reference Ranges'
                                    className='form-control'
                                    value={labReportData.testResults.referenceRanges}
                                    onChange={(e) => handleInputChange('testResults', 'referenceRanges', e.target.value)}
                                />
                                <label>Units of Measurement:</label>
                                <input
                                    type="text"
                                    placeholder='Units of Measurement'
                                    className='form-control'
                                    value={labReportData.testResults.unitsOfMeasurement}
                                    onChange={(e) => handleInputChange('testResults', 'unitsOfMeasurement', e.target.value)}
                                />
                            </div>
                            {/* Interpretation/Comments */}
                            <h3>Interpretation/Comments</h3>
                            <label>Interpretation of the results by the lab:</label>
                            <textarea
                                type="text"
                                className='form-control'
                                value={labReportData.interpretationComments.interpretation}
                                onChange={(e) => handleInputChange('interpretationComments', 'interpretation', e.target.value)}
                            />
                            <label>Any additional comments or notes:</label>
                            <textarea
                                type="text"
                                className='form-control'
                                value={labReportData.interpretationComments.additionalComments}
                                onChange={(e) => handleInputChange('interpretationComments', 'additionalComments', e.target.value)}
                            />

                            {/* Laboratory Information */}
                            <div className='LabDetailsContainer'>
                                <h3>Laboratory Information</h3>
                                <div className='LabDetailsWrapper'>
                                    <div>
                                        <label>Lab Name:</label>
                                        <input
                                            type="text"
                                            placeholder='Lab Name'
                                            className='form-control'
                                            value={labReportData.laboratoryInformation.labName}
                                            onChange={(e) => handleInputChange('laboratoryInformation', 'labName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Lab Address:</label>
                                        <input
                                            type="text"
                                            placeholder='Lab Address'
                                            className='form-control'
                                            value={labReportData.laboratoryInformation.labAddress}
                                            onChange={(e) => handleInputChange('laboratoryInformation', 'labAddress', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Contact Information:</label>
                                        <input
                                            type="text"
                                            placeholder='Lab email'
                                            className='form-control'
                                            value={labReportData.laboratoryInformation.contactInformation}
                                            onChange={(e) => handleInputChange('laboratoryInformation', 'contactInformation', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* <button onClick={handleSubmit}>Submit</button> */}
                            <div className='bottom'>
                                <div className='buttons'>
                                    <Link to="/organization" className="cancel">
                                        <button className='btn btn-danger'>Cancel</button>
                                    </Link>
                                    <button className='create btn btn-success' type="button" onClick={handleSubmit}>
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default LabReportForm;

