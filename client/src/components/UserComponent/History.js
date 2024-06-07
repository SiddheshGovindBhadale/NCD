// InvoiceComponent.js
import React, { useState, useEffect } from 'react';


const DocHistory = ({ data, onBack }) => {
    const historyArr = data[4].slice(1);

    const [data2, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newData = await Promise.all(
                    historyArr.map(async (item, index) => {
                        const organizationData = await fetchOrganizationData(item[0]);
                        return { srNo: index + 1, ...organizationData, orderData: item.slice(1) };
                    })
                );

                setData(newData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Run the effect only once on component mount

    const fetchOrganizationData = async (organizationId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/orgs/${organizationId}`);
        const orgData = await response.json();
        return {
            organizationName: orgData.name,
            // Add other organization-related data here if needed
        };
    };


    return (
        <div className='history_container'>
                <h2>History of Document</h2>
                <table className='table'>
                    <thead className='table-light'>
                        <tr>
                            <th>Sr No</th>
                            <th>Organization Name</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data2.map((row, index) => (
                            <tr key={index}>
                                <td>{row.srNo}</td>
                                <td>{row.organizationName}</td>
                                {row.orderData.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className='back_button btn' onClick={onBack}>Back</button>

            </div>
    );
};

export default DocHistory;