'use client'

import React, { useMemo, useState } from 'react'
import {
    Layout,
    Typography,
    Row,
    Col,
    Card,
    Table,
    message,
    Skeleton,
} from 'antd'

import InvestmentPieChart from '@/components/investment/InvestmentPieChart'
import InvestmentModal from '@/components/investment/InvestmentModal'
import CreatePortfolioModal from '@/components/investment/CreatePortfolioModal'
import InvestmentForm from '@/components/investment/InvestmentForm'
import PortfolioTable from '@/components/investment/PortfolioTable'

import {
    useGetInvestmentPortfoliosQuery,
    useDeleteInvestmentPortfolioMutation,
    useUpdateInvestmentPortfolioMutation,
    useGetPortfolioPerformanceQuery,
} from '@/libs/redux/services/investmentApi'

const { Content } = Layout
const { Title, Text } = Typography

const InvestmentsPage = () => {
    const [messageApi, contextHolder] = message.useMessage()
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null)
    const [editingPortfolio, setEditingPortfolio] = useState<any | null>(null)

    const { data: portfolios = [], isLoading: loadingPortfolios } = useGetInvestmentPortfoliosQuery()
    const { data: investmentData, isLoading: isLoadingInvestments, isFetching } =
        useGetPortfolioPerformanceQuery(selectedPortfolioId!, {
            skip: selectedPortfolioId === null,
        })

    const investments = investmentData?.investments || []
    const performance = investmentData?.portfolioPerformance

    const [updatePortfolio, { isLoading: isUpdating }] = useUpdateInvestmentPortfolioMutation()
    const [deletePortfolio, { isLoading: isDeleting }] = useDeleteInvestmentPortfolioMutation()

    const handleDeletePortfolio = async (id: number) => {
        try {
            await deletePortfolio(id).unwrap()
            messageApi.success('Portfolio deleted successfully')
            if (selectedPortfolioId === id) setSelectedPortfolioId(null)
        } catch {
            messageApi.error('Failed to delete portfolio')
        }
    }

    const handleUpdatePortfolio = async (values: { id: number; name: string; description?: string }) => {
        try {
            await updatePortfolio(values).unwrap()
            messageApi.success('Portfolio updated successfully')
            setEditingPortfolio(null)
        } catch {
            messageApi.error('Failed to update portfolio')
        }
    }

    const portfolioAllocation = useMemo(() => {
        return portfolios.map((p) => ({
            name: p.name,
            value: p.totalInvested,
        }))
    }, [portfolios])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'assetType',
            key: 'assetType',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Purchase Price',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: 'Current Price',
            dataIndex: 'currentPrice',
            key: 'currentPrice',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: 'Value',
            key: 'value',
            render: (_: any, record: any) =>
                `${(record.currentPrice * record.quantity).toLocaleString()} VND`,
        },
        {
            title: 'Return',
            key: 'return',
            render: (_: any, record: any) => {
                const perf = (record.currentPrice - record.purchasePrice) * record.quantity
                const color = perf >= 0 ? 'green' : 'red'
                return <span style={{ color }}>{perf.toLocaleString()} VND</span>
            },
        },
        {
            key: 'actions',
            render: (_: any, record: any) => <InvestmentModal record={record} />,
        },
    ]

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}
            <Title level={2}>Investments</Title>
            <Text type="secondary">Track and manage your investments</Text>

            <Row gutter={24} style={{ marginTop: 24 }}>
                <Col xs={24} md={12}>
                    <Card title="Total Portfolio" extra={<CreatePortfolioModal />}>
                        {selectedPortfolioId && (
                            <Text strong style={{ display: 'block', marginBottom: 8 }}>
                                Viewing Portfolio:{' '}
                                {portfolios.find(p => p.id === selectedPortfolioId)?.name || 'Unknown'}
                            </Text>
                        )}
                        <Text>
                            Total Invested:{' '}
                            <strong>{performance?.totalInvested?.toLocaleString() || 0} VND</strong>
                            <br />
                            Current Value:{' '}
                            <strong>{performance?.currentValue?.toLocaleString() || 0} VND</strong>
                            <br />
                        </Text>
                        <div style={{ marginTop: 16 }}>
                            {portfolioAllocation.length === 0 || isFetching ? (
                                <Skeleton active paragraph={{ rows: 5 }} />
                            ) : (
                                <InvestmentPieChart data={portfolioAllocation} />
                            )}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <PortfolioTable
                        data={portfolios}
                        loading={loadingPortfolios}
                        onClickRow={(record) => setSelectedPortfolioId(record.id)}
                        onEdit={(record) => setEditingPortfolio(record)}
                        onDelete={(id) => handleDeletePortfolio(id)}
                    />
                </Col>
            </Row>

            <Card title="Add Investment" style={{ marginTop: 32 }}>
                <InvestmentForm portfolioId={selectedPortfolioId ?? undefined} />
            </Card>

            <Card title="Investment Details" style={{ marginTop: 32 }}>
                <Table
                    dataSource={investments}
                    columns={columns}
                    rowKey="id"
                    loading={isLoadingInvestments}
                    pagination={false}
                    scroll={{ x: true }}
                />
            </Card>
        </Content>
    )
}

export default InvestmentsPage

