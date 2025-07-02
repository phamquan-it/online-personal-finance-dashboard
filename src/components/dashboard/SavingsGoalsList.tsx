// components/dashboard/SavingsGoalsList.tsx
import React from 'react'
import { Progress, Skeleton, Typography } from 'antd'

const { Text } = Typography

export default function SavingsGoalsList({ goals, loading }: { goals: any[], loading: boolean }) {
    if (loading) return <Skeleton active paragraph={{ rows: 3 }} />

    return goals.map((goal, idx) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100
        return (
            <div key={idx} style={{ marginBottom: 16 }}>
                <Text>{goal.title}</Text>
                <Progress
                    percent={Math.round(progress)}
                    status={progress >= 100 ? 'success' : 'active'}
                    format={() => `VND`}
                />
            </div>
        )
    })
}

