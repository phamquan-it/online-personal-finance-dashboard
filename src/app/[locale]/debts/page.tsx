'use client'

import React, { useState } from 'react'
import {
    Layout,
    Typography,
    Tabs,
    Table,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Button,
    Card,
    Row,
    Col,
    Tag,
    Progress,
    message,
    Spin,
    Popconfirm,
    Space,
    Modal,
} from 'antd'
import dayjs from 'dayjs'
import {
    useAddDebtMutation,
    useGetDebtsQuery,
    useDeleteDebtMutation,
    useUpdateDebtMutation,
} from '@/libs/redux/services/debtApi'
import { useTranslations, useLocale } from 'next-intl'

const { Content } = Layout
const { Title, Text } = Typography

export default function DebtManagementPage() {
    const [form] = Form.useForm()
    const [editForm] = Form.useForm() // separate form for modal edit
    const [activeKey, setActiveKey] = useState('overview')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const t = useTranslations('DebtManagementPage')
    const locale = useLocale()

    const { data: debts = [], isLoading, isFetching, refetch } = useGetDebtsQuery()
    const [addDebt, { isLoading: isAdding }] = useAddDebtMutation()
    const [deleteDebt] = useDeleteDebtMutation()
    const [updateDebt, { isLoading: isUpdating }] = useUpdateDebtMutation()
    const [messageApi, contextHolder] = message.useMessage()

    const handleAdd = async (values: any) => {
        try {
            await addDebt({
                ...values,
                dueDate: values.dueDate.format('YYYY-MM-DD'),
                startDate: values.startDate?.format('YYYY-MM-DD') || undefined,
            }).unwrap()
            messageApi.success(t('addDebtSuccess'))
            form.resetFields()
            refetch()
            setActiveKey('schedule')
        } catch (err) {
            messageApi.error(t('addDebtError'))
            console.error(err)
        }
    }

    const handleEdit = (record: any) => {
        editForm.setFieldsValue({
            ...record,
            dueDate: dayjs(record.dueDate),
            startDate: record.startDate ? dayjs(record.startDate) : undefined,
        })
        setIsEditModalOpen(true)
    }

    const handleEditSubmit = async () => {
        try {
            const values = await editForm.validateFields()
            await updateDebt({
                ...values,
                dueDate: values.dueDate.format('YYYY-MM-DD'),
                startDate: values.startDate?.format('YYYY-MM-DD') || undefined,
            }).unwrap()
            messageApi.success(t('updateDebtSuccess'))
            setIsEditModalOpen(false)
            refetch()
        } catch (err) {
            messageApi.error(t('updateDebtError'))
            console.error(err)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteDebt(id).unwrap()
            messageApi.success(t('deleteDebtSuccess'))
            refetch()
        } catch (err) {
            messageApi.error(t('deleteDebtError'))
            console.error(err)
        }
    }

    const columns = [
        {
            title: t('debtType'),
            dataIndex: 'type',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: t('debtName'),
            dataIndex: 'name',
        },
        {
            title: t('debtTotal'),
            dataIndex: 'total',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: t('debtPaid'),
            dataIndex: 'paid',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: t('debtRemaining'),
            render: (_: string, record: any) =>
                `${(record.total - record.paid).toLocaleString()} VND`,
        },
        {
            title: t('debtDueDate'),
            dataIndex: 'dueDate',
            render: (val: string) => dayjs(val).format('DD/MM/YYYY'),
        },
        {
            title: t('actions'),
            render: (_: any, record: any) => (
                <Space>
                    <Button size="small" onClick={() => handleEdit(record)}>
                        {t('editButton')}
                    </Button>
                    <Popconfirm
                        title={t('deleteConfirm')}
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button size="small" danger>
                            {t('deleteButton')}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    if (isLoading || isFetching) {
        return (
            <Content style={{ padding: 24 }}>
                <Spin size="large" />
            </Content>
        )
    }

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}
            <Title level={2}>
                {t('title')} ({locale})
            </Title>

            <Tabs activeKey={activeKey} onChange={setActiveKey} items={[
                {
                    key: 'overview',
                    label: t('tabs.overview'),
                    children: (
                        <Row gutter={16}>
                            {debts.map((debt, index) => {
                                const percent = Math.round((debt.paid / debt.total) * 100)
                                const remaining = debt.total - debt.paid
                                const monthsLeft = dayjs(debt.dueDate).diff(dayjs(), 'month')
                                const projectedPayoff =
                                    monthsLeft > 0
                                        ? Math.ceil(remaining / debt.monthlyPayment)
                                        : 0
                                return (
                                    <Col xs={24} md={12} key={index}>
                                        <Card title={debt.name} className="!mb-2">
                                            <Text>
                                                {t('debtType')}: <strong>{debt.type}</strong>
                                            </Text>
                                            <br />
                                            <Text>
                                                {t('debtRemaining')}: {remaining.toLocaleString()} VND
                                            </Text>
                                            <br />
                                            <Text>
                                                {t('debtDueDate')}:{' '}
                                                {dayjs(debt.dueDate).format('DD/MM/YYYY')}
                                            </Text>
                                            <br />
                                            <Text>
                                                {t('debtProjectedPayoff')}: {projectedPayoff} tháng
                                            </Text>
                                            <Progress percent={percent} style={{ marginTop: 8 }} />
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                    ),
                },
                {
                    key: 'schedule',
                    label: t('tabs.schedule'),
                    children: (
                        <Table columns={columns} dataSource={debts} rowKey="id" pagination={false} />
                    ),
                },
                {
                    key: 'plan',
                    label: t('tabs.plan'),
                    children: (
                        <Table
                            rowKey="id"
                            dataSource={debts.map((debt) => {
                                const remaining = debt.total - debt.paid
                                const projectedMonth = Math.ceil(remaining / debt.monthlyPayment)
                                return {
                                    ...debt,
                                    projectedMonth,
                                    finish: dayjs().add(projectedMonth, 'month').format('MM/YYYY'),
                                }
                            })}
                            columns={[
                                { title: t('debtName'), dataIndex: 'name' },
                                {
                                    title: t('debtRemaining'),
                                    render: (_, r) => (r.total - r.paid).toLocaleString() + ' VND',
                                },
                                {
                                    title: t('debtMonthlyPayment'),
                                    dataIndex: 'monthlyPayment',
                                    render: (v: number) => v.toLocaleString() + ' VND',
                                },
                                { title: t('repaymentPlan'), dataIndex: 'finish' },
                            ]}
                        />
                    ),
                },
                {
                    key: 'add',
                    label: t('tabs.add'),
                    children: (
                        <Form form={form} layout="vertical" onFinish={handleAdd}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="type"
                                        label={t('debtType')}
                                        rules={[{ required: true, message: t('placeholderType') }]}
                                    >
                                        <Input placeholder={t('placeholderType')} />
                                    </Form.Item>
                                    <Form.Item
                                        name="name"
                                        label={t('debtName')}
                                        rules={[{ required: true, message: t('placeholderName') }]}
                                    >
                                        <Input placeholder={t('placeholderName')} />
                                    </Form.Item>
                                    <Form.Item
                                        name="total"
                                        label={t('debtTotal')}
                                        rules={[{ required: true, message: t('placeholderTotal') }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            addonAfter="VND"
                                            placeholder={t('placeholderTotal')}
                                        />
                                    </Form.Item>
                                    <Form.Item name="paid" label={t('debtPaid')} initialValue={0}>
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            addonAfter="VND"
                                            placeholder={t('placeholderPaid')}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="monthlyPayment"
                                        label={t('debtMonthlyPayment')}
                                        rules={[
                                            { required: true, message: t('placeholderMonthlyPayment') },
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            addonAfter="VND"
                                            placeholder={t('placeholderMonthlyPayment')}
                                        />
                                    </Form.Item>
                                    <Form.Item name="startDate" label={t('debtStartDate')}>
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder={t('placeholderStartDate')}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="dueDate"
                                        label={t('debtDueDate')}
                                        rules={[
                                            { required: true, message: t('placeholderDueDate') },
                                        ]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder={t('placeholderDueDate')}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={isAdding}>
                                            {t('saveButton')}
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    ),
                },
            ]} />
            <Modal
                open={isEditModalOpen}
                title={t('editDebt')}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={handleEditSubmit}
                confirmLoading={isUpdating}
                okText={t('saveButton')}
                styles={{
                    body: {
                        maxHeight: '50vh',
                        overflowY: 'auto',
                    }
                }}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label={t('debtType')}
                        rules={[{ required: true, message: t('placeholderType') }]}
                    >
                        <Input placeholder={t('placeholderType')} />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label={t('debtName')}
                        rules={[{ required: true, message: t('placeholderName') }]}
                    >
                        <Input placeholder={t('placeholderName')} />
                    </Form.Item>
                    <Form.Item
                        name="total"
                        label={t('debtTotal')}
                        rules={[{ required: true, message: t('placeholderTotal') }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="VND"
                            placeholder={t('placeholderTotal')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="paid"
                        label={t('debtPaid')}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="VND"
                            placeholder={t('placeholderPaid')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="monthlyPayment"
                        label={t('debtMonthlyPayment')}
                        rules={[{ required: true, message: t('placeholderMonthlyPayment') }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="VND"
                            placeholder={t('placeholderMonthlyPayment')}
                        />
                    </Form.Item>
                    <Form.Item name="startDate" label={t('debtStartDate')}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder={t('placeholderStartDate')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="dueDate"
                        label={t('debtDueDate')}
                        rules={[{ required: true, message: t('placeholderDueDate') }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder={t('placeholderDueDate')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    )
}

