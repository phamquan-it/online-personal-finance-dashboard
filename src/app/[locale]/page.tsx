'use client'

import React from 'react'
import { Layout, Typography, Divider, Row, Col, Card } from 'antd'
import {
    PieChartOutlined,
    BarChartOutlined,
    FundOutlined,
    BankOutlined,
} from '@ant-design/icons'

import { useGetFinancialOverviewQuery, useGetSpendingDistributionQuery, useGetSavingsGoalsQuery, useGetBudgetProgressQuery, useGetDebtSummaryQuery } from '@/libs/redux/services/financeApi'
import { useGetMonthlySummaryQuery } from '@/libs/redux/services/statisticsApi'
import { useGetCategoriesQuery } from '@/libs/redux/services/categoriesApi'
import { useTranslations } from 'next-intl'

// Components
import MonthlySummaryCards from '@/components/dashboard/MonthlySummaryCards'
import SpendingPieChart from '@/components/dashboard/SpendingPieChart'
import BudgetProgressList from '@/components/dashboard/BudgetProgressList'
import SavingsGoalsList from '@/components/dashboard/SavingsGoalsList'
import DebtOverviewCard from '@/components/dashboard/DebtOverviewCard'

const { Content } = Layout
const { Title, Text } = Typography

const DashboardHomePage = () => {
    const t = useTranslations('DashboardHomePage')

    // API
    const { data: categories = [], isFetching: fetchingCategories } = useGetCategoriesQuery()
    const { data: budgetProgress = [], isLoading: loadingBudget } = useGetBudgetProgressQuery()
    const { data: savingsGoals = [], isLoading: loadingGoals } = useGetSavingsGoalsQuery()
    const { data: debtInfo, isLoading: loadingDebt } = useGetDebtSummaryQuery()
    const { data: monthlySummary, isLoading: loadingMonthlySummary } = useGetMonthlySummaryQuery()

    // Process pie chart data
    const spendingData = categories.map((item) => ({
        category: item.name,
        value: item.expensePercentage,
    }))

    return (
        <Content style={{ padding: 24 }}>
            <Title level={2}>{t('title')}</Title>
            <Text type="secondary">{t('subtitle')}</Text>

            <Divider />

            <MonthlySummaryCards data={monthlySummary} loading={loadingMonthlySummary} />

            <Divider />

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card
                        title={t('cards.spendingDistribution')}
                        extra={<PieChartOutlined />}
                        className="h-full"
                    >
                        <SpendingPieChart data={spendingData} loading={fetchingCategories} />
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title={t('cards.budgetProgress')}
                        extra={<BarChartOutlined />}
                        className="h-full"
                    >
                        <BudgetProgressList data={budgetProgress} loading={loadingBudget} />
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card
                        title={t('cards.savingsGoals')}
                        extra={<FundOutlined />}
                    >
                        <SavingsGoalsList goals={savingsGoals} loading={loadingGoals} />
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title={t('cards.debtOverview')}
                        extra={<BankOutlined />}
                    >
                        <DebtOverviewCard data={debtInfo} loading={loadingDebt} />
                    </Card>
                </Col>
            </Row>
        </Content>
    )
}

export default DashboardHomePage

