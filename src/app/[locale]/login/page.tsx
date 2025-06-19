'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import {
    Layout,
    Form,
    Input,
    Button,
    Typography,
    Card,
    theme,
    Space,
    message,
} from 'antd';
import {
    LockOutlined,
    MailOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLoginMutation } from '@/libs/redux/services/authApi';

// ✅ import the RTK Query hook

const { Content } = Layout;
const { Text } = Typography;

const LoginPage = () => {
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    const [form] = Form.useForm();
    const router = useRouter();
    const t = useTranslations('LoginPage');
    const [messageApi, contextHolder] = message.useMessage()

    // ✅ use RTK Query mutation
    const [login, { isLoading }] = useLoginMutation();

    const onFinish = async (values: any) => {
        try {
            // ✅ Call RTK Query mutation — map email -> userName
            const result = await login({
                userName: values.email,
                password: values.password,
            }).unwrap();

            // ✅ Save token however you like
            localStorage.setItem('token', result.token);
            messageApi.success("Success!")
            setTimeout(() => {
                router.push('/');
            }, 500)
        } catch (err: any) {
            messageApi.error("Error!")
            console.error('Login error:', err);
            form.setFields([
                {
                    name: 'password',
                    errors: [t('errorLoginFailed')],
                },
            ]);
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
            {contextHolder}
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
                            { type: 'string', message: t("errorInvalidEmail") },
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
                        <Link href={`/${useLocale()}/forgot`}>{t("forgotPasswordLink")}</Link>
                    </div>
                    <Text type="secondary">
                        {t('registerAccount')} <Link href={`/${useLocale()}/register`}>{t("registerLink")}</Link>
                    </Text>
                </div>
            </Card>
        </Content>
    );
};

export default LoginPage;

