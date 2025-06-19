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
    Modal,
    Dropdown,
} from 'antd'
import dayjs from 'dayjs'
import { EllipsisOutlined } from '@ant-design/icons'
import {
    useAddDebtMutation,
    useGetDebtsQuery,
    useDeleteDebtMutation,
    useUpdateDebtMutation,
} from '@/libs/redux/services/debtApi'
import { useTranslations, useLocale } from 'next-intl'
import EditDebtForm from '@/components/debts/EditDebtForm'
import AddPaymentForm from '@/components/debts/AddPaymentForm'

// ✅ import external forms

const { Content } = Layout
const { Title, Text } = Typography

export default function DebtManagementPage() {
    const [form] = Form.useForm()
    const [activeKey, setActiveKey] = useState('overview')
    const [modalVisible, setModalVisible] = useState(false)
    const [modalTab, setModalTab] = useState('edit')
    const [currentDebt, setCurrentDebt] = useState<any>(null)
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

    const openModal = (record: any, tab: string) => {
        setCurrentDebt(record)
        setModalTab(tab)
        setModalVisible(true)
    }

    const handleUpdate = async () => {
        messageApi.success(t('updateDebtSuccess'))
        setModalVisible(false)
        refetch()
    }

    const handleAddPayment = async () => {
        // TODO: Implement your payment API logic here
        messageApi.success(t('paymentAdded'))
        setModalVisible(false)
        refetch()
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
            title: 'Action',
            render: (_: any, record: any) => {
                const menuItems = [
                    {
                        key: 'edit',
                        label: 'Edit',
                        onClick: () => openModal(record, 'edit'),
                    },
                    {
                        key: 'addPayment',
                        label: t('addPaymentNow'),
                        onClick: () => openModal(record, 'payment'),
                    },
                    {
                        key: 'delete',
                        label: 'Delete',
                        onClick: () => handleDelete(record.id),
                    },
                ]
                return (
                    <Dropdown
                        menu={{ items: menuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button size="small" icon={<EllipsisOutlined />} />
                    </Dropdown>
                )
            },
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
                                const projectedPayoff = monthsLeft > 0
                                    ? Math.ceil(remaining / debt.monthlyPayment)
                                    : 0
                                return (
                                    <Col xs={24} md={12} key={index}>
                                        <Card title={debt.name} className="!mb-2">
                                            <Text>{t('debtType')}: <strong>{debt.type}</strong></Text><br />
                                            <Text>{t('debtRemaining')}: {remaining.toLocaleString()} VND</Text><br />
                                            <Text>{t('debtDueDate')}: {dayjs(debt.dueDate).format('DD/MM/YYYY')}</Text><br />
                                            <Text>{t('debtProjectedPayoff')}: {projectedPayoff} tháng</Text>
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
                                    <Form.Item name="type" label={t('debtType')} rules={[{ required: true }]}>
                                        <Input placeholder={t('placeholderType')} />
                                    </Form.Item>
                                    <Form.Item name="name" label={t('debtName')} rules={[{ required: true }]}>
                                        <Input placeholder={t('placeholderName')} />
                                    </Form.Item>
                                    <Form.Item name="total" label={t('debtTotal')} rules={[{ required: true }]}>
                                        <InputNumber style={{ width: '100%' }} addonAfter="VND" />
                                    </Form.Item>
                                    <Form.Item name="paid" label={t('debtPaid')} initialValue={0}>
                                        <InputNumber style={{ width: '100%' }} addonAfter="VND" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="monthlyPayment" label={t('debtMonthlyPayment')} rules={[{ required: true }]}>
                                        <InputNumber style={{ width: '100%' }} addonAfter="VND" />
                                    </Form.Item>
                                    <Form.Item name="startDate" label={t('debtStartDate')}>
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item name="dueDate" label={t('debtDueDate')} rules={[{ required: true }]}>
                                        <DatePicker style={{ width: '100%' }} />
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
                open={modalVisible}
                style={{ top:5 }}
                title={`${t('debtModalTitle')} - ${currentDebt?.name || ''}`}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <Tabs
                    activeKey={modalTab}
                    onChange={setModalTab}
                    items={[
                        {
                            key: 'edit',
                            label: t('editDebt'),
                            children: (
                                <EditDebtForm
                                    onFinish={handleUpdate}
                                    isUpdating={isUpdating}
                                />
                            ),
                        },
                        {
                            key: 'payment',
                            label: t('addPaymentNow'),
                            children: (
                                <AddPaymentForm
                                    onFinish={handleAddPayment}
                                    currentDebt={currentDebt}
                                />
                            ),
                        },
                    ]}
                />
            </Modal>
        </Content>
    )
}

