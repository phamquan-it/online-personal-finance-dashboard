import React from 'react';
import { Button, Dropdown, Card, Form, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const EditCategoryDropdown = ({ record, onUpdate, loading }: {
    record: Category;
    onUpdate: (id: number, values: { name: string; description: string }) => void;
    loading: boolean;
}) => {
    const [form] = Form.useForm();

    return (
        <Dropdown
            trigger={['click']}
            dropdownRender={() => (
                <Card title="Edit Category">
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            name: record.name,
                            description: record.description,
                        }}
                        onFinish={(values) => onUpdate(record.id ?? -1, values)}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Name is required.' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item label="Description" name="description">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        >
            <Button icon={<EditOutlined />} size="small" />
        </Dropdown>
    );
};

export default EditCategoryDropdown;

