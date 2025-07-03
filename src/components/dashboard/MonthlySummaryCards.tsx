import React from 'react'
import { Row, Col, Card, Skeleton, Statistic } from 'antd'
import { DollarOutlined, BankOutlined } from '@ant-design/icons'

function formatCompactVND(value: number): string {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(2).replace(/\.00$/, '') + 'K';
    return value.toString();
}

export default function MonthlySummaryCards({ data, loading }: { data: any, loading: boolean }) {
    if (loading) {
        return (
            <Row gutter={[16, 16]}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Col xs={24} md={6} key={i}>
                        <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
                    </Col>
                ))}
            </Row>
        )
    }

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
                <Card>
                    <Statistic
                        title="Total Income"
                        prefix={<DollarOutlined />}
                        value={data?.totalIncome ?? 0}
                        valueStyle={{ color: '#52c41a' }}
                        formatter={(val: any) => formatCompactVND(Number(val))}
                    />
                </Card>
            </Col>
            <Col xs={24} md={6}>
                <Card>
                    <Statistic
                        title="Total Expenses"
                        prefix={<DollarOutlined />}
                        value={data?.totalExpense ?? 0}
                        valueStyle={{ color: '#ff4d4f' }}
                        formatter={(val: any) => formatCompactVND(Number(val))}
                    />
                </Card>
            </Col>
            <Col xs={24} md={6}>
                <Card>
                    <Statistic
                        title="Balance"
                        prefix={<BankOutlined />}
                        value={data?.balance ?? 0}
                        valueStyle={{ color: '#1890ff' }}
                        formatter={(val: any) => formatCompactVND(Number(val))}
                    />
                </Card>
            </Col>
            <Col xs={24} md={6}>
                <Card>
                    <Statistic
                        title="Income Tax"
                        prefix={<DollarOutlined />}
                        value={data?.incomeTax ?? 0}
                        valueStyle={{ color: '#722ed1' }}
                        formatter={(val: any) => formatCompactVND(Number(val))}
                    />
                </Card>
            </Col>
        </Row>
    )
}

