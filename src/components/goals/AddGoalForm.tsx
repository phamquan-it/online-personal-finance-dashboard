// AddGoalForm.tsx
import React from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { MessageInstance } from 'antd/es/message/interface';

type AddGoalFormProps = {
    onAddGoal: (values: {
        title: string;
        description?: string;
        targetAmount: number;
        currentAmount?: number;
        targetDate: Dayjs;
    }) => Promise<void>;
    messageApi: MessageInstance;
    isLoading: boolean;
};

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal, messageApi, isLoading }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        await onAddGoal(values);
        form.resetFields();
    };

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Row gutter={16}>
                <Col xs={24} md={6}>
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="Title" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                    <Form.Item label="Description" name="description">
                        <Input placeholder="Description" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                    <Form.Item
                        label="Target Amount"
                        name="targetAmount"
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
                </Col>

                <Col xs={24} md={4}>
                    <Form.Item
                        label="Target Date"
                        name="targetDate"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                    <Form.Item label=" ">
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            block
                            loading={isLoading}
                        >
                            Add
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default AddGoalForm;

