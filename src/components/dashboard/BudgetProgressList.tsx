// components/dashboard/BudgetProgressList.tsx
import React from 'react'
import { Progress, Skeleton, Typography } from 'antd'

const { Text } = Typography

export default function BudgetProgressList({ data, loading }: { data: any[], loading: boolean }) {
    if (loading) return <Skeleton active paragraph={{ rows: 4 }} />

    return data.map((item, idx) => {
        const percent = (item.value / item.budget) * 100
        return (
            <div key={idx} style={{ marginBottom: 16 }}>
                <Text>{item.label}</Text>
                <Progress
                    percent={Math.min(100, Math.round(percent))}
                    status={percent > 100 ? 'exception' : 'active'}
                    format={() =>
                        `${item.value.toLocaleString()} / ${item.budget.toLocaleString()} VND`
                    }
                />
            </div>
        )
    })
}

