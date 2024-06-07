import React, { useEffect, useState, CSSProperties } from "react";
import CreateDoc from './CreateDoc';
import ValidateDoc from './ValidateDac';
import OrgRegister from './OrgRegister';
import OrgLogin from './OrgLogin';
import DashHome from './DashHome';
import { refreshPage } from '../js/utilityFunctions';
import Logo from '../img/logo.png';
import User from '../img/user.png';
import '../css/Navbar.css';
import '../css/main.css';
import RingLoader from "react-spinners/RingLoader";
import InvoiceForm from "./InvoiceForm";
import PrescriptionForm from "./PrescriptionForm";
import LabReportForm from "./LabReportForm";

const Dashboard = ({ state }) => {
  const [showRegistration, setShowRegistration] = useState(true);
  const [loading, setLoading] = useState(false); // New loading state

  const toggleForm = () => {
    setShowRegistration(!showRegistration);
  };

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
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false); // Set loading to false when user details are fetched
        }
      }
    };

    checkOrgLogin();
  }, []);

  // const [showHome, setShowHome] = useState(true);
  const [showCreateDoc, setShowCreateDoc] = useState(false);
  const [showValidateDoc, setShowValidateDoc] = useState(false);

  const handleCreateDocClick = () => {
    setShowHome(false);
    setShowCreateDoc(true);
    setShowValidateDoc(false);
  };

  const handleValidateDocClick = () => {
    setShowHome(false);
    setShowCreateDoc(false);
    setShowValidateDoc(true);
  };

  const handleHomeClick = () => {
    setShowHome(true);
    setShowCreateDoc(false);
    setShowValidateDoc(false);
  };



  // buttons to select document to create 
  const [showHome, setShowHome] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showLabReport, setShowLabReport] = useState(false);

  const handleButtonClick = (component) => {
    setShowHome(false);
    setShowInvoice(false);
    setShowPrescription(false);
    setShowLabReport(false);

    switch (component) {
      case 'home':
        setShowHome(true);
        break;
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
      ) : orgDetails ? (
        <div>
          {/* // SIDEBAR  */}
          <section id="sidebar">
            <a href="#" className="brand">
              <i className='bx bxs-cube'></i>
              <span className="text">NCD</span>
            </a>
            <ul className="side-menu top">
              <li className="">
                <a href="#" onClick={() => handleButtonClick('home')}>
                  <i className='bx bxs-dashboard' ></i>
                  <span className="text">Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => handleButtonClick('invoice')}>
                  <i className='bx bxs-notepad' ></i>
                  <span className="text">Invoice</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => handleButtonClick('prescription')}>
                  <i className='bx bx-list-plus' ></i>
                  <span className="text">Prescription</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => handleButtonClick('labReport')}>
                  <i className='bx bx-test-tube' ></i>
                  <span className="text">Lab Report</span>
                </a>
              </li>
            </ul>
            <ul className="side-menu">
              <li>
                <a href="#" className="logout" onClick={handleLogout}>
                  <i className='bx bxs-log-out-circle' ></i>
                  <span className="text">Logout</span>
                </a>
              </li>
            </ul>
          </section>
          {/* // <!-- SIDEBAR --> */}



          {/* // <!-- CONTENT --> */}
          <section id="content">
            {/* <!-- NAVBAR --> */}
            <nav>
              <i className='bx bx-menu' ></i>
              <a href="#" className="nav-link"></a>
              <form action="#">
                <div className="form-input">
                  <input type="search" placeholder="Search..." />
                  <button type="submit" className="search-btn"><i className='bx bx-search' ></i></button>
                </div>
              </form>
              
              <a style={{
                boedwr:'1px solid red'
              }} href="#" className="profile">
                <img src={User} />
              </a>
            </nav>
            {/* <!-- NAVBAR --> */}

            {/* <!-- MAIN --> */}
            <main>
              {/* {showHome && <DashHome state={state} orgDetails={orgDetails} />}
              {showCreateDoc && <CreateDoc state={state} orgDetails={orgDetails} />}
              {showValidateDoc && <ValidateDoc state={state} />} */}

              {showHome && <DashHome state={state} orgDetails={orgDetails} />}
              {showInvoice && <InvoiceForm onClose={handleBackButtonClick} state={state} orgDetails={orgDetails} />}
              {showPrescription && <PrescriptionForm onClose={handleBackButtonClick} state={state} orgDetails={orgDetails} />}
              {showLabReport && <LabReportForm onClose={handleBackButtonClick} state={state} orgDetails={orgDetails} />}
            </main>
            {/* <!-- MAIN --> */}
          </section>
          {/* <!-- CONTENT --> */}



        </div>
      ) : (
        <div className="app-container">
          {showRegistration ? (
            <OrgRegister toggleForm={toggleForm} />
          ) : (
            <OrgLogin toggleForm={toggleForm} />
          )}
        </div>
      )
      }
    </div >
  );
};

export default Dashboard;



{/* {/* // <div style={{ backgroundColor: '#f8f7fd', height: '100vh' }}>
        //   <div className="navbar">
        //     <div className="left">
        //       <img src={Logo} alt="Logo" />
        //     </div>
        //     <div className="right">
        //       <div className="nav_links">
        //         <button onClick={handleHomeClick}>Home</button>
        //         <button onClick={handleCreateDocClick}>Create Doc</button>
        //         <button onClick={handleValidateDocClick}>Validate Doc</button>
        //       </div>
        //       <div className="details">
        //         <img src={User} alt="Logo" />
        //         <p>{orgDetails.name}</p>
        //         <i className='bx bx-log-out' onClick={handleLogout}></i>
        //       </div>
        //     </div>
        //   </div>
        //   {/* <div className="block"></div> */}
//   <CreateDoc state={state} orgDetails={orgDetails} />
//   <div className="tableSection">
//     <DashHome state={state} orgDetails={orgDetails} />
//   </div>
//   {/* {showHome && <DashHome state={state} orgDetails={orgDetails} />}
//   {showCreateDoc && <CreateDoc state={state} orgDetails={orgDetails} />}
//   {showValidateDoc && <ValidateDoc state={state} />} */}
// </div> * /} */}