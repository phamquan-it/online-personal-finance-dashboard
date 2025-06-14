'use client';

import React from 'react';
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  Card,
  theme,
  Space,
} from 'antd';
import { UserAddOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const { Content } = Layout;
const { Text } = Typography;

const RegisterPage = () => {
  const {
    token: { colorPrimary, borderRadiusLG },
  } = theme.useToken();

  const [form] = Form.useForm();
  const t = useTranslations('RegisterPage');

  const onFinish = (values: any) => {
    console.log('Register Success:', values);
    // TODO: Call API to register the user
  };

  return (
    <Content
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb',
        padding: 24,
      }}
    >
      <Card
        title={
          <Space>
            <UserAddOutlined />
            <Text strong>{t('title')}</Text>
          </Space>
        }
        style={{ width: '100%', maxWidth: 420, borderRadius: borderRadiusLG }}
        styles={{
          header: { textAlign: 'center', fontSize: 20 },
          body: { padding: 24 },
        }}
        variant="outlined"
      >
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="fullname"
            label={t('fullnameLabel')}
            rules={[{ required: true, message: t('errorRequiredFullname') }]}
          >
            <Input placeholder={t('fullnamePlaceholder')} prefix={<UserAddOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('emailLabel')}
            rules={[
              { required: true, message: t('errorRequiredEmail') },
              { type: 'email', message: t('errorInvalidEmail') },
            ]}
          >
            <Input placeholder={t('emailPlaceholder')} prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('passwordLabel')}
            rules={[
              { required: true, message: t('errorRequiredPassword') },
              { min: 6, message: t('errorMinPasswordLength') },
            ]}
          >
            <Input.Password
              placeholder={t('passwordPlaceholder')}
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label={t('confirmPasswordLabel')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('errorRequiredConfirmPassword') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('errorPasswordMismatch')));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={t('confirmPasswordPlaceholder')}
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ marginTop: 12 }}>
              {t('registerButton')}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">
            {t('loginPrompt')}{' '}
            <Link href="/login">{t('loginLink')}</Link>
          </Text>
        </div>
      </Card>
    </Content>
  );
};

export default RegisterPage;

