'use client'

import React, { useState, useMemo } from 'react'
import {
    Layout,
    Typography,
    Row,
    Col,
    Card,
    Button,
    Table,
    message,
    Skeleton,
    Form,
} from 'antd'
import { PlusOutlined, MoreOutlined } from '@ant-design/icons'
import { useTranslations, useLocale } from 'next-intl'

import InvestmentPieChart from '@/components/investment/InvestmentPieChart'
import InvestmentModal from '@/components/investment/InvestmentModal'
import CreatePortfolioModal from '@/components/investment/CreatePortfolioModal'

import { dummyInvestments } from '@/dummy/investments'

const { Content } = Layout
const { Title, Text } = Typography

const InvestmentsPage = () => {
    const [form] = Form.useForm()
    const [modalForm] = Form.useForm()
    const [localData, setLocalData] = useState(dummyInvestments)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentRecord, setCurrentRecord] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('edit')
    const [messageApi, contextHolder] = message.useMessage()

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
        ).map(([name, value]) => ({ name, value }))
    }, [allInvestments])

    const handleAdd = (values: any) => {
        const newItem = {
            id: Date.now().toString(),
            ...values,
        }
        setLocalData((prev) => [...prev, newItem])
        messageApi.success('Added successfully')
        form.resetFields()
    }

    const handleEditSubmit = (values: any) => {
        const updated = allInvestments.map(inv =>
            inv.id === currentRecord.id ? { ...inv, ...values } : inv
        )
        setLocalData(updated)
        messageApi.success('Updated')
        handleCloseModal()
    }

    const handleDelete = (id: string | number) => {
        const filtered = allInvestments.filter(inv => inv.id !== id)
        setLocalData(filtered)
        messageApi.success('Deleted')
        handleCloseModal()
    }

    const showModal = (record: any) => {
        setCurrentRecord(record)
        setActiveTab('edit')
        setIsModalVisible(true)
        modalForm.setFieldsValue(record)
    }

    const handleCloseModal = () => {
        setIsModalVisible(false)
        setCurrentRecord(null)
        modalForm.resetFields()
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: 'Return',
            dataIndex: 'returnRate',
            key: 'returnRate',
            render: (val: number) => `${val.toFixed(2)}%`,
        },
        {
            key: 'actions',
            render: (_: any, record: any) => (
                <Button icon={<MoreOutlined />} onClick={() => showModal(record)} />
            ),
        },
    ]

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}
            <Title level={2}>Investments ({locale})</Title>
            <Text type="secondary">Track and manage your investments</Text>

            <Row gutter={24} style={{ marginTop: 24 }}>
                <Col xs={24} md={12}>
                    <Card title="Total Portfolio" extra={<CreatePortfolioModal />}>
                        <Text>Total Value: <strong>{totalAmount.toLocaleString()} VND</strong></Text>
                        <div style={{ marginTop: 16 }}>
                            {assetAllocation.length === 0 ? (
                                <Skeleton active paragraph={{ rows: 5 }} />
                            ) : (
                                <InvestmentPieChart data={assetAllocation} />
                            )}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Add Investment">
                        {/* Form Here (you can also extract to <AddInvestmentForm /> if needed) */}
                    </Card>
                </Col>
            </Row>

            <Card title="Investment Details" style={{ marginTop: 32 }}>
                <Table
                    dataSource={allInvestments}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            <InvestmentModal
                open={isModalVisible}
                onCancel={handleCloseModal}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                record={currentRecord}
                form={modalForm}
                onEditSubmit={handleEditSubmit}
                onDelete={handleDelete}
                t={(key: string, opt?: any) => key.replace('modal', '')}
            />
        </Content>
    )
}

export default InvestmentsPage

