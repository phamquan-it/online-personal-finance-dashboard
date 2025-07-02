'use client'

import React from 'react'
import { Table, Button } from 'antd'
import { MoreOutlined } from '@ant-design/icons'

interface Investment {
    id: string | number
    name: string
    type: string
    amount: number
    returnRate: number
}

interface InvestmentTableProps {
    data: Investment[]
    onShowModal: (record: Investment) => void
    t: (key: string) => string
}

const InvestmentTable: React.FC<InvestmentTableProps> = ({ data, onShowModal, t }) => {
    const columns = [
        {
            title: t('investmentName'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('investmentType'),
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: t('investmentAmount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: t('investmentReturnRate'),
            dataIndex: 'returnRate',
            key: 'returnRate',
            render: (val: number) => `${val.toFixed(2)}%`,
        },
        {
            key: 'actions',
            render: (_: any, record: Investment) => (
                <Button icon={<MoreOutlined />} onClick={() => onShowModal(record)} />
            ),
        },
    ]

    return (
        <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            loading={false}
        />
    )
}

export default InvestmentTable

