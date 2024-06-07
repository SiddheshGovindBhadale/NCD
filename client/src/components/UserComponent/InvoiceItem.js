import React from 'react';

const InvoiceItem = ({ item }) => {
  const { itemName, quantity, price } = item;
  // const total = quantity * price;

  return (
    <tr>
      <td>{itemName}</td>
      <td>{quantity}</td>
      <td style={{display:'flex', alignItems:'center', justifyContent:'flex-start'}}><i style={{fontSize:17, fontWeight:500}} className='bx bx-rupee'></i>{price.toFixed(2)}</td>
    </tr>
  );
};

export default InvoiceItem;
