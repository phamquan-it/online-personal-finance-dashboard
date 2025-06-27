'use client'

import React, { useMemo, useState } from 'react'
import {
    Layout,
    Typography,
    Card,
    Table,
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Row,
    Col,
    message,
    Skeleton,
    Modal,
    Tabs,
} from 'antd'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { PlusOutlined, MoreOutlined } from '@ant-design/icons'
import { useTranslations, useLocale } from 'next-intl'
import CreatePortfolioForm from '@/components/investment/CreatePortfolioForm'
import CreatePortfolioModal from '@/components/investment/CreatePortfolioModal'
import { useGetAssetAllocationQuery, useGetInvestmentPortfoliosQuery } from '@/libs/redux/services/investmentApi'

const { Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA46BE']

const InvestmentsPage = () => {
    const [messageApi, contextHolder] = message.useMessage()
    const [localData, setLocalData] = useState<any[]>([])
    const { data, error, isFetching } = useGetInvestmentPortfoliosQuery();
    const { data: investmentsPie, isLoading  } = useGetAssetAllocationQuery()
    const [form] = Form.useForm()
    const [modalForm] = Form.useForm()

    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentRecord, setCurrentRecord] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('edit')

    const locale = useLocale()
    const t = useTranslations('InvestmentsPage')

    const allInvestments = [...localData]

    const totalAmount = useMemo(
        () => allInvestments.reduce((acc, inv) => acc + inv.amount, 0),
        [allInvestments]
    )

    const assetAllocation = useMemo(() => {
        return Object.entries(
            allInvestments.reduce((acc, inv) => {
                acc[inv.type] = (acc[inv.type] || 0) + inv.amount
                return acc
            }, {} as Record<string, number>)
        ).map(([type, value]) => ({ name: type, value }))
    }, [allInvestments])

    const handleAdd = (values: any) => {
        const newItem = {
            id: Date.now().toString(),
            ...values,
        }
        setLocalData((prev) => [...prev, newItem])
        form.resetFields()
        messageApi.success(t('addInvestmentSuccess'))
    }

    const handleEditSubmit = (values: any) => {
        const updated = allInvestments.map(inv =>
            inv.id === currentRecord.id ? { ...inv, ...values } : inv
        )
        messageApi.success(('Success'))
        handleCloseModal()
    }

    const handleDelete = (id: string) => {
        const newLocal = localData.filter(item => item.id !== id)
        setLocalData(newLocal)
        messageApi.success(('Success'))
        handleCloseModal()
    }

    const showModal = (record: any) => {
        setCurrentRecord(record)
        setActiveTab('edit')
        setIsModalVisible(true)
        // Prefill modal form
        modalForm.setFieldsValue(record)
    }

    const handleCloseModal = () => {
        setIsModalVisible(false)
        setCurrentRecord(null)
        modalForm.resetFields()
    }

    const columns = [
        {
            title: t('investmentName'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('investmentType'),
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: t('investmentAmount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: t('investmentReturnRate'),
            dataIndex: 'returnRate',
            key: 'returnRate',
            render: (val: number) => `${val.toFixed(2)}%`,
        },
        {
            key: 'actions',
            render: (_: any, record: any) => (
                <Button
                    icon={<MoreOutlined />}
                    onClick={() => showModal(record)}
                />
            ),
        },
    ]
    const options = data?.map(item => ({
        label: item.name,
        value: item.id
    })) || [];
    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}
            <Title level={2}>
                {t('title')} ({locale})
            </Title>
            <Text type="secondary">{t('subtitle')}</Text>

            <Row gutter={24} style={{ marginTop: 24 }}>
                <Col xs={24} md={12}>
                    <Card title={t('totalPortfolio')} extra={(
                        <CreatePortfolioModal />
                    )}>
                        {false ? (
                            <Skeleton active paragraph={{ rows: 5 }} />
                        ) : (
                            <>
                                <Text>
                                    {t('totalValue')}: <strong>{totalAmount.toLocaleString()} VND</strong>
                                </Text>
                                <div style={{ width: '100%', height: 300, marginTop: 16 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={investmentsPie}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label={({ name, percent }) =>
                                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                                }
                                            >
                                                {assetAllocation.map((_, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title={t('addInvestmentTitle')}>
                        <Form form={form} layout="vertical" onFinish={handleAdd}>
                            <Form.Item
                                name="name"
                                label={t('investmentName')}
                                rules={[{ required: true, message: t('placeholderName') }]}
                            >
                                <Input placeholder={t('placeholderName')} />
                            </Form.Item>

                            <Form.Item
                                name="type"
                                label={t('investmentType')}
                                rules={[{ required: true, message: t('placeholderType') }]}
                            >
                                <Select placeholder={t('placeholderType')} options={options} loading={isFetching} />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="amount"
                                        label={t('investmentAmount')}
                                        rules={[{ required: true, message: t('placeholderAmount') }]}
                                    >
                                        <InputNumber
                                            min={1000}
                                            step={1000}
                                            style={{ width: '100%' }}
                                            formatter={(val) => `${Number(val).toLocaleString()} VND`}
                                            parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="returnRate"
                                        label={t('investmentReturnRate')}
                                        rules={[{ required: true, message: t('placeholderReturnRate') }]}
                                    >
                                        <InputNumber
                                            min={-100}
                                            max={100}
                                            step={0.1}
                                            style={{ width: '100%' }}
                                            addonAfter="%"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                                    {t('addButton')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Card title={t('investmentDetails')} style={{ marginTop: 32 }}>
                <Table
                    dataSource={allInvestments}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    loading={false}
                />
            </Card>
            <Modal
                title={`Manage: ${currentRecord?.name}`}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'edit',
                            label: t('modalEditTab'),
                            children: (
                                <Form
                                    form={modalForm}
                                    layout="vertical"
                                    onFinish={handleEditSubmit}
                                >
                                    <Form.Item
                                        name="name"
                                        label={t('investmentName')}
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="type"
                                        label={t('investmentType')}
                                        rules={[{ required: true }]}
                                    >
                                        <Select>
                                            <Option value="Stock">{t('investmentStock')}</Option>
                                            <Option value="Bond">{t('investmentBond')}</Option>
                                            <Option value="Real Estate">{t('investmentRealEstate')}</Option>
                                            <Option value="Crypto">{t('investmentCrypto')}</Option>
                                            <Option value="Other">{t('investmentOther')}</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name="amount"
                                        label={t('investmentAmount')}
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber style={{ width: '100%' }} min={100000} />
                                    </Form.Item>
                                    <Form.Item
                                        name="returnRate"
                                        label={t('investmentReturnRate')}
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber style={{ width: '100%' }} min={-100} max={100} step={0.1} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>
                                            {t('modalSaveChangesButton')}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: 'delete',
                            label: t('modalDeleteTab'),
                            children: (
                                <>
                                    <p>
                                        {t('modalConfirmDelete', { name: currentRecord?.name })}
                                    </p>
                                    <Button
                                        danger
                                        block
                                        onClick={() => handleDelete(currentRecord.id)}
                                    >
                                        {t('modalConfirmDeleteButton')}
                                    </Button>
                                </>
                            ),
                        },
                    ]} />
            </Modal>

        </Content>
    )
}

export default InvestmentsPage

