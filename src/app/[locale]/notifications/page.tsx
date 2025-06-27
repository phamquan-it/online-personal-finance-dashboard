"use client";

import React, { useMemo, useState } from "react";
import {
    Layout,
    Typography,
    Card,
    List,
    Badge,
    Avatar,
    Tag,
    Switch,
    Space,
    Button,
    theme,
    message,
    Col,
    Row,
    Segmented,
    Tooltip,
} from "antd";
import {
    NotificationOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined,
    DollarOutlined,
    LineChartOutlined,
    SmileOutlined,
    ReloadOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from "@/libs/redux/services/notificationsApi";
import { useTranslations } from "next-intl";

const { Content } = Layout;
const { Title, Text } = Typography;

type NotificationType =
    | "budget_exceeded"
    | "bill_due"
    | "upcoming_payment"
    | "investment_change"
    | "savings_opportunity";

const getIconByType = (type: NotificationType) => {
    switch (type) {
        case "budget_exceeded":
            return <ExclamationCircleOutlined style={{ color: "#cf1322" }} />;
        case "bill_due":
            return <CalendarOutlined style={{ color: "#fa8c16" }} />;
        case "upcoming_payment":
            return <DollarOutlined style={{ color: "#1890ff" }} />;
        case "investment_change":
            return <LineChartOutlined style={{ color: "#52c41a" }} />;
        case "savings_opportunity":
            return <SmileOutlined style={{ color: "#722ed1" }} />;
        default:
            return <NotificationOutlined />;
    }
};

const getTagByType = (type: NotificationType) => {
    switch (type) {
        case "budget_exceeded":
            return <Tag color="red">Vượt ngân sách</Tag>;
        case "bill_due":
            return <Tag color="orange">Hóa đơn đến hạn</Tag>;
        case "upcoming_payment":
            return <Tag color="blue">Thanh toán sắp tới</Tag>;
        case "investment_change":
            return <Tag color="green">Thay đổi đầu tư</Tag>;
        case "savings_opportunity":
            return <Tag color="purple">Cơ hội tiết kiệm</Tag>;
        default:
            return <Tag>Thông báo</Tag>;
    }
};

export default function NotificationsAlertsPage() {
    const t = useTranslations("NotificationsAlertsPage");
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();

    const [typeFilters, setTypeFilters] = useState<Record<NotificationType, boolean>>({
        budget_exceeded: true,
        bill_due: true,
        upcoming_payment: true,
        investment_change: true,
        savings_opportunity: true,
    });

    const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");

    const activeTypes = useMemo(
        () =>
            Object.entries(typeFilters)
                .filter(([, enabled]) => enabled)
                .map(([type]) => type as NotificationType),
        [typeFilters]
    );

    const {
        data: notifications = [],
        isLoading,
        isFetching,
        refetch,
    } = useGetNotificationsQuery({
        type: activeTypes,
        isRead: readFilter === "all" ? undefined : readFilter === "read",
    });

    const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

    const toggleSetting = (type: NotificationType, value: boolean) => {
        setTypeFilters((prev) => ({ ...prev, [type]: value }));
        messageApi.success(
            t("toggleSuccess", {
                action: value ? "Bật" : "Tắt",
                type: getTagByType(type).props.children || type,
            })
        );
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationAsRead(id).unwrap();
            messageApi.success(("markAsReadSuccess"));
        } catch {
            messageApi.error(("markAsReadFailed"));
        }
    };

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}
            <Title level={2} style={{ color: token.colorPrimary }}>
                {t("title")}
            </Title>

            <Row gutter={24}>
                <Col xs={24} md={16}>
                    <Card
                        title={
                            <Space>
                                <NotificationOutlined />
                                <Text strong>{t("notificationsTitle")}</Text>
                                <Tooltip title={("refresh")}>
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
                                    { label: ("filterAll"), value: "all" },
                                    { label: ("filterUnread"), value: "unread" },
                                    { label: ("filterRead"), value: "read" },
                                ]}
                                value={readFilter}
                                onChange={(val) => setReadFilter(val as any)}
                            />
                        }
                        style={{ borderRadius: token.borderRadiusLG }}
                    >
                        <List
                            loading={isLoading}
                            itemLayout="horizontal"
                            dataSource={notifications}
                            locale={{ emptyText: t("noNotificationsMessage") }}
                            renderItem={(item) => {
                                const read = item.isRead;
                                return (
                                    <List.Item
                                        style={{
                                            backgroundColor: read ? undefined : token.colorPrimaryBgHover,
                                            borderRadius: token.borderRadiusLG,
                                            marginBottom: 12,
                                            padding: 12,
                                            cursor: "pointer",
                                        }}
                                        actions={
                                            !read
                                                ? [
                                                    <Tooltip title={("markAsReadButton")} key="mark">
                                                        <Button
                                                            size="small"
                                                            icon={<CheckCircleOutlined />}
                                                            onClick={() => handleMarkAsRead(item.id)}
                                                        />
                                                    </Tooltip>,
                                                ]
                                                : []
                                        }
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Badge dot={!read} offset={[-2, 2]}>
                                                    <Avatar icon={getIconByType(item.type as NotificationType)} />
                                                </Badge>
                                            }
                                            title={
                                                <Space direction="vertical" style={{ lineHeight: 1.2 }}>
                                                    <Text strong>{getTagByType(item.type as NotificationType)}</Text>
                                                </Space>
                                            }
                                            description={
                                                <div>
                                                    <Text>{item.message}</Text>
                                                    <br />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {new Date(item.createdAt).toLocaleString()}
                                                    </Text>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                );
                            }}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title={<Text strong>{t("settingsTitle")}</Text>}>
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            {(Object.keys(typeFilters) as NotificationType[]).map((type) => (
                                <Space
                                    key={type}
                                    align="center"
                                    style={{ justifyContent: "space-between", width: "100%" }}
                                >
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
                    </Card>
                </Col>
            </Row>
        </Content>
    );
}

