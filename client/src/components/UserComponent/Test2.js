import React, { useState } from 'react';
import Invoice from './InvoiceDoc';

const Test = () => {
  // Mock data for the invoice
  const invoiceData = {
    invoiceNumber: 'INV-123',
    issueDate: '2023-01-15',
    dueDate: '2023-02-15',
    items: [
      { description: 'Item 1', quantity: 2, price: 50 },
      { description: 'Item 2', quantity: 1, price: 75 },
      // Add more items as needed
    ],
    taxRate: 0.1, // 10%
  };

  return (
    <div className="app-container">
      <h1>Invoice App</h1>
      <Invoice data={invoiceData} />
    </div>
  );
};

export default Test;
