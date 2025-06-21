'use client';

import React from 'react';
import { Form, Input, InputNumber, DatePicker, Button, message } from 'antd';
import {
    FormOutlined,
    RetweetOutlined,
    DollarOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { useCreateIncomeMutation } from '@/libs/redux/services/incomeApi';


const IncomeForm: React.FC = () => {
    const [form] = Form.useForm();
    const [createIncome, { isLoading }] = useCreateIncomeMutation();
    const [messageApi, contextHolder] = message.useMessage()

    const handleFinish = async (values: any) => {
        try {
            // Format date to ISO string if needed
            const payload = {
                ...values,
                receivedDate: values.receivedDate.format('YYYY-MM-DD'),
            };

            await createIncome(payload).unwrap();
            messageApi.success('Income created successfully!');
            form.resetFields();
        } catch (error: any) {
            console.error(error);
            messageApi.error('Failed to create income.');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            className="space-y-4"
            onFinish={handleFinish} // ✅ form submit handler
        >
            {/* Grid 2 cột responsive */}
            {contextHolder}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    label="Income Type"
                    name="incomeType"
                    rules={[{ required: true, message: 'Please enter income type' }]}
                >
                    <Input
                        placeholder="e.g. Salary"
                        prefix={<FormOutlined className="text-gray-400" />}
                    />
                </Form.Item>

                <Form.Item
                    label="Frequency"
                    name="frequency"
                    rules={[{ required: true, message: 'Please enter frequency' }]}
                >
                    <Input
                        placeholder="e.g. Monthly"
                        prefix={<RetweetOutlined className="text-gray-400" />}
                    />
                </Form.Item>

                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please enter amount' }]}
                >
                    <InputNumber
                        className="w-full"
                        placeholder="e.g. 7000"
                        addonBefore={<DollarOutlined className="text-gray-400" />}
                    />
                </Form.Item>

                <Form.Item
                    label="Received Date"
                    name="receivedDate"
                    rules={[{ required: true, message: 'Please select date' }]}
                >
                    <DatePicker
                        className="w-full"
                        placeholder="Select date"
                        suffixIcon={<CalendarOutlined />}
                    />
                </Form.Item>
            </div>

            {/* Description - full width */}
            <Form.Item label="Description" name="description">
                <Input.TextArea
                    placeholder="Optional notes..."
                    autoSize={{ minRows: 2, maxRows: 4 }}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading} // ✅ show loading while submitting
                >
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default IncomeForm;

