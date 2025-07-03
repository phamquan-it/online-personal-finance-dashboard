'use client'

import React from 'react'
import { Space, Switch, Typography, Tag } from 'antd'
import {
    NotificationOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined,
    DollarOutlined,
    LineChartOutlined,
    SmileOutlined,
} from '@ant-design/icons'
import { NotificationType } from '@/constants/notificationTypes'

const { Text } = Typography

interface Props {
    typeFilters: Record<NotificationType, boolean>
    toggleSetting: (type: NotificationType, value: boolean) => void
}

export const getIconByType = (type: NotificationType) => {
    switch (type) {
        case 'budget_exceeded': return <ExclamationCircleOutlined style={{ color: '#cf1322' }} />
        case 'bill_due': return <CalendarOutlined style={{ color: '#fa8c16' }} />
        case 'upcoming_payment': return <DollarOutlined style={{ color: '#1890ff' }} />
        case 'investment_change': return <LineChartOutlined style={{ color: '#52c41a' }} />
        case 'savings_opportunity': return <SmileOutlined style={{ color: '#722ed1' }} />
        default: return <NotificationOutlined />
    }
}

export const getTagByType = (type: NotificationType) => {
    switch (type) {
        case 'budget_exceeded':
            return <Tag color="red">Budget Exceeded</Tag>
        case 'bill_due':
            return <Tag color="orange">Bill Due</Tag>
        case 'upcoming_payment':
            return <Tag color="blue">Upcoming Payment</Tag>
        case 'investment_change':
            return <Tag color="green">Investment Change</Tag>
        case 'savings_opportunity':
            return <Tag color="purple">Savings Opportunity</Tag>
        default:
            return <Tag>Notification</Tag>
    }
}

const NotificationSettings: React.FC<Props> = ({ typeFilters, toggleSetting }) => {
    return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {(Object.keys(typeFilters) as NotificationType[]).map((type) => (
                <Space key={type} align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Space>
                        {getIconByType(type)}
                        <Text>{getTagByType(type).props.children}</Text>
                    </Space>
                    <Switch
                        checked={typeFilters[type]}
                        onChange={(checked) => toggleSetting(type, checked)}
                    />
                </Space>
            ))}
        </Space>
    )
}

export default NotificationSettings

