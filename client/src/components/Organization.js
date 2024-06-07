// Organization.js
import React from 'react';
import Dashboard from './OrgComponent/Dashboard';


const Organization = ({ state }) => {
  return (
    <div>
      <Dashboard state={state}/>
    </div>
  );
};

export default Organization;
