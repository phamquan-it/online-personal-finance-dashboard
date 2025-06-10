'use client';

import React, { useState } from 'react';
import { Form, Input, Button, message, Layout, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

const { Title } = Typography;
const { Content } = Layout;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations('ForgotPassword');

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { email } = values;
      if (email) {
        // In a real scenario, send a request to your backend API for password reset
        message.success(t('resetLinkSuccess'));
      } else {
        message.error(`${t('resetLinkFail')}`);
      }
    } catch (error) {
      message.error(t('resetLinkFail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content
        style={{
          padding: '50px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: '40px',
            borderRadius: '8px',
            width: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
            {t('title')}
          </Title>
          <Form name="forgot-password" onFinish={handleSubmit}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t('validation.requiredEmail') },
                { type: 'email', message: t('validation.invalidEmail') },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder={t('emailPlaceholder')}
                style={{ marginBottom: '16px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {t('sendButton')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default ForgotPassword;

