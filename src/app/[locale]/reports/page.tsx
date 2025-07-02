'use client'

import React from 'react'
import { Layout, Typography, Divider, Row, Col, Skeleton } from 'antd'
import { theme } from 'antd'
import { useGetReportsQuery } from '@/libs/redux/services/reportsApi'
import { useTranslations } from 'next-intl'

import ReportsSummaryCards from '@/components/reports/ReportsSummaryCards'
import IncomeLineChart from '@/components/reports/IncomeLineChart'
import ExpensePieChart from '@/components/reports/ExpensePieChart'

const { Content } = Layout
const { Title, Text } = Typography
const { useToken } = theme

export default function ReportsPage() {
    const { token } = useToken()
    const { data, isLoading, isError } = useGetReportsQuery()
    const t = useTranslations("ReportsPage")

    const renderSkeletonCards = () => (
        <Row gutter={[16, 16]}>
            {[1, 2, 3].map(key => (
                <Col xs={24} md={8} key={key}>
                    <Skeleton active paragraph={false} />
                </Col>
            ))}
        </Row>
    )

    const renderSkeletonCharts = () => (
        <Row gutter={[16, 16]}>
            {[1, 2].map(key => (
                <Col xs={24} md={12} key={key}>
                    <Skeleton active />
                </Col>
            ))}
        </Row>
    )

    if (isLoading) {
        return (
            <Content style={{ padding: 24 }}>
                <Title level={2}>{t("title")}</Title>
                <Text type="secondary">{t("subtitle")}</Text>
                <Divider />
                {renderSkeletonCards()}
                <Divider />
                {renderSkeletonCharts()}
            </Content>
        )
    }

    if (isError || !data) {
        return (
            <Content style={{ padding: 24 }}>
                <Title level={2}>{t("title")}</Title>
                <Text type="danger">Error: Unable to load data. Please try again later.</Text>
            </Content>
        )
    }

    const totalIncome = data.incomeData.find(i => i.date === '2025-05')?.income || 0
    const totalExpense = data.expenseData.reduce((acc, cur) => acc + cur.value, 0)
    const savingRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

    return (
        <Content style={{ padding: 24 }}>
            <Title level={2}>{t("title")}</Title>
            <Text type="secondary">{t("subtitle")}</Text>

            <Divider />
            <ReportsSummaryCards
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                savingRate={savingRate}
            />

            <Divider />
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <IncomeLineChart data={data.incomeData} token={token} />
                </Col>
                <Col xs={24} md={12}>
                    <ExpensePieChart data={data.expenseData} />
                </Col>
            </Row>
        </Content>
    )
}

