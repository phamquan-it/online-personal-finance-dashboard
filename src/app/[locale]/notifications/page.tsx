'use client'

import React, { useMemo, useState } from 'react'
import {
    Layout,
    Typography,
    Card,
    Space,
    Button,
    Tooltip,
    Row,
    Col,
    Segmented,
    message,
    theme,
} from 'antd'
import {
    NotificationOutlined,
    ReloadOutlined,
} from '@ant-design/icons'
import {
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
} from '@/libs/redux/services/notificationsApi'
import { useTranslations } from 'next-intl'

import NotificationList from '@/components/notifications/NotificationList'
import NotificationSettings, { getTagByType } from '@/components/notifications/NotificationSettings'
import { NotificationType } from '@/constants/notificationTypes'

const { Content } = Layout
const { Title, Text } = Typography

export default function NotificationsAlertsPage() {
    const t = useTranslations('NotificationsAlertsPage')
    const { token } = theme.useToken()
    const [messageApi, contextHolder] = message.useMessage()

    const [typeFilters, setTypeFilters] = useState<Record<NotificationType, boolean>>({
        budget_exceeded: true,
        bill_due: true,
        upcoming_payment: true,
        investment_change: true,
        savings_opportunity: true,
    })

    const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all')

    const activeTypes = useMemo(
        () => Object.entries(typeFilters).filter(([, enabled]) => enabled).map(([type]) => type as NotificationType),
        [typeFilters]
    )

    const {
        data: notifications = [],
        isLoading,
        isFetching,
        refetch,
    } = useGetNotificationsQuery({
        type: activeTypes,
        isRead: readFilter === 'all' ? undefined : readFilter === 'read',
    })

    const [markNotificationAsRead] = useMarkNotificationAsReadMutation()

    const toggleSetting = (type: NotificationType, value: boolean) => {
        setTypeFilters((prev) => ({ ...prev, [type]: value }))
        messageApi.success(
            `${value ? 'Bật' : 'Tắt'} thông báo loại ${getTagByType(type).props.children || type} thành công`
        )
    }

    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationAsRead(id).unwrap()
            messageApi.success(t('markAsReadSuccess'))
            refetch()
        } catch {
            messageApi.error(t('markAsReadFailed'))
        }
    }

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}
            <Title level={2} style={{ color: token.colorPrimary }}>
                {t('title')}
            </Title>

            <Row gutter={24}>
                <Col xs={24} md={16}>
                    <Card
                        title={
                            <Space>
                                <NotificationOutlined />
                                <Text strong>{t('notificationsTitle')}</Text>
                                <Tooltip title={t('refresh')}>
                                    <Button
                                        icon={<ReloadOutlined />}
                                        size="small"
                                        onClick={() => refetch()}
                                        loading={isFetching}
                                    />
                                </Tooltip>
                            </Space>
                        }
                        extra={
                            <Segmented
                                size="small"
                                options={[
                                    { label: t('filterAll'), value: 'all' },
                                    { label: t('filterUnread'), value: 'unread' },
                                    { label: t('filterRead'), value: 'read' },
                                ]}
                                value={readFilter}
                                onChange={(val) => setReadFilter(val as any)}
                            />
                        }
                        style={{ borderRadius: token.borderRadiusLG }}
                    >
                        <NotificationList
                            notifications={notifications}
                            loading={isLoading}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title={<Text strong>{t('settingsTitle')}</Text>}>
                        <NotificationSettings
                            typeFilters={typeFilters}
                            toggleSetting={toggleSetting}
                        />
                    </Card>
                </Col>
            </Row>
        </Content>
    )
}

