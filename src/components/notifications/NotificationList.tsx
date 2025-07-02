'use client';

import React from 'react';
import {
    List,
    Avatar,
    Badge,
    Button,
    Tooltip,
    Typography,
    Space,
    theme,
} from 'antd';
import {
    NotificationOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';

type NotificationType =
    | 'budget_exceeded'
    | 'bill_due'
    | 'upcoming_payment'
    | 'investment_change'
    | 'savings_opportunity';

interface Notification {
    id: number;
    type: NotificationType;
    message: string;
    createdAt: string;
    isRead: boolean;
}

interface Props {
    notifications: Notification[];
    loading: boolean;
    onMarkAsRead: (id: number) => Promise<void>;
}

const NotificationList: React.FC<Props> = ({
    notifications,
    loading,
    onMarkAsRead,
}) => {
    const t = useTranslations('NotificationsAlertsPage');
    const { token } = theme.useToken();

    const getIconByType = (type: NotificationType) => {
        switch (type) {
            case 'budget_exceeded':
                return <span style={{ color: '#cf1322' }}>🚨</span>;
            case 'bill_due':
                return <span style={{ color: '#fa8c16' }}>📅</span>;
            case 'upcoming_payment':
                return <span style={{ color: '#1890ff' }}>💰</span>;
            case 'investment_change':
                return <span style={{ color: '#52c41a' }}>📈</span>;
            case 'savings_opportunity':
                return <span style={{ color: '#722ed1' }}>💡</span>;
            default:
                return <NotificationOutlined />;
        }
    };

    const getTypeLabel = (type: NotificationType) => {
        switch (type) {
            case 'budget_exceeded':
                return ('types.budget_exceeded');
            case 'bill_due':
                return ('types.bill_due');
            case 'upcoming_payment':
                return ('types.upcoming_payment');
            case 'investment_change':
                return ('types.investment_change');
            case 'savings_opportunity':
                return ('types.savings_opportunity');
            default:
                return ('types.unknown');
        }
    };

    return (
        <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={notifications}
            locale={{ emptyText: t('noNotificationsMessage') }}
            renderItem={(item) => {
                const read = item.isRead;
                return (
                    <List.Item
                        style={{
                            backgroundColor: read ? undefined : token.colorPrimaryBgHover,
                            borderRadius: token.borderRadiusLG,
                            marginBottom: 12,
                            padding: 12,
                        }}
                        actions={
                            !read
                                ? [
                                    <Tooltip title={t('markAsReadButton')} key="mark">
                                        <Button
                                            size="small"
                                            icon={<CheckCircleOutlined />}
                                            onClick={() => onMarkAsRead(item.id)}
                                        />
                                    </Tooltip>,
                                ]
                                : []
                        }
                    >
                        <List.Item.Meta
                            avatar={
                                <Badge dot={!read}>
                                    <Avatar icon={getIconByType(item.type)} />
                                </Badge>
                            }
                            title={
                                <Space direction="vertical" style={{ lineHeight: 1.2 }}>
                                    <Typography.Text strong>{getTypeLabel(item.type)}</Typography.Text>
                                </Space>
                            }
                            description={
                                <div>
                                    <Typography.Text>{item.message}</Typography.Text>
                                    <br />
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        {new Date(item.createdAt).toLocaleString()}
                                    </Typography.Text>
                                </div>
                            }
                        />
                    </List.Item>
                );
            }}
        />
    );
};

export default NotificationList;

