'use client';

import React, { useState } from 'react';
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
import {
    LockOutlined,
    MailOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const { Content } = Layout;
const { Text } = Typography;

const LoginPage = () => {
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    const [form] = Form.useForm();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Load translations for LoginPage from JSON
    const t = useTranslations('LoginPage');

    const loginUser = async (credentials: { email: string; password: string }) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Login failed');
        }
        return res.json();
    };

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const { accessToken } = await loginUser(values);
            localStorage.setItem('token', accessToken);
            console.log('Login success:', accessToken);
            router.push('/');
        } catch (err: any) {
            console.error('Login error:', err.message);
            form.setFields([
                {
                    name: 'password',
                    errors: [t('errorLoginFailed')],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Content
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f0f2f5',
                padding: 24,
            }}
        >
            <Card
                title={
                    <Space>
                        <LoginOutlined />
                        <Text strong>{t("title")}</Text>
                    </Space>
                }
                style={{ width: '100%', maxWidth: 400, borderRadius: borderRadiusLG }}
                styles={{
                    header: { textAlign: 'center', fontSize: 20 },
                    body: { padding: 24 },
                }}
                variant="outlined"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <Form.Item
                        name="email"
                        label={t("emailLabel")}
                        rules={[
                            { required: true, message: t("errorRequiredEmail") },
                            { type: 'email', message: t("errorInvalidEmail") },
                        ]}
                    >
                        <Input placeholder={t("emailPlaceholder")} prefix={<MailOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={t("passwordLabel")}
                        rules={[{ required: true, message: t("errorRequiredPassword") }]}
                    >
                        <Input.Password placeholder={t("passwordPlaceholder")} prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isLoading}
                        >
                            {t("loginButton")}
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <div>
                        <Link href="/forgot-password">{t("forgotPasswordLink")}</Link>
                    </div>
                    <Text type="secondary">
                        {t('registerAccount')} <Link href="/en/register">{t("registerLink")}</Link>
                    </Text>
                </div>
            </Card>
        </Content>
    );
};

export default LoginPage;

