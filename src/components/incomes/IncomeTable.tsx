'use client';

import React from 'react';
import { Table } from 'antd';

const IncomeTable: React.FC = () => {
  const columns = [
    { title: 'Type', dataIndex: 'incomeType' },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Date', dataIndex: 'receivedDate' },
  ];
  const data = [
    { key: 1, incomeType: 'Salary', amount: 7000, receivedDate: '2025-06-20' },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      size="small"
      pagination={false}
    />
  );
};

export default IncomeTable;

