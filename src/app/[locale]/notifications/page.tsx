"use client";

import React, { useState, useMemo } from "react";
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
} from "antd";
import {
  NotificationOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  LineChartOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useGetNotificationsQuery } from "@/libs/redux/services/notificationsApi";
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
  // Initialize the translation hook with your language namespace
  const t = useTranslations("NotificationsAlertsPage");
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const [settings, setSettings] = useState<Record<NotificationType, boolean>>({
    budget_exceeded: true,
    bill_due: true,
    upcoming_payment: true,
    investment_change: true,
    savings_opportunity: true,
  });

  const activeTypes = useMemo(
    () =>
      Object.entries(settings)
        .filter(([, enabled]) => enabled)
        .map(([type]) => type as NotificationType),
    [settings]
  );

  const { data: notifications = [], isLoading, isFetching } =
    useGetNotificationsQuery(activeTypes);

  const [localState, setLocalState] = useState<Record<string, boolean>>({});

  const markAsRead = (id: string) => {
    setLocalState((prev) => ({ ...prev, [id]: true }));
  };

  const clearRead = () => {
    setLocalState((prev) => {
      const next = { ...prev };
      for (const key in next) {
        if (next[key]) delete next[key];
      }
      return next;
    });
    messageApi.success(t("clearReadButton"));
  };

  const toggleSetting = (type: NotificationType, value: boolean) => {
    setSettings((prev) => ({ ...prev, [type]: value }));
    // Using placeholders can be configured further in your JSON if needed.
    messageApi.success(
      t("toggleSuccess", {
        action: value ? "Bật" : "Tắt",
        type: getTagByType(type).props.children || type,
      })
    );
  };

  return (
    <Content style={{ padding: 24 }}>
      {contextHolder}
      <Title level={2} style={{ color: token.colorPrimary }}>
        {t("title")}
      </Title>

      <Row gutter={24} align="top">
        <Col xs={24} md={16}>
          <Card
            title={
              <Space>
                <NotificationOutlined />
                <Text strong>{t("notificationsTitle")}</Text>
                <Button size="small" onClick={clearRead}>
                  {t("clearReadButton")}
                </Button>
              </Space>
            }
            style={{ borderRadius: token.borderRadiusLG }}
          >
            <List
              loading={isLoading || isFetching}
              itemLayout="horizontal"
              dataSource={notifications.filter((n) => !localState[n.id])}
              locale={{ emptyText: t("noNotificationsMessage") }}
              renderItem={(item) => {
                const read = item.read || localState[item.id];
                return (
                  <List.Item
                    style={{
                      backgroundColor: read
                        ? undefined
                        : token.colorPrimaryBgHover,
                      borderRadius: token.borderRadiusLG,
                      marginBottom: 12,
                      padding: 12,
                    }}
                    onClick={() => {
                      if (!read) markAsRead(item.id);
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot={!read} offset={[-2, 2]}>
                          <Avatar icon={getIconByType(item.type as NotificationType)} />
                        </Badge>
                      }
                      title={
                        <Space direction="vertical" style={{ lineHeight: 1.2 }}>
                          <Text strong>{item.title}</Text>
                          <Space size="small">
                            {getTagByType(item.type as NotificationType)}
                          </Space>
                        </Space>
                      }
                      description={
                        <div>
                          <Text>{item.description}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.time}
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
          <Card
            title={<Text strong>{t("settingsTitle")}</Text>}
            style={{ borderRadius: token.borderRadiusLG }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {(Object.keys(settings) as NotificationType[]).map((type) => (
                <Space
                  key={type}
                  align="center"
                  style={{
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Space>
                    {getIconByType(type)}
                    <Text>{getTagByType(type).props.children}</Text>
                  </Space>
                  <Switch
                    checked={settings[type]}
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

