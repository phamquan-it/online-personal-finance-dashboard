'use client'

import { Table, Typography, Space, Button, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Text } = Typography

export interface Portfolio {
    id: number
    name: string
    totalInvested: number
    currentValue: number
    investmentCount: number
}

interface PortfolioTableProps {
    data: Portfolio[]
    loading?: boolean
    onClickRow?: (record: Portfolio) => void
    onEdit?: (record: Portfolio) => void
    onDelete?: (id: number) => void
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({
    data,
    loading,
    onClickRow,
    onEdit,
    onDelete,
}) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Invested',
            dataIndex: 'totalInvested',
            key: 'totalInvested',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: 'Current Value',
            dataIndex: 'currentValue',
            key: 'currentValue',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: 'Investments',
            dataIndex: 'investmentCount',
            key: 'investmentCount',
        },
        {
            title: 'Performance',
            key: 'performance',
            render: (_: any, record: Portfolio) => {
                const perf = record.currentValue - record.totalInvested
                const color = perf >= 0 ? 'green' : 'red'
                return <Text style={{ color }}>{perf.toLocaleString()} VND</Text>
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Portfolio) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => onEdit?.(record)}
                    />
                    <Popconfirm
                        title="Are you sure to delete this portfolio?"
                        onConfirm={() => onDelete?.(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            loading={loading}
            scroll={{ y: 300, x: 'max-content' }}
            pagination={false}
            onRow={(record) => ({
                onClick: () => onClickRow?.(record),
                style: { cursor: 'pointer' },
            })}
        />
    )
}

export default PortfolioTable

