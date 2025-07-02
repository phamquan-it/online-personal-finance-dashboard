// components/dashboard/SpendingPieChart.tsx
import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Skeleton } from 'antd'

const COLORS = ['#1890ff', '#ff4d4f', '#ffc107', '#52c41a', '#722ed1']

export default function SpendingPieChart({ data, loading }: { data: any[], loading: boolean }) {
    return loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
    ) : (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ category, percent }) =>
                        `${category}: ${(percent * 100).toFixed(0)}%`
                    }
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} VND`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

