// components/dashboard/DebtOverviewCard.tsx
import React from 'react'
import { Skeleton, Typography, Progress } from 'antd'

const { Text } = Typography

export default function DebtOverviewCard({ data, loading }: { data: any, loading: boolean }) {
    if (loading) return <Skeleton active paragraph={{ rows: 2 }} />

    return (
        <>
            <Text>
                Nợ còn lại:&nbsp;
                <strong>{data?.remainingDebt.toLocaleString()} VND</strong>
            </Text>
            <Progress percent={data?.repaymentProgress} status="active" />
            <div style={{ marginTop: 12 }}>
                <Text type="secondary">{data?.repaymentPlan}</Text>
            </div>
        </>
    )
}

