'use client';

import React from 'react';
import {
    Card,
    Progress,
    Typography,
    Dropdown,
    Button,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Space,
} from 'antd';
import {
    EditOutlined,
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    CloseOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dispatch, SetStateAction } from 'react';
import type { MessageInstance } from 'antd/es/message/interface';

const { Text } = Typography;

interface GoalCardProps {
    goal: Goal;
    isActiveEdit: boolean;
    isActiveSaving: boolean;
    setActiveForm: Dispatch<SetStateAction<{ type: 'edit' | 'addSaving' | null; goalId: number | null }>>;
    onCancel: () => void;
    onUpdateGoal: (goal: Goal) => void;
    onDeleteGoal: (goalId: number) => void;
    onAddSaving: (goalId: number, values: any) => Promise<void>;
    messageApi: MessageInstance;
}

const GoalCard = ({
    goal,
    isActiveEdit,
    isActiveSaving,
    setActiveForm,
    onCancel,
    onUpdateGoal,
    onDeleteGoal,
    onAddSaving,
    messageApi,
}: GoalCardProps) => {
    const [editForm] = Form.useForm();
    const [contributionForm] = Form.useForm();

    const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
    const deadline = dayjs(goal.targetDate);
    const timeLeft = deadline.fromNow();

    const handleEdit = () => {
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
        onUpdateGoal({
            ...goal,
            ...values,
            targetDate: dayjs(values.targetDate.toISOString()).format('YYYY-MM-DD'),
        });
        onCancel();
    };

    const handleSubmitSaving = async () => {
        const values = await contributionForm.validateFields();
        await onAddSaving(goal.id, values);
        contributionForm.resetFields();
        onCancel();
    };

    const menuItems = [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: handleEdit,
        },
        {
            key: 'addSaving',
            icon: <PlusOutlined />,
            label: 'Add Saving',
            onClick: () => setActiveForm({ type: 'addSaving', goalId: goal.id }),
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            onClick: () => onDeleteGoal(goal.id),
        },
    ];

    return (
        <Card
            title={goal.title}
            hoverable
            extra={
                <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
                    <Button icon={<EllipsisOutlined />} />
                </Dropdown>
            }
        >
            {isActiveEdit ? (
                <Form layout="vertical" form={editForm}>
                    <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Target Amount" name="targetAmount" rules={[{ required: true }]}>
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            formatter={(val) => `${val} VND`}
                            parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                        />
                    </Form.Item>
                    <Form.Item label="Target Date" name="targetDate" rules={[{ required: true }]}>
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                    <Space>
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveEdit}>
                            Save
                        </Button>
                        <Button icon={<CloseOutlined />} onClick={onCancel}>
                            Cancel
                        </Button>
                    </Space>
                </Form>
            ) : isActiveSaving ? (
                <Form layout="vertical" form={contributionForm} onFinish={handleSubmitSaving}>
                    <Form.Item label="Saving Amount" name="savingAmount" rules={[{ required: true }]}>
                        <InputNumber
                            min={100000}
                            step={100000}
                            style={{ width: '100%' }}
                            formatter={(val) => `${val} VND`}
                            parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                        />
                    </Form.Item>
                    <Form.Item label="Note" name="note">
                        <Input placeholder="Optional note" />
                    </Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                            Save
                        </Button>
                        <Button icon={<CloseOutlined />} onClick={onCancel}>
                            Cancel
                        </Button>
                    </Space>
                </Form>
            ) : (
                <>
                    <Progress percent={Math.round(progress)} status={progress >= 100 ? 'success' : 'active'} />
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
    );
};

export default GoalCard;

