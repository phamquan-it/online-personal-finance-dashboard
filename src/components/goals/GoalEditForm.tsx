'use client'

import React from 'react'
import { Form, Input, InputNumber, DatePicker, Button, Space } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

interface Props {
    initialValues: any
    onSave: (values: any) => void
    onCancel: () => void
    loading?: boolean
}

const GoalEditForm: React.FC<Props> = ({
    initialValues,
    onSave,
    onCancel,
    loading,
}) => {
    const [form] = Form.useForm()

    return (
        <Form
            layout="vertical"
            form={form}
            initialValues={{
                ...initialValues,
                targetDate: dayjs(initialValues?.targetDate),
            }}
            onFinish={onSave}
        >
            <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Title required' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
                <Input />
            </Form.Item>
            <Form.Item
                name="targetAmount"
                label="Target Amount"
                rules={[{ required: true, message: 'Required' }]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    formatter={(val) => `${Number(val)} VND`}
                    parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                />
            </Form.Item>
            <Form.Item
                name="targetDate"
                label="Target Date"
                rules={[{ required: true, message: 'Required' }]}
            >
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Space>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                    Save
                </Button>
                <Button icon={<CloseOutlined />} onClick={onCancel}>
                    Cancel
                </Button>
            </Space>
        </Form>
    )
}

export default GoalEditForm

