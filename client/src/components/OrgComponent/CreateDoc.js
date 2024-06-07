import React, { useState } from "react";
import Invoice from './InvoiceForm';
import InvoiceImg from '../img/invoice.png';
import PreImg from '../img/prescription.png';
import ReportImg from '../img/dna-test.png';
import '../css/Dashboard.css';
import { Link } from 'react-router-dom';

const Prescription = ({ onClose }) => {
  return (
    <div>
      <h2>Prescription Component</h2>
      <button onClick={onClose}>Back</button>
    </div>
  );
};

const LabReport = ({ onClose }) => {
  return (
    <div>
      <h2>Lab Report Component</h2>
      <button onClick={onClose}>Back</button>
    </div>
  );
};

const CreateDoc = (props) => {
  // buttons to select document to create 
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showLabReport, setShowLabReport] = useState(false);

  const handleButtonClick = (component) => {
    setShowInvoice(false);
    setShowPrescription(false);
    setShowLabReport(false);

    switch (component) {
      case 'invoice':
        setShowInvoice(true);
        break;
      case 'prescription':
        setShowPrescription(true);
        break;
      case 'labReport':
        setShowLabReport(true);
        break;
      default:
        break;
    }
  };

  const handleBackButtonClick = () => {
    setShowInvoice(false);
    setShowPrescription(false);
    setShowLabReport(false);
  };
  return (
    <div>
      {!showInvoice && !showPrescription && !showLabReport && (
        <div>
          <div className="main_container">
            <div className="top_section">
              <div className="heading">
                <h2>Create Documents</h2>
              </div>
              <div>
                <input className='form-control' type="search" placeholder="Search...."></input>
              </div>
            </div>
            <div className="bottom_section">
              <Link to="/invoice" className="nav-link">
                <button>
                  {/* <button onClick={() => handleButtonClick('invoice')}> */}
                  <img src={InvoiceImg} alt="InvoiceImg" />
                  <p>Invoice</p>
                </button>
              </Link>
              <Link to="/PrescriptionForm" className="nav-link">
                <button>
                  <img src={PreImg} alt="PreImg" />
                  <p>Prescription</p>
                </button>
              </Link>
              <Link to="/LabReportForm" className="nav-link">
                <button>
                  <img src={ReportImg} alt="PreImg" />
                  <p>Lab Report</p>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* {showInvoice && <Invoice onClose={handleBackButtonClick} state={state} orgDetails={orgDetails} />} */}
      {showPrescription && <Prescription onClose={handleBackButtonClick} />}
      {showLabReport && <LabReport onClose={handleBackButtonClick} />}
    </div>
  );
};

export default CreateDoc;
