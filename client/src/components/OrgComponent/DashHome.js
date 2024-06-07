import React, { useEffect, useState } from 'react';
import RingLoader from "react-spinners/RingLoader";

const DocFilter = ({ dataArray, inputNumber }) => {
    // State to store the filtered data
    const [filteredData, setFilteredData] = useState([]);
    const [countData, setCountData] = useState({});
    const [loading, setLoading] = useState(true); // New loading state
    // const [messaage, setMessage] = useState(''); // New loading state

    useEffect(() => {
        // Use reduce to count occurrences of each value in the second element (index 1)
        const counts = filteredData.reduce((acc, curr) => {
            const value = curr[1];

            // Use spread operator to create a new object with existing counts
            // and increment the count for the current value
            acc[value] = (acc[value] || 0) + 1;

            return acc;
        }, {});

        // Set the state variable with the count data
        setCountData(counts);
    }, [filteredData]);


    // Function to filter data based on the first 6 digits of id
    const filterData = () => {
        const filtered = dataArray.filter(item => item[0].startsWith(inputNumber.toString().substring(0, 6)));
        setFilteredData(filtered);
    };

    // Call filterData when the component mounts or inputNumber changes
    React.useEffect(() => {
        setLoading(true);
        filterData();
        setLoading(false);
    }, [inputNumber, dataArray]);

    // console.log(countData[13] || 0)
    let srNo = 1;

    return (
        <>
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
                    {/* <p style={{
                        color: '#000000',
                        textAlign: 'center',
                        marginTop: '5px'
                    }}>{messaage}</p> */}
                </div>
            ) : (
                <>
                    <div className="head-title">
                        <div className="left">
                            <h1>Dashboard</h1>
                            <ul className="breadcrumb">
                                <li>
                                    <a href="/#">Dashboard</a>
                                </li>
                                <li><i className='bx bx-chevron-right' ></i></li>
                                <li>
                                    <a className="active" href="/#">Home</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <ul className="box-info">
                        <li>
                            <i className='bx bxs-notepad' ></i>
                            <span className="text">
                                <h3>{countData[11] || 0}</h3>
                                <p>Invoice</p>
                            </span>
                        </li>
                        <li>
                            <i className='bx bx-list-plus' ></i>
                            <span className="text">
                                <h3>{countData[12] || 0}</h3>
                                <p>Prescription</p>
                            </span>
                        </li>
                        <li>
                            <i className='bx bx-test-tube' ></i>
                            <span className="text">
                                <h3>{countData[13] || 0}</h3>
                                <p>Lab Report</p>
                            </span>
                        </li>
                    </ul>


                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>Created Documents</h3>
                                <i className='bx bx-search' ></i>
                                <i className='bx bx-filter' ></i>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sr No.</th>
                                        <th>Document ID</th>
                                        <th>Document Type</th>
                                    </tr>
                                </thead>
                                {filteredData.length > 0 ? (
                                    <tbody>
                                        {filteredData.map(item => (
                                            <tr key={item[0]}>
                                                <td>{srNo++}</td>
                                                <td>{item[0]}</td>
                                                <td>{item[1] === "11" ? <span className="status completed">Invoice</span> : item[1] === "12" ? <span className="status process">Prescription</span> : item[1] === "13" ? <span className="status pending">Lab Report</span> : 'Not Found'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : (
                                    <p style={{
                                        color: '#000000',
                                        textAlign: 'center',
                                        width: '100%',
                                        marginTop: '20px'
                                    }}>No any Document created...</p>
                                )}
                            </table>
                        </div>
                    </div>
                </>
            )
            }

        </>
    );
};

// Example usage
const OrgDocument = (props) => {
    // smart contract connection 
    const [memos, setMemos] = useState([]);
    const { contract } = props.state;

    useEffect(() => {
        const memosMessage = async () => {
            const memos = await contract.getDocs();
            setMemos(memos);
        };
        contract && memosMessage();
    }, [contract]);

    const inputNumber = props.orgDetails.code; // Replace with your 6-digit number

    return <DocFilter dataArray={memos} inputNumber={inputNumber} />;
};

export default OrgDocument;
