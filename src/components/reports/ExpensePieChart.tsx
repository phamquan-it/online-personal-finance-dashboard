// components/reports/ExpensePieChart.tsx
import React from 'react'
import { Card } from 'antd'
import { PieChartOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTranslations } from 'next-intl'

interface Props {
    data: { value: number; category: string }[]
}

const COLORS = ['#69c0ff', '#ff85c0', '#ffc069', '#95de64', '#d3adf7']

export default function ExpensePieChart({ data }: Props) {
    const t = useTranslations("ReportsPage")
    return (
        <Card title={t("spendingDistributionTitle")} variant="borderless" extra={<PieChartOutlined />}>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ category, percent }) =>
                            `${category}: ${(percent * 100).toFixed(0)}%`
                        }
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} ${t("currency")}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    )
}

