'use client'

import React, { useState } from 'react'
import {
    Button,
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useCreateInvestmentMutation } from '@/libs/redux/services/investmentApi'

const { Option } = Select

interface Props {
    portfolioId?: number // 👈 Nhận portfolioId từ parent
}

const InvestmentForm: React.FC<Props> = ({ portfolioId }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()

    const [createInvestment, { isLoading }] = useCreateInvestmentMutation()

    const handleFinish = async (values: any) => {
        if (!portfolioId) {
            messageApi.error('Portfolio ID is required')
            return
        }

        try {
            await createInvestment({ ...values, portfolioId }).unwrap()
            messageApi.success('Investment added successfully')
            form.resetFields()
            setModalOpen(false)
        } catch (error: any) {
            messageApi.error(error?.data?.message || 'Failed to add investment')
        }
    }

    return (
        <>
            {contextHolder}
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalOpen(true)}
            >
                Add Investment
            </Button>

            <Modal
                title="Add New Investment"
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false)
                    form.resetFields()
                }}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="assetType" label="Type" rules={[{ required: true }]}>
                        <Select placeholder="Select investment type">
                            <Option value="stock">Stock</Option>
                            <Option value="bond">Bond</Option>
                            <Option value="real_estate">Real Estate</Option>
                            <Option value="crypto">Crypto</Option>
                            <Option value="mutual_fund">Mutual Fund</Option>
                            <Option value="etf">ETF</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="purchasePrice"
                        label="Purchase Price"
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={1000}
                            step={1000}
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(val: any) => val?.replace(/,/g, '') ?? ''}
                        />
                    </Form.Item>

                    <Form.Item
                        name="currentPrice"
                        label="Current Price"
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={1000}
                            step={1000}
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(val: any) => val?.replace(/,/g, '') ?? ''}
                        />
                    </Form.Item>

                    <Form.Item
                        name="purchaseDate"
                        label="Purchase Date"
                        rules={[{ required: true }]}
                    >
                        <Input type="date" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isLoading}
                        >
                            Add Investment
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default InvestmentForm

