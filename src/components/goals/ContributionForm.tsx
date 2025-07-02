'use client'

import React from 'react'
import { Form, Input, InputNumber, Button, Space } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'

interface Props {
    onFinish: (values: any) => void
    onCancel: () => void
}

const ContributionForm: React.FC<Props> = ({ onFinish, onCancel }) => {
    const [form] = Form.useForm()

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={(values) => {
                onFinish(values)
                form.resetFields()
            }}
        >
            <Form.Item
                name="savingAmount"
                label="Saving Amount"
                rules={[{ required: true, message: 'Required' }]}
            >
                <InputNumber
                    min={100000}
                    step={100000}
                    style={{ width: '100%' }}
                    formatter={(val) => `${Number(val)} VND`}
                    parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                />
            </Form.Item>
            <Form.Item name="note" label="Note">
                <Input placeholder="Optional note" />
            </Form.Item>
            <Space>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Save
                </Button>
                <Button icon={<CloseOutlined />} onClick={onCancel}>
                    Cancel
                </Button>
            </Space>
        </Form>
    )
}

export default ContributionForm

