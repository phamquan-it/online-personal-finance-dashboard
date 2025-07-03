'use client'

import React from 'react'
import { Layout, Typography, Divider, Row, Col, Skeleton } from 'antd'
import { theme } from 'antd'
import { useGetIncomeHistoryQuery } from '@/libs/redux/services/reportsApi'
import { useTranslations } from 'next-intl'

import ReportsSummaryCards from '@/components/reports/ReportsSummaryCards'
import IncomeLineChart from '@/components/reports/IncomeLineChart'
import ExpensePieChart from '@/components/reports/ExpensePieChart'
import MonthlySummaryCards from '@/components/dashboard/MonthlySummaryCards'
import { useGetMonthlySummaryQuery } from '@/libs/redux/services/statisticsApi'
import { useGetCategoriesQuery } from '@/libs/redux/services/categoriesApi'
import SpendingPieChart from '@/components/dashboard/SpendingPieChart'

const { Content } = Layout
const { Title, Text } = Typography
const { useToken } = theme

export default function ReportsPage() {
    const { data: monthlySummary, isLoading: loadingMonthlySummary } = useGetMonthlySummaryQuery()
    const { data: categories = [], isFetching: fetchingCategories } = useGetCategoriesQuery()
    const t = useTranslations("ReportsPage")
    const data = useGetIncomeHistoryQuery()

    const spendingData = categories.map((item) => ({
        category: item.name,
        value: item.expensePercentage,
    }))
    console.log(data)

    return (
        <Content style={{ padding: 24 }}>
            <Title level={2}>{t("title")}</Title>
            <Text type="secondary">{t("subtitle")}</Text>

            <Divider />
            <MonthlySummaryCards data={monthlySummary} loading={loadingMonthlySummary} />
            <Divider />
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <IncomeLineChart data={data.data ?? []} />
                </Col>
                <Col xs={24} md={12}>
                    <SpendingPieChart data={spendingData} loading={fetchingCategories} />
                </Col>
            </Row>
        </Content>
    )
}

