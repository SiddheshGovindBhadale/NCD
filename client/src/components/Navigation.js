import React from 'react';
import { Link } from 'react-router-dom'; // Use 'react-router-dom' if you're using React Router
import './css/Navbar.css';
import userImg from './img/user.png';
import orgImg from './img/corporation.png';

const Navigation = () => {
  return (
    <div>
      <nav>
        <li className='btn'>
          <Link to="/organization" className="nav-link">
            <img src={orgImg} alt="organization" />
            <p>organization</p>
          </Link>
        </li>
        <li className='btn'>
          <Link to="/Home" className="nav-link">
            <img src={userImg} alt="user" />
            <p>organization 2</p>
          </Link>
        </li>
      </nav>
    </div>
  );
};

export default Navigation;

