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

const { Content } = Layout
const { Title, Text } = Typography

export default function DebtManagementPage() {
    const [form] = Form.useForm()
    const [activeKey, setActiveKey] = useState('overview')
    const [modalVisible, setModalVisible] = useState(false)
    const [modalTab, setModalTab] = useState<'edit' | 'payment'>('edit')
    const [currentDebt, setCurrentDebt] = useState<Debt | null>(null)
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
                debtName: values.debtName,
                debtType: values.debtType,
                totalAmount: values.totalAmount,
                remainingAmount: values.remainingAmount ?? values.totalAmount,
                interestRate: values.interestRate ?? 0,
                minimumPayment: values.minimumPayment ?? 0,
                paymentFrequency: values.paymentFrequency ?? 'monthly',
                dueDate: values.dueDate.format('YYYY-MM-DD'),
            }).unwrap()
            messageApi.success(t('addDebtSuccess'))
            form.resetFields()
            refetch()
            setActiveKey('overview')
        } catch (err) {
            console.error(err)
            messageApi.error(t('addDebtError'))
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteDebt(id).unwrap()
            messageApi.success(t('deleteDebtSuccess'))
            refetch()
        } catch (err) {
            console.error(err)
            messageApi.error(t('deleteDebtError'))
        }
    }

    const openModal = (debt: Debt, tab: 'edit' | 'payment') => {
        setCurrentDebt(debt)
        setModalTab(tab)
        setModalVisible(true)
    }

    const handleUpdate = async (updated: Partial<Debt>) => {
        if (!currentDebt) return
        try {
            await updateDebt({ ...currentDebt, ...updated }).unwrap()
            messageApi.success(t('updateDebtSuccess'))
            setModalVisible(false)
            refetch()
        } catch (err) {
            console.error(err)
            messageApi.error(t('updateDebtError'))
        }
    }

    const handleAddPayment = async (amount: number) => {
        if (!currentDebt) return
        try {
            await updateDebt({
                ...currentDebt,
                remainingAmount: currentDebt.remainingAmount - amount,
            }).unwrap()
            messageApi.success(t('paymentAdded'))
            setModalVisible(false)
            refetch()
        } catch (err) {
            console.error(err)
            messageApi.error(('paymentError'))
        }
    }

    const columns = [
        {
            title: t('debtType'),
            dataIndex: 'debtType',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: t('debtName'),
            dataIndex: 'debtName',
        },
        {
            title: t('debtTotal'),
            dataIndex: 'totalAmount',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: t('debtRemaining'),
            dataIndex: 'remainingAmount',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: t('debtDueDate'),
            dataIndex: 'dueDate',
            render: (val: string) => dayjs(val).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            render: (_: any, record: Debt) => {
                const menuItems = [
                    {
                        key: 'edit',
                        label: ('edit'),
                        onClick: () => openModal(record, 'edit'),
                    },
                    {
                        key: 'addPayment',
                        label: ('addPaymentNow'),
                        onClick: () => openModal(record, 'payment'),
                    },
                    {
                        key: 'delete',
                        label: ('delete'),
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
                            {debts.map((debt) => {
                                const paid = debt.totalAmount - debt.remainingAmount
                                const percent = Math.round((paid / debt.totalAmount) * 100)
                                return (
                                    <Col xs={24} md={12} key={debt.id}>
                                        <Card title={debt.debtName} className="!mb-2">
                                            <Text>{t('debtType')}: <strong>{debt.debtType}</strong></Text><br />
                                            <Text>{t('debtRemaining')}: {debt.remainingAmount.toLocaleString()} VND</Text><br />
                                            <Text>{t('debtDueDate')}: {dayjs(debt.dueDate).format('DD/MM/YYYY')}</Text><br />
                                            <Progress percent={percent} style={{ marginTop: 8 }} />
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                    ),
                },
                {
                    key: 'table',
                    label: t('tabs.schedule'),
                    children: (
                        <Table columns={columns} dataSource={debts} rowKey="id" pagination={false} />
                    ),
                },
                {
                    key: 'add',
                    label: t('tabs.add'),
                    children: (
                        <Form form={form} layout="vertical" onFinish={handleAdd}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="debtType" label={t('debtType')} rules={[{ required: true }]}>
                                        <Input placeholder={t('placeholderType')} />
                                    </Form.Item>
                                    <Form.Item name="debtName" label={t('debtName')} rules={[{ required: true }]}>
                                        <Input placeholder={t('placeholderName')} />
                                    </Form.Item>
                                    <Form.Item name="totalAmount" label={t('debtTotal')} rules={[{ required: true }]}>
                                        <InputNumber style={{ width: '100%' }} addonAfter="VND" />
                                    </Form.Item>
                                    <Form.Item name="remainingAmount" label={t('debtRemaining')}>
                                        <InputNumber style={{ width: '100%' }} addonAfter="VND" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="interestRate" label={('interestRate')}>
                                        <InputNumber style={{ width: '100%' }} addonAfter="%" />
                                    </Form.Item>
                                    <Form.Item name="minimumPayment" label={('minimumPayment')}>
                                        <InputNumber style={{ width: '100%' }} addonAfter="VND" />
                                    </Form.Item>
                                    <Form.Item name="paymentFrequency" label={('paymentFrequency')}>
                                        <Input placeholder="monthly" />
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
                title={`${t('debtModalTitle')} - ${currentDebt?.debtName || ''}`}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <Tabs
                    activeKey={modalTab}
                    items={[
                        {
                            key: 'edit',
                            label: t('editDebt'),
                            children: (
                                // your custom form here
                                <EditDebtForm />
                            ),
                        },
                        {
                            key: 'payment',
                            label: t('addPaymentNow'),
                            children: (
                                <AddPaymentForm/>
                            ),
                        },
                    ]}
                />
            </Modal>
        </Content>
    )
}

