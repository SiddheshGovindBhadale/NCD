import React, { useEffect, useState } from 'react';
import Docs from '../img/docs.png';

const ShowDoc = ({ state }) => {
    // smart contract connection 
    const [memos, setMemos] = useState([]);
    const { contract } = state;

    useEffect(() => {
        const memosMessage = async () => {
            const memos = await contract.getDocs();
            setMemos(memos);
        };
        contract && memosMessage();
    }, [contract]);


    return (
        <div className='user_container'>
            <h3>Documents</h3>
            <div className='box_container'>
                {memos.map((memo) => {
                    return (
                        <div className='box'>
                            <div className='left'>
                                <img src={Docs} alt="Document" />
                            </div>
                            <div className='right'>
                                <p><strong>Doc ID : </strong>{memo.NCD_ID}</p>
                                <p><strong>Doc Type : </strong>{memo.DocType_ID === "11" ? 'Invoice' : 'Not Found'}</p>
                                <button className='btn'>Print</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShowDoc;
