import React from 'react';
import InvoiceItem from './InvoiceItem';
import '../css/invoice.css'


const Invoice = ({ data, onBack }) => {
  console.log(data)

  // Convert the string back to an array of objects
  const itemData = data[3][6].split(';').map(item => {
    const [itemName, quantity, price] = item.split(',');
    return { itemName: itemName, quantity: parseInt(quantity), price: parseInt(price) };
  });

  // Log the new array of objects
  console.log(`new array after spliting - ${itemData[0].itemName}`);

  return (
    <div className='myInvoice'>
      <div className="invoice-container">
        <div className='invoice_nav'>
          <div className='left'>
            <h2>Invoice</h2>
            <p>No-DOC-{data[0]}</p>
          </div>
        </div>

        <div className='mid_section'>
          <div className='left'>
            <div className='top'>
              <p>Total</p>
              <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}><i style={{ fontSize: 20.8, fontWeight: 650 }} className='bx bx-rupee'></i>{data[3][5]}</h3>
            </div>
            <div className='line'></div>
            <div className='bottom'>
              <p>Date : {data[3][0]}</p>
              <p>Invoice no: {data[0]}</p>
            </div>
          </div>
          <div className='right'>
            <p>invoice to :</p>
            <h3>{data[3][3]}</h3>
            <p>{data[3][4]}<i className='bx bxs-envelope'></i></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {itemData.map((item, index) => (
              <InvoiceItem key={index} item={item} />
            ))}
          </tbody>
        </table>

        <div className="invoice_summary">
          <div>
            <p>Total:</p>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}><i style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: 18, fontWeight: 500 }} className='bx bx-rupee'></i>{data[3][5]}</p>
          </div>
        </div>

        <div className='bottom_nav'>
          <div className='left'>
            <h3>Thank you for Business!</h3>
          </div>
          <div className='right'>
            <div className='bottom_nav_line'></div>
            <h3>{data[3][1]}</h3>
            <p>Administrater</p>
          </div>
        </div>
      </div>
      <div className='bottom_invoice_nav'>
        <button className='back_button btn' onClick={onBack}>Back</button>
      </div>
    </div>
  );
};

export default Invoice;
