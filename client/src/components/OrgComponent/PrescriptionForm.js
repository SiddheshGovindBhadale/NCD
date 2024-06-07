import React, { useEffect, useState } from 'react';
import RingLoader from "react-spinners/RingLoader";
import { Link, useNavigate } from 'react-router-dom';
import '../css/PrescriptionForm.css'
const PrescriptionForm = ({ state }) => {
    const navigate = useNavigate();

    const InvoiceCode = 12;
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



    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    // const [documentNumber, setDocumentNumber] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [prescriptionData, setPrescriptionData] = useState({
        patient: {
            fullName: '',
            age: '',
            gender: '',
            address: '',
            contact: '',
        },
        details: [
            {
                medication: '',
                dosage: '',
                frequency: '',
                duration: '',
            },
        ],
        doctor: {
            name: '',
            contact: '',
        },
        diagnosis: diagnosis,
        notes: notes,
    });

    const handleInputChange = (section, field, value) => {
        setPrescriptionData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value,
            },
        }));
    };

    const handleMedicationChange = (index, field, value) => {
        setPrescriptionData((prevData) => ({
            ...prevData,
            details: prevData.details.map((med, i) =>
                i === index ? { ...med, [field]: value } : med
            ),
        }));
    };

    const handleAddMedication = () => {
        setPrescriptionData((prevData) => ({
            ...prevData,
            details: [...prevData.details, { medication: '', dosage: '', frequency: '', duration: '' }],
        }));
    };

    const handleDeleteMedication = (index) => {
        setPrescriptionData((prevData) => ({
            ...prevData,
            details: prevData.details.filter((_, i) => i !== index),
        }));
    };

    // const handleSubmit = () => {
    //     // Handle data submission, e.g., sending to backend or storing in state
    //     console.log('Prescription Data:', prescriptionData);
    // };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async () => {
        if (!validateEmail(prescriptionData.patient.contact) || !validateEmail(prescriptionData.doctor.contact) || uniqueNumber === "xxxxxxxxxxxxxxx") {
            alert('Invalid Input, Please enter valid Details.');
            return;
        }

        setLoading(true);
        try {
            // check user is exist or not 
            const response = await fetch(`${process.env.REACT_APP_API_URL}/useremail/${prescriptionData.patient.contact}`);
            const data = await response.json();
            setMessage('Checking Details...')
            if (data.userData) {
                // Convert array of objects to a single string
                const concatenatedString = prescriptionData.details.map(obj => `${obj.medication},${obj.dosage},${obj.frequency},${obj.duration}`).join(';');

                const InvoiceData = [
                    date,
                    prescriptionData.patient.fullName,
                    prescriptionData.patient.age,
                    prescriptionData.patient.gender,
                    prescriptionData.patient.address,
                    prescriptionData.patient.contact,
                    prescriptionData.doctor.name,
                    prescriptionData.doctor.contact,
                    diagnosis,
                    notes,
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
                                    <a className="active" href="#">Prescription</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='invoice_container'>
                        <div className="invoice-form-container">
                            <div>
                                {/* Patient Information */}
                                <div className="head">
                                    <div >
                                        <label>Date:</label>
                                        <input className='form-control' type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Document Number:</label>
                                        <input style={{ marginBottom: '0px' }} className='form-control' type="text" placeholder='XXXXXXXXXXXXXXX' value={uniqueNumber} />
                                        <button className='generateCodeBtn btn btn-secondary' onClick={generateUniqueNumber}>Generate</button>
                                    </div>
                                </div>

                                <div className='patientDetails'>
                                    <h3>Patient Information:</h3>
                                    <div className='patientDetailsContainer'>
                                        <div style={{ marginRight: '20px' }}>
                                            <label>Patient Name:</label>
                                            <input
                                                type="text"
                                                placeholder='Patient name'
                                                className='form-control'
                                                value={prescriptionData.patient.fullName}
                                                onChange={(e) => handleInputChange('patient', 'fullName', e.target.value)}
                                            />
                                        </div>
                                        <div style={{ marginRight: '20px' }}>
                                            <label>Age:</label>
                                            <input
                                                type="number"
                                                placeholder='Patient age'
                                                className='form-control'
                                                value={prescriptionData.patient.age}
                                                onChange={(e) => handleInputChange('patient', 'age', e.target.value)}
                                            />
                                        </div>
                                        <div style={{ marginRight: '20px' }}>
                                            <label>Gender:</label>
                                            <select
                                                style={{ width: '230px' }}
                                                className='form-control'
                                                value={prescriptionData.patient.gender}
                                                onChange={(e) => handleInputChange('patient', 'gender', e.target.value)}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {/* <input
                                                type="text"
                                                placeholder='Patient gender'
                                                className='form-control'
                                                value={prescriptionData.patient.gender}
                                                onChange={(e) => handleInputChange('patient', 'gender', e.target.value)}
                                            /> */}
                                        </div>
                                        <div style={{ marginRight: '20px' }}>
                                            <label>Address:</label>
                                            <input
                                                type="text"
                                                placeholder='Patient address'
                                                className='form-control'
                                                value={prescriptionData.patient.address}
                                                onChange={(e) => handleInputChange('patient', 'address', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label>Email:</label>
                                            <input
                                                type="email"
                                                placeholder='Patient email address'
                                                className='form-control'
                                                value={prescriptionData.patient.contact}
                                                onChange={(e) => handleInputChange('patient', 'contact', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='doctorDetails'>
                                    {/* Prescription Details */}
                                    <h3>Prescription Details:</h3>
                                    <div className='doctorDetailsContainer'>
                                        <div>
                                            <label>Doctor's Name:</label>
                                            <input
                                                type="text"
                                                placeholder='Doctor name'
                                                className='form-control'
                                                value={prescriptionData.doctor.name}
                                                onChange={(e) => handleInputChange('doctor', 'name', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label>Doctor's Email:</label>
                                            <input
                                                type="email"
                                                placeholder='Doctor email'
                                                className='form-control'
                                                value={prescriptionData.doctor.contact}
                                                onChange={(e) => handleInputChange('doctor', 'contact', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label>Diagnosis/Reason for Prescription:</label>
                                        <textarea
                                            className='form-control'
                                            placeholder='Diagnosis/Reason for Prescription'
                                            value={diagnosis}
                                            onChange={(e) => setDiagnosis(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label>Additional Notes:</label>
                                        <textarea
                                            className='form-control'
                                            placeholder='Any other relevant information or notes'
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Medication Details */}
                                <div className="items-section">
                                    <h3>Medication Details:</h3>
                                    <table className="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">Medication Name</th>
                                                <th scope="col">Dosage</th>
                                                <th scope="col">Frequency</th>
                                                <th scope="col">Duration</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescriptionData.details.map((medication, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <input
                                                            style={{
                                                                width: '210px'
                                                            }}
                                                            placeholder='Medication name'
                                                            className='form-control'
                                                            type="text"
                                                            value={medication.medication}
                                                            onChange={(e) => handleMedicationChange(index, 'medication', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            style={{
                                                                width: '150px'
                                                            }}
                                                            placeholder='Dosage'
                                                            className='form-control'
                                                            type="text"
                                                            value={medication.dosage}
                                                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            style={{
                                                                width: '150px'
                                                            }}
                                                            placeholder='Frequency'
                                                            className='form-control'
                                                            type="text"
                                                            value={medication.frequency}
                                                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            style={{
                                                                width: '150px'
                                                            }}
                                                            placeholder='Duration'
                                                            className='form-control'
                                                            type="text"
                                                            value={medication.duration}
                                                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button style={{ padding: '5px 5px' }} className='btn btn-danger' onClick={() => handleDeleteMedication(index)}>
                                                            <i style={{ fontSize: '20px', marginBottom: '0px' }} className='bx bx-x'></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button className='btn btn-secondary' onClick={handleAddMedication}>
                                        <i className='bx bx-plus-medical'></i>
                                    </button>
                                </div>

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
                                {/* <button className='create btn btn-success' onClick={handleSubmit}>Submit</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default PrescriptionForm;
