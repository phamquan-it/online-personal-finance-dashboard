// components/reports/ReportsSummaryCards.tsx
import React from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import { DollarOutlined, FundOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'

interface Props {
    totalIncome: number
    totalExpense: number
    savingRate: number
    token: any
}

export default function ReportsSummaryCards({ totalIncome, totalExpense, savingRate, token }: Props) {
    const t = useTranslations("ReportsPage")
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
                <Card variant="borderless">
                    <Statistic
                        title={t("totalIncome")}
                        value={totalIncome}
                        prefix={<DollarOutlined />}
                        suffix={t("currency")}
                        valueStyle={{ color: "green", fontSize: '20px' }}
                    />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card variant="borderless">
                    <Statistic
                        title={t("totalExpense")}
                        value={totalExpense}
                        prefix={<DollarOutlined />}
                        suffix={t("currency")}
                        valueStyle={{ color: "red", fontSize: '20px' }}
                    />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card variant="borderless">
                    <Statistic
                        title={t("savingRate")}
                        value={savingRate}
                        suffix="%"
                        prefix={<FundOutlined />}
                        valueStyle={{ color: "blue", fontSize: '20px' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}

