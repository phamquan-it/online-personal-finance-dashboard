'use client'

import React, { useState } from 'react'
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
} from 'antd'
import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    PlusOutlined,
    SaveOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
    useAddGoalMutation,
    useGetGoalsQuery,
} from '@/libs/redux/services/goalsApi'
import { useTranslations, useLocale } from 'next-intl'

dayjs.extend(relativeTime)

const { Content } = Layout
const { Title, Text } = Typography

const GoalsPage = () => {
    const [form] = Form.useForm()
    const t = useTranslations('GoalsPage')
    const locale = useLocale()
    const [messageApi, contextHolder] = message.useMessage()
    const { data: goals = [], isLoading } = useGetGoalsQuery()
    const [addGoal, { isLoading: isAdding }] = useAddGoalMutation()

    const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
    const [editForm] = Form.useForm()

    const handleAddGoal = async (values: any) => {
        try {
            await addGoal({
                name: values.name,
                targetAmount: values.targetAmount,
                savedAmount: values.savedAmount || 0,
                deadline: values.deadline.toISOString(),
            }).unwrap()
            messageApi.success(t('addGoalSuccess'))
            form.resetFields()
        } catch (err) {
            messageApi.error(t('addGoalError'))
        }
    }

    const handleEdit = (goal: any) => {
        setEditingGoalId(goal.id)
        editForm.setFieldsValue({
            name: goal.name,
            targetAmount: goal.targetAmount,
            savedAmount: goal.savedAmount,
            deadline: dayjs(goal.deadline),
        })
    }

    const handleSaveEdit = async () => {
        const values = await editForm.validateFields()
        console.log('Save changes:', values)
        // TODO: Call update mutation here
        messageApi.success(t('saveSuccess'))
        setEditingGoalId(null)
    }

    const handleCancelEdit = () => {
        setEditingGoalId(null)
    }

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
                    goals.map((goal) => {
                        const progress = Math.min(
                            100,
                            (goal.savedAmount / goal.targetAmount) * 100
                        )
                        const deadline = dayjs(goal.deadline)
                        const timeLeft = deadline.fromNow()
                        const menuItems = [
                            {
                                key: 'edit',
                                icon: <EditOutlined />,
                                label: t('edit'),
                                onClick: () => handleEdit(goal),
                            },
                            {
                                key: 'delete',
                                icon: <DeleteOutlined />,
                                label: t('delete'),
                                onClick: () => {
                                    console.log('Delete', goal)
                                    messageApi.info(t('deleteClicked'))
                                },
                            },
                        ]
                        return (
                            <Col xs={24} md={12} lg={8} key={goal.id}>
                                <Card
                                    title={goal.name}
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
                                    {editingGoalId === goal.id ? (
                                        <Form layout="vertical" form={editForm}>
                                            <Form.Item
                                                label={t('goalName')}
                                                name="name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t('required'),
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                label={t('goalTargetAmount')}
                                                name="targetAmount"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t('required'),
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    formatter={(val) =>
                                                        `${Number(
                                                            val
                                                        ).toLocaleString()} VND`
                                                    }
                                                    parser={(val: any) =>
                                                        Number(
                                                            val?.replace(
                                                                /[^\d]/g,
                                                                ''
                                                            )
                                                        )
                                                    }
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={t('goalSavedAmount')}
                                                name="savedAmount"
                                            >
                                                <InputNumber
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    formatter={(val) =>
                                                        `${Number(
                                                            val
                                                        ).toLocaleString()} VND`
                                                    }
                                                    parser={(val: any) =>
                                                        Number(
                                                            val?.replace(
                                                                /[^\d]/g,
                                                                ''
                                                            )
                                                        )
                                                    }
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={t('goalDeadline')}
                                                name="deadline"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t('required'),
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    format="DD/MM/YYYY"
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    icon={<SaveOutlined />}
                                                    onClick={handleSaveEdit}
                                                >
                                                    {t('saveButton')}
                                                </Button>
                                                <Button
                                                    icon={<CloseOutlined />}
                                                    onClick={handleCancelEdit}
                                                >
                                                    {t('cancelButton')}
                                                </Button>
                                            </Space>
                                        </Form>
                                    ) : (
                                        <>
                                            <Progress
                                                percent={Math.round(progress)}
                                                status={
                                                    progress >= 100
                                                        ? 'success'
                                                        : 'active'
                                                }
                                            />
                                            <Text>
                                                {t('goalSavedAmount')}: <strong>
                                                    {goal.savedAmount.toLocaleString()} VND
                                                </strong>{' '}
                                                /{' '}
                                                <strong>
                                                    {goal.targetAmount.toLocaleString()} VND
                                                </strong>
                                            </Text>
                                            <br />
                                            <Text type="secondary">
                                                {t('goalDeadline')}: {deadline.format('DD/MM/YYYY')} ({timeLeft})
                                            </Text>
                                        </>
                                    )}
                                </Card>
                            </Col>
                        )
                    })
                )}
            </Row>

            <Card title={t('addGoalTitle')} style={{ marginTop: 32 }}>
                <Form layout="vertical" form={form} onFinish={handleAddGoal}>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label={t('goalName')}
                                name="name"
                                rules={[{ required: true, message: t('requiredName') }]}
                            >
                                <Input placeholder={t('placeholderName')} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={4}>
                            <Form.Item
                                label={t('goalTargetAmount')}
                                name="targetAmount"
                                rules={[{ required: true, message: t('requiredAmount') }]}
                            >
                                <InputNumber
                                    min={100000}
                                    step={100000}
                                    style={{ width: '100%' }}
                                    formatter={(val) =>
                                        `${Number(val).toLocaleString()} VND`
                                    }
                                    parser={(val: any) =>
                                        Number(val?.replace(/[^\d]/g, ''))
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={4}>
                            <Form.Item label={t('goalSavedAmount')} name="savedAmount">
                                <InputNumber
                                    min={0}
                                    step={100000}
                                    style={{ width: '100%' }}
                                    formatter={(val) =>
                                        `${Number(val).toLocaleString()} VND`
                                    }
                                    parser={(val: any) =>
                                        Number(val?.replace(/[^\d]/g, ''))
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={4}>
                            <Form.Item
                                label={t('goalDeadline')}
                                name="deadline"
                                rules={[{ required: true, message: t('requiredDeadline') }]}
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

                        <Col xs={24} md={4}>
                            <Form.Item label=" ">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<PlusOutlined />}
                                    block
                                    loading={isAdding}
                                >
                                    {t('addButton')}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Content>
    )
}

export default GoalsPage

