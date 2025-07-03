'use client'

import React, { useState } from 'react'
import {
    Modal,
    Tabs,
    Form,
    Input,
    Select,
    InputNumber,
    Button,
    message,
} from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import {
    useDeleteInvestmentMutation,
    useUpdateInvestmentMutation,
} from '@/libs/redux/services/investmentApi'

const { Option } = Select

interface Investment {
    id: string | number
    name: string
    type: string
    amount: number
    returnRate: number
}

interface InvestmentModalProps {
    record: Investment
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ record }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('edit')

    const [updateInvestment, { isLoading: isUpdating }] = useUpdateInvestmentMutation()
    const [deleteInvestment, { isLoading: isDeleting }] = useDeleteInvestmentMutation()
    const [messageApi, contextHolder] = message.useMessage()

    const handleSubmit = async (values: any) => {
        try {
            await updateInvestment({ id: record.id, ...values }).unwrap()
            messageApi.success('Updated successfully')
            setModalOpen(false)
        } catch {
            messageApi.error('Update failed')
        }
    }

    const handleDelete = async () => {
        try {
            await deleteInvestment(record.id).unwrap()
            messageApi.success('Deleted successfully')
            setModalOpen(false)
        } catch {
            messageApi.error('Delete failed')
        }
    }

    const tabItems = [
        {
            key: 'edit',
            label: 'Edit',
            children: (
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={record}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Stock">Stock</Option>
                            <Option value="Bond">Bond</Option>
                            <Option value="Real Estate">Real Estate</Option>
                            <Option value="Crypto">Crypto</Option>
                            <Option value="Other">Other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={100000} />
                    </Form.Item>
                    <Form.Item name="returnRate" label="Return Rate (%)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={-100} max={100} step={0.1} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={isUpdating}>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: 'delete',
            label: 'Delete',
            children: (
                <>
                    <p>Are you sure you want to delete this investment?</p>
                    <Button
                        danger
                        block
                        onClick={handleDelete}
                        loading={isDeleting}
                    >
                        Confirm Delete
                    </Button>
                </>
            ),
        },
    ]

    return (
        <>
            {contextHolder}
            <Button icon={<MoreOutlined />} onClick={() => setModalOpen(true)} />

            <Modal
                title={`Manage: ${record?.name ?? ''}`}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
            </Modal>
        </>
    )
}

export default InvestmentModal

