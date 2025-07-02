import React from 'react';
import { Form, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddCategoryForm = ({ onAdd, loading }: {
    onAdd: (values: { name: string; description: string }) => void;
    loading: boolean;
}) => {
    const [form] = Form.useForm();
    return (
        <Form layout="inline" form={form} onFinish={(values) => {
            onAdd(values);
            form.resetFields();
        }}>
            <Form.Item
                name="name"
                rules={[{ required: true, message: 'Name is required.' }]}
            >
                <Input placeholder="Enter name" />
            </Form.Item>
            <Form.Item name="description">
                <Input placeholder="Enter description" />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    loading={loading}
                >
                    Add
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddCategoryForm;

