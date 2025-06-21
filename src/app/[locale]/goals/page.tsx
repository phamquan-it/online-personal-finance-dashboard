'use client';

import React, { useState } from 'react';
import {
    Layout,
    Typography,
    Card,
    Progress,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Button,
    Row,
    Col,
    message,
    Skeleton,
    Space,
    Dropdown,
} from 'antd';
import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    PlusOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    useGetGoalsQuery,
    useAddGoalMutation,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
    useAddContributionMutation,
} from '@/libs/redux/services/goalsApi';
import { useTranslations, useLocale } from 'next-intl';

dayjs.extend(relativeTime);

const { Content } = Layout;
const { Title, Text } = Typography;

const GoalsPage = () => {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const t = useTranslations('GoalsPage');
    const locale = useLocale();
    const [messageApi, contextHolder] = message.useMessage();

    const { data: goals = [], isLoading } = useGetGoalsQuery();
    const [addGoal, { isLoading: isAdding }] = useAddGoalMutation();
    const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();
    const [deleteGoal] = useDeleteGoalMutation();
    const [addContribution] = useAddContributionMutation();

    const [activeForm, setActiveForm] = useState<{
        type: 'edit' | 'addSaving' | null;
        goalId: number | null;
    }>({ type: null, goalId: null });

    // ✅ Add new goal
    const handleAddGoal = async (values: any) => {
        const goal = {
            title: values.title,
            description: values.description || '',
            targetAmount: values.targetAmount,
            currentAmount: values.currentAmount || 0,
            targetDate: dayjs(values.targetDate.toISOString()).format('YYYY-MM-DD'),
            goalType: 'savings',
        }
        console.log(goal)
        try {
            await addGoal(goal).unwrap();
            messageApi.success('Goal added successfully.');
            form.resetFields();
        } catch {
            messageApi.error('Failed to add goal.');
        }
    };

    // ✅ Edit goal
    const handleEdit = (goal: Goal) => {
        setActiveForm({ type: 'edit', goalId: goal.id });
        editForm.setFieldsValue({
            title: goal.title,
            description: goal.description,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            targetDate: dayjs(goal.targetDate),
        });
    };

    const handleSaveEdit = async () => {
        const values = await editForm.validateFields();
        const goalId = activeForm.goalId;
        if (goalId == null) return;

        try {
            await updateGoal({
                id: goalId,
                ...values,
                goalType: "savings",
                targetDate: dayjs(values.targetDate.toISOString()).format("YYYY-MM-DD"),
            }).unwrap();
            messageApi.success('Goal updated successfully.');
            setActiveForm({ type: null, goalId: null });
        } catch {
            messageApi.error('Failed to update goal.');
        }
    };

    // ✅ Delete goal
    const handleDelete = async (goalId: number) => {
        try {
            await deleteGoal(goalId).unwrap();
            messageApi.success('Goal deleted successfully.');
        } catch {
            messageApi.error('Failed to delete goal.');
        }
    };

    // ✅ Add saving (contribution)
    const handleAddSaving = async (goalId: number, values: any) => {
        try {
            await addContribution({
                savingId: goalId,
                amount: values.savingAmount,
                contributionDate: dayjs(new Date().toISOString()).format("YYYY-MM-DD"), // or add a field if you want custom date
                note: values.note || '',
            }).unwrap();
            messageApi.success('Contribution added successfully.');
            setActiveForm({ type: null, goalId: null });
        } catch {
            messageApi.error('Failed to add contribution.');
        }
    };

    const handleCancelActiveForm = () => {
        setActiveForm({ type: null, goalId: null });
    };

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}

            <Title level={2}>
                {t('title')} ({locale})
            </Title>
            <Text type="secondary">{t('subtitle')}</Text>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <Col xs={24} md={12} lg={8} key={idx}>
                            <Card>
                                <Skeleton active paragraph={{ rows: 3 }} />
                            </Card>
                        </Col>
                    ))
                ) : (
                    goals.map((goal: Goal) => {
                        const progress = Math.min(
                            100,
                            (goal.currentAmount / goal.targetAmount) * 100
                        );
                        const deadline = dayjs(goal.targetDate);
                        const timeLeft = deadline.fromNow();

                        const menuItems = [
                            {
                                key: 'edit',
                                icon: <EditOutlined />,
                                label: t('edit'),
                                onClick: () => handleEdit(goal),
                            },
                            {
                                key: 'addSaving',
                                icon: <PlusOutlined />,
                                label: 'Add Saving',
                                onClick: () =>
                                    setActiveForm({ type: 'addSaving', goalId: goal.id }),
                            },
                            {
                                key: 'delete',
                                icon: <DeleteOutlined />,
                                label: t('delete'),
                                onClick: () => handleDelete(goal.id),
                            },
                        ];

                        return (
                            <Col xs={24} md={12} lg={8} key={goal.id}>
                                <Card
                                    title={goal.title}
                                    hoverable
                                    extra={
                                        <Dropdown
                                            menu={{ items: menuItems }}
                                            placement="bottomRight"
                                            trigger={['click']}
                                        >
                                            <Button icon={<EllipsisOutlined />} />
                                        </Dropdown>
                                    }
                                >
                                    {activeForm.type === 'edit' && activeForm.goalId === goal.id ? (
                                        <Form layout="vertical" form={editForm}>
                                            <Form.Item
                                                label="Title"
                                                name="title"
                                                rules={[{ required: true, message: 'Title required' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item label="Description" name="description">
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                label="Target Amount"
                                                name="targetAmount"
                                                rules={[{ required: true, message: 'Required' }]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    formatter={(val) => `${Number(val)} VND`}
                                                    parser={(val: any) =>
                                                        Number(val?.replace(/[^\d]/g, ''))
                                                    }
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Target Date"
                                                name="targetDate"
                                                rules={[{ required: true, message: 'Required' }]}
                                            >
                                                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    icon={<SaveOutlined />}
                                                    onClick={handleSaveEdit}
                                                    loading={isUpdating}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    icon={<CloseOutlined />}
                                                    onClick={handleCancelActiveForm}
                                                >
                                                    Cancel
                                                </Button>
                                            </Space>
                                        </Form>
                                    ) : activeForm.type === 'addSaving' && activeForm.goalId === goal.id ? (
                                        <Form
                                            layout="vertical"
                                            onFinish={(values) => handleAddSaving(goal.id, values)}
                                        >
                                            <Form.Item
                                                label="Saving Amount"
                                                name="savingAmount"
                                                rules={[{ required: true, message: 'Required' }]}
                                            >
                                                <InputNumber
                                                    min={100000}
                                                    step={100000}
                                                    style={{ width: '100%' }}
                                                    formatter={(val) => `${Number(val)} VND`}
                                                    parser={(val: any) =>
                                                        Number(val?.replace(/[^\d]/g, ''))
                                                    }
                                                />
                                            </Form.Item>
                                            <Form.Item label="Note" name="note">
                                                <Input placeholder="Optional note" />
                                            </Form.Item>
                                            <Space>
                                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                                    Save
                                                </Button>
                                                <Button
                                                    icon={<CloseOutlined />}
                                                    onClick={handleCancelActiveForm}
                                                >
                                                    Cancel
                                                </Button>
                                            </Space>
                                        </Form>
                                    ) : (
                                        <>
                                            <Progress
                                                percent={Math.round(progress)}
                                                status={progress >= 100 ? 'success' : 'active'}
                                            />
                                            <Text>
                                                Saved: <strong>{goal.currentAmount} VND</strong> /{' '}
                                                <strong>{goal.targetAmount} VND</strong>
                                            </Text>
                                            <br />
                                            <Text type="secondary">
                                                Deadline: {deadline.format('DD/MM/YYYY')} ({timeLeft})
                                            </Text>
                                        </>
                                    )}
                                </Card>
                            </Col>
                        );
                    })
                )}
            </Row>

            <Card title="Add New Goal" style={{ marginTop: 32 }}>

                <Form layout="vertical" form={form} onFinish={handleAddGoal}>
                    <Row gutter={16}>
                        <Col xs={24} md={6}>
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[{ required: true, message: 'Required' }]}
                            >
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
                                    disabledDate={(current) =>
                                        current && current < dayjs().startOf('day')
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col
                            xs={24}
                            md={4}
                            style={{
                                alignItems: 'end',
                            }}
                        >
                            <Form.Item label=" ">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<PlusOutlined />}
                                    block
                                    loading={isAdding}
                                >
                                    Add
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Card>
        </Content>
    );
};

export default GoalsPage;

