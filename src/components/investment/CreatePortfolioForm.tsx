import React from 'react';
import { Form, Input, Button, Card, message as antdMessage } from 'antd';
import { useCreateInvestmentPortfolioMutation } from '@/libs/redux/services/investmentApi';

interface CreatePortfolioFormProps {
  onSuccess?: () => void;
}

const CreatePortfolioForm: React.FC<CreatePortfolioFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [createPortfolio, { isLoading }] = useCreateInvestmentPortfolioMutation();
  const [messageApi, contextHolder] = antdMessage.useMessage();

  const onFinish = async (values: { name: string; description: string }) => {
    try {
      const result = await createPortfolio(values).unwrap();
      messageApi.success(`Created portfolio: ${result.name}`);
      form.resetFields();
      onSuccess?.(); // Close modal if passed
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to create portfolio');
    }
  };

  return (
    <div>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: '', description: '' }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input portfolio name' }]}
        >
          <Input placeholder="Enter portfolio name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input description' }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
          >
            {isLoading ? 'Creating...' : 'Create Portfolio'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePortfolioForm;

