'use client';

import React, { useState } from 'react';
import { Layout, Typography, Row, Col, Card, Skeleton, message } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useTranslations, useLocale } from 'next-intl';
import {
    useGetGoalsQuery,
    useAddGoalMutation,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
    useAddContributionMutation,
} from '@/libs/redux/services/goalsApi';

import GoalCard from '@/components/goals/GoalCard';
import AddGoalForm from '@/components/goals/AddGoalForm';

dayjs.extend(relativeTime);

const { Content } = Layout;
const { Title, Text } = Typography;

const GoalsPage = () => {
    const t = useTranslations('GoalsPage');
    const locale = useLocale();
    const [messageApi, contextHolder] = message.useMessage();

    const { data: goals = [], isLoading } = useGetGoalsQuery();
    const [addGoal, { isLoading: isAdding }] = useAddGoalMutation();
    const [updateGoal] = useUpdateGoalMutation();
    const [deleteGoal] = useDeleteGoalMutation();
    const [addContribution] = useAddContributionMutation();

    const [activeForm, setActiveForm] = useState<{
        type: 'edit' | 'addSaving' | null;
        goalId: number | null;
    }>({ type: null, goalId: null });

    const handleCancelActiveForm = () => {
        setActiveForm({ type: null, goalId: null });
    };

    const handleAddGoal = async (values: any) => {
        try {
            await addGoal({
                title: values.title,
                description: values.description || '',
                targetAmount: values.targetAmount,
                currentAmount: values.currentAmount || 0,
                targetDate: dayjs(values.targetDate.toISOString()).format('YYYY-MM-DD'),
                goalType: 'savings',
            }).unwrap();
            messageApi.success('Goal added successfully.');
        } catch {
            messageApi.error('Failed to add goal.');
        }
    };

    const handleUpdateGoal = async (goal: any) => {
        try {
            await updateGoal(goal).unwrap();
            messageApi.success('Goal updated successfully.');
        } catch {
            messageApi.error('Failed to update goal.');
        }
    };

    const handleDeleteGoal = async (goalId: number) => {
        try {
            await deleteGoal(goalId).unwrap();
            messageApi.success('Goal deleted successfully.');
        } catch {
            messageApi.error('Failed to delete goal.');
        }
    };

    const handleAddSaving = async (goalId: number, values: any) => {
        try {
            await addContribution({
                savingId: goalId,
                amount: values.savingAmount,
                contributionDate: dayjs().format('YYYY-MM-DD'),
                note: values.note || '',
            }).unwrap();
            messageApi.success('Contribution added successfully.');
        } catch {
            messageApi.error('Failed to add contribution.');
        }
    };

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}

            <Title level={2}>
                {t('title')} ({locale})
            </Title>
            <Text type="secondary">{t('subtitle')}</Text>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {isLoading
                    ? Array.from({ length: 3 }).map((_, idx) => (
                        <Col xs={24} md={12} lg={8} key={idx}>
                            <Card>
                                <Skeleton active paragraph={{ rows: 3 }} />
                            </Card>
                        </Col>
                    ))
                    : goals.map((goal: Goal) => (
                        <Col xs={24} md={12} lg={8} key={goal.id}>
                            <GoalCard
                                goal={goal}
                                isActiveEdit={activeForm.type === 'edit' && activeForm.goalId === goal.id}
                                isActiveSaving={activeForm.type === 'addSaving' && activeForm.goalId === goal.id}
                                setActiveForm={setActiveForm}
                                onCancel={handleCancelActiveForm}
                                onUpdateGoal={handleUpdateGoal}
                                onDeleteGoal={handleDeleteGoal}
                                onAddSaving={handleAddSaving}
                                messageApi={messageApi}
                            />
                        </Col>
                    ))}
            </Row>

            <Card title="Add New Goal" style={{ marginTop: 32 }}>
                <AddGoalForm onAddGoal={handleAddGoal} messageApi={messageApi} isLoading={isAdding} />
            </Card>
        </Content>
    );
};

export default GoalsPage;

