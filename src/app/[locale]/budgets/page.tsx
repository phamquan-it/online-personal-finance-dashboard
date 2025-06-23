'use client';

import React, { useState } from 'react';
import {
    Layout,
    Card,
    Typography,
    Row,
    Col,
    Form,
    Select,
    InputNumber,
    Button,
    Progress,
    message,
    Skeleton,
    Dropdown,
} from 'antd';
import {
    AlertOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useTranslations, useLocale } from 'next-intl';
import {
    useAddBudgetMutation,
    useDeleteBudgetMutation,
    useGetBudgetsQuery,
    useUpdateBudgetMutation,
} from '@/libs/redux/services/budgetApi';
import { useGetCategoriesQuery } from '@/libs/redux/services/categoriesApi';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const BudgetPage = () => {
    const [form] = Form.useForm();
    const t = useTranslations('BudgetPage');
    const locale = useLocale();

    const [activeForm, setActiveForm] = useState<{ type: 'edit' | null; budgetId: number | null }>({
        type: null,
        budgetId: null,
    });

    const { data: budgets = [], isLoading } = useGetBudgetsQuery();
    const { data: categories = [] } = useGetCategoriesQuery();
    const [addBudget] = useAddBudgetMutation();
    const [updateBudget] = useUpdateBudgetMutation();
    const [deleteBudget] = useDeleteBudgetMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const getValidStartDate = () => dayjs().startOf('month').format('YYYY-MM-DD');
    const getValidEndDate = () => dayjs().startOf('month').add(1, 'month').format('YYYY-MM-DD');

    const handleAddBudget = async (values: any) => {
        try {
            const payload = {
                categoryId: Number(values.categoryId),
                budgetType: values.budgetType,
                amount: values.amount,
                alertThreshold: values.alertThreshold,
                startDate: getValidStartDate(),
                endDate: getValidEndDate(),
            };

            await addBudget(payload).unwrap();
            messageApi.success(t('addBudgetSuccess'));
            form.resetFields();
        } catch (err) {
            console.error(err);
            messageApi.error(t('addBudgetError'));
        }
    };

    const handleUpdateBudget = async (budgetId: number, values: any) => {
        try {
            const payload = {
                id: budgetId,
                categoryId: Number(values.categoryId),
                budgetType: values.budgetType,
                amount: values.amount,
                alertThreshold: values.alertThreshold,
                startDate: getValidStartDate(),
                endDate: getValidEndDate(),
            };

            await updateBudget(payload).unwrap();
            messageApi.success(('updateBudgetSuccess'));
        } catch (err) {
            console.error(err);
            messageApi.error(('updateBudgetError'));
        } finally {
            setActiveForm({ type: null, budgetId: null });
        }
    };

    const handleDeleteBudget = async (budgetId: number) => {
        try {
            await deleteBudget(budgetId).unwrap();
            messageApi.success(t('deleteBudgetSuccess'));
        } catch (err) {
            console.error(err);
            messageApi.error(t('deleteBudgetError'));
        }
    };

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}

            <Title level={2}>{t('title')} ({locale})</Title>
            <Text type="secondary">{t('subtitle')}</Text>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {isLoading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <Col xs={24} md={12} lg={8} key={index}>
                            <Card hoverable>
                                <Skeleton active />
                            </Card>
                        </Col>
                    ))
                    : budgets.map((budget) => {
                        const percent = Math.round((budget.totalExpense / budget.amount) * 100);
                        const overBudget = percent > 100;
                        const categoryName = categories.find((c) => c.id === budget.categoryId)?.name || 'Unknown';

                        return (
                            <Col xs={24} md={12} lg={8} key={budget.id}>
                                <Card
                                    title={`${categoryName} (${budget.budgetType})`}
                                    hoverable
                                    extra={
                                        <Dropdown
                                            menu={{
                                                items: [
                                                    {
                                                        key: 'edit',
                                                        icon: <EditOutlined />,
                                                        label: t('editBudget'),
                                                        onClick: () =>
                                                            setActiveForm({
                                                                type: 'edit',
                                                                budgetId: budget.id,
                                                            }),
                                                    },
                                                    {
                                                        key: 'delete',
                                                        icon: <DeleteOutlined />,
                                                        label: t('deleteBudget'),
                                                        onClick: () => handleDeleteBudget(budget.id),
                                                    },
                                                ],
                                            }}
                                            placement="bottomRight"
                                            trigger={['click']}
                                        >
                                            <Button icon={<EllipsisOutlined />} />
                                        </Dropdown>
                                    }
                                >
                                    <Progress percent={Math.min(percent, 100)} status={overBudget ? 'exception' : 'active'} />
                                    <Text>
                                        {t('budgetSpent')}:{' '}
                                        <strong>{budget.totalExpense.toLocaleString()} VND</strong> /{' '}
                                        <strong>{budget.amount.toLocaleString()} VND</strong>
                                    </Text>
                                    {overBudget && (
                                        <div style={{ marginTop: 8 }}>
                                            <Text type="danger">
                                                <AlertOutlined /> {t('overBudgetWarning')}
                                            </Text>
                                        </div>
                                    )}

                                    {activeForm.type === 'edit' && activeForm.budgetId === budget.id && (
                                        <Form
                                            layout="vertical"
                                            initialValues={{
                                                categoryId: budget.categoryId,
                                                amount: budget.amount,
                                                budgetType: budget.budgetType,
                                                alertThreshold: budget.alertThreshold,
                                            }}
                                            onFinish={(values) => handleUpdateBudget(budget.id, values)}
                                            style={{ marginTop: 16 }}
                                        >
                                            <Form.Item label={t('budgetCategory')} name="categoryId" rules={[{ required: true }]}>
                                                <Select placeholder={t('placeholderCategory')}>
                                                    {categories.map((c) => (
                                                        <Option key={c.id} value={c.id}>
                                                            {c.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                            <Form.Item label={t('budgetAmount')} name="amount" rules={[{ required: true }]}>
                                                <InputNumber
                                                    min={100000}
                                                    step={100000}
                                                    style={{ width: '100%' }}
                                                    formatter={(val) => `${Number(val).toLocaleString()} VND`}
                                                    parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                                                />
                                            </Form.Item>

                                            <Form.Item label={t('budgetFrequency')} name="budgetType" rules={[{ required: true }]}>
                                                <Select>
                                                    <Option value="weekly">{t('budgetWeekly')}</Option>
                                                    <Option value="monthly">{t('budgetMonthly')}</Option>
                                                    <Option value="yearly">{t('budgetYearly')}</Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item label={('alertThreshold')} name="alertThreshold" rules={[{ required: true }]}>
                                                <InputNumber
                                                    min={1}
                                                    max={100}
                                                    step={1}
                                                    style={{ width: '100%' }}
                                                    addonAfter="%"
                                                />
                                            </Form.Item>

                                            <Row gutter={8}>
                                                <Col flex="auto">
                                                    <Button type="primary" htmlType="submit" block>
                                                        {t('saveButton')}
                                                    </Button>
                                                </Col>
                                                <Col flex="80px">
                                                    <Button
                                                        danger
                                                        block
                                                        onClick={() => setActiveForm({ type: null, budgetId: null })}
                                                    >
                                                        {t('cancelButton')}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    )}
                                </Card>
                            </Col>
                        );
                    })}
            </Row>

            <Card title={t('addBudgetTitle')} style={{ marginTop: 32 }}>
                <Form layout="vertical" form={form} onFinish={handleAddBudget}>
                    <Row gutter={16}>
                        <Col xs={24} md={6}>
                            <Form.Item label={t('budgetCategory')} name="categoryId" rules={[{ required: true }]}>
                                <Select placeholder={t('placeholderCategory')}>
                                    {categories.map((c) => (
                                        <Option key={c.id} value={c.id}>
                                            {c.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={4}>
                            <Form.Item label={t('budgetAmount')} name="amount" rules={[{ required: true }]}>
                                <InputNumber
                                    min={100000}
                                    step={100000}
                                    style={{ width: '100%' }}
                                    formatter={(val) => `${Number(val).toLocaleString()} VND`}
                                    parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={4}>
                            <Form.Item label={t('budgetFrequency')} name="budgetType" rules={[{ required: true }]}>
                                <Select placeholder={t('placeholderFrequency')}>
                                    <Option value="weekly">{t('budgetWeekly')}</Option>
                                    <Option value="monthly">{t('budgetMonthly')}</Option>
                                    <Option value="yearly">{t('budgetYearly')}</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={4}>
                            <Form.Item label={('Alert threshold')} name="alertThreshold" rules={[{ required: true }]}>
                                <InputNumber min={1} max={100} step={1} style={{ width: '100%' }} addonAfter="%" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={4}>
                            <Form.Item label=" ">
                                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                                    {t('addButton')}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Content>
    );
};

export default BudgetPage;

