'use client';

import { Form, InputNumber, Button } from 'antd';
import React from 'react';

interface Props {
  onSubmit: (amount: number) => Promise<void>;
}

const AddPaymentForm: React.FC<Props> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values.amount);
    form.resetFields();
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Form.Item name="amount" label="Payment Amount" rules={[{ required: true }]}>
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          step={10000}
          addonAfter="VND"
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" block>
          Add Payment
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddPaymentForm;

