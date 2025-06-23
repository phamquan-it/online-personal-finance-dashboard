'use client'

import React from 'react'
import {
    Layout,
    Typography,
    Row,
    Col,
    Card,
    Statistic,
    Progress,
    Divider,
    Skeleton,
} from 'antd'
import {
    DollarOutlined,
    FundOutlined,
    PieChartOutlined,
    BarChartOutlined,
    RiseOutlined,
    BankOutlined,
} from '@ant-design/icons'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
    useGetFinancialOverviewQuery,
    useGetSpendingDistributionQuery,
    useGetBudgetProgressQuery,
    useGetSavingsGoalsQuery,
    useGetDebtInfoQuery,
} from '@/libs/redux/services/financeApi'
import { useGetMonthlySummaryQuery } from '@/libs/redux/services/statisticsApi'
import { useTranslations } from 'next-intl'

const { Content } = Layout
const { Title, Text } = Typography

const COLORS = ['#1890ff', '#ff4d4f', '#ffc107', '#52c41a', '#722ed1']

const DashboardHomePage = () => {
    const t = useTranslations('DashboardHomePage')

    const {
        data: financialOverview,
        isLoading: loadingOverview,
    } = useGetFinancialOverviewQuery()

    const {
        data: spendingData = [],
        isLoading: loadingSpending,
    } = useGetSpendingDistributionQuery()

    const {
        data: budgetProgress = [],
        isLoading: loadingBudget,
    } = useGetBudgetProgressQuery()

    const {
        data: savingsGoals = [],
        isLoading: loadingGoals,
    } = useGetSavingsGoalsQuery()

    const {
        data: debtInfo,
        isLoading: loadingDebt,
    } = useGetDebtInfoQuery()

    // NEW: Monthly Summary
    const {
        data: monthlySummary,
        isLoading: loadingMonthlySummary,
    } = useGetMonthlySummaryQuery()

    return (
        <Content style={{ padding: 24 }}>
            <Title level={2}>{t('title')}</Title>
            <Text type="secondary">{t('subtitle')}</Text>

            <Divider />

            {/* Tổng quan tháng hiện tại */}
            <Row gutter={[16, 16]}>
                {loadingMonthlySummary ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <Col xs={24} md={6} key={i}>
                            <Card>
                                <Skeleton active paragraph={{ rows: 1 }} />
                            </Card>
                        </Col>
                    ))
                ) : (
                    <>
                        <Col xs={24} md={6}>
                            <Card>
                                <Statistic
                                    title={t('cards.totalIncome')}
                                    value={monthlySummary?.totalIncome}
                                    prefix={<DollarOutlined />}
                                    suffix={t('currency')}
                                    valueStyle={{ color: '#52c41a', fontSize: 20 }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={6}>
                            <Card>
                                <Statistic
                                    title={t('cards.totalExpense')}
                                    value={monthlySummary?.totalExpense}
                                    prefix={<DollarOutlined />}
                                    suffix={t('currency')}
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={6}>
                            <Card>
                                <Statistic
                                    title={('cards.balance')}
                                    value={monthlySummary?.balance}
                                    prefix={<BankOutlined />}
                                    suffix={t('currency')}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={6}>
                            <Card>
                                <Statistic
                                    title={('cards.incomeTax')}
                                    value={monthlySummary?.incomeTax}
                                    prefix={<DollarOutlined />}
                                    suffix={t('currency')}
                                    valueStyle={{ color: '#722ed1' }}
                                />
                            </Card>
                        </Col>
                    </>
                )}
            </Row>

            <Divider />

            {/* Biểu đồ phân bổ chi tiêu */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card
                        title={t('cards.spendingDistribution')}
                        extra={<PieChartOutlined />}
                    >
                        {loadingSpending ? (
                            <Skeleton active paragraph={{ rows: 6 }} />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={spendingData}
                                        dataKey="value"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        label={({ category, percent }) =>
                                            `${category}: ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {spendingData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) =>
                                            `${value.toLocaleString()} ${t('currency')}`
                                        }
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title={t('cards.budgetProgress')}
                        extra={<BarChartOutlined />}
                    >
                        {loadingBudget ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : (
                            budgetProgress.map((item, idx) => {
                                const percent = (item.value / item.budget) * 100
                                return (
                                    <div key={idx} style={{ marginBottom: 16 }}>
                                        <Text>{item.label}</Text>
                                        <Progress
                                            percent={Math.min(100, Math.round(percent))}
                                            status={percent > 100 ? 'exception' : 'active'}
                                            format={() =>
                                                `${item.value.toLocaleString()} / ${item.budget.toLocaleString()} ${t('currency')}`
                                            }
                                        />
                                    </div>
                                )
                            })
                        )}
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* Mục tiêu tài chính */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card
                        title={t('cards.savingsGoals')}
                        extra={<FundOutlined />}
                    >
                        {loadingGoals ? (
                            <Skeleton active paragraph={{ rows: 3 }} />
                        ) : (
                            savingsGoals.map((goal, idx) => {
                                const progress = (goal.current / goal.target) * 100
                                return (
                                    <div key={idx} style={{ marginBottom: 16 }}>
                                        <Text>{goal.name}</Text>
                                        <Progress
                                            percent={Math.round(progress)}
                                            status={progress >= 100 ? 'success' : 'active'}
                                            format={() =>
                                                `${goal.current.toLocaleString()} / ${goal.target.toLocaleString()} ${t('currency')}`
                                            }
                                        />
                                    </div>
                                )
                            })
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title={t('cards.debtOverview')}
                        extra={<BankOutlined />}
                    >
                        {loadingDebt ? (
                            <Skeleton active paragraph={{ rows: 2 }} />
                        ) : (
                            <>
                                <Text>
                                    {t('debtInfo.remainingDebt')}:&nbsp;
                                    <strong>{debtInfo?.remainingDebt.toLocaleString()} {t('currency')}</strong>
                                </Text>
                                <Progress percent={debtInfo?.repaymentProgress} status="active" />
                                <div style={{ marginTop: 12 }}>
                                    <Text type="secondary">{debtInfo?.repaymentPlan}</Text>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </Content>
    )
}

export default DashboardHomePage

