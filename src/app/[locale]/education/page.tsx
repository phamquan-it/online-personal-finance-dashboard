'use client'

import React from 'react'
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Divider,
  Space,
  theme,
  Skeleton,
  Image,
} from 'antd'
import {
  BookOutlined,
  BulbOutlined,
  CalculatorOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { useGetTipsQuery, useGetToolsQuery, useGetVideosQuery } from '@/libs/redux/services/educationApi'
import { useTranslations } from 'next-intl'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

const EducationPage = () => {
  const { token } = theme.useToken()
  const t = useTranslations("EducationPage")

  const { data: tips = [], isLoading: loadingTips } = useGetTipsQuery()
  const { data: videos = [], isLoading: loadingVideos } = useGetVideosQuery()
  const { data: tools = [], isLoading: loadingTools } = useGetToolsQuery()

  return (
    <Content style={{ padding: 24 }}>
      <Title level={2}>{t("title")}</Title>
      <Paragraph>
        {t("subtitle")}
      </Paragraph>

      <Divider orientation="left" orientationMargin="0">
        <BulbOutlined /> {t("tipsTitle")}
      </Divider>

      <Row gutter={[16, 16]}>
        {loadingTips
          ? Array.from({ length: 3 }).map((_, i) => (
              <Col xs={24} md={8} key={i}>
                <Skeleton active />
              </Col>
            ))
          : tips.map((tip, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  hoverable
                  title={<Text strong>{tip.title}</Text>}
                  style={{
                    borderRadius: token.borderRadiusLG,
                    backgroundColor: token.colorBgContainer,
                  }}
                >
                  <Paragraph>{tip.content}</Paragraph>
                </Card>
              </Col>
            ))}
      </Row>

      <Divider orientation="left" orientationMargin="0">
        <BookOutlined /> {t("videosTitle")}
      </Divider>

      <Row gutter={[16, 16]}>
        {loadingVideos
          ? Array.from({ length: 2 }).map((_, i) => (
              <Col xs={24} md={12} key={i}>
                <Skeleton.Image style={{ width: '100%', height: 180 }} active />
                <Skeleton active paragraph={{ rows: 2 }} />
              </Col>
            ))
          : videos.map((video, index) => (
              <Col xs={24} md={12} key={index}>
                <Card
                  hoverable
                  cover={
                    <Image
                      alt={video.title}
                      src={video.thumbnail}
                      style={{
                        borderRadius: '8px 8px 0 0',
                        objectFit: 'cover',
                        height: 180,
                      }}
                    />
                  }
                >
                  <Card.Meta
                    avatar={
                      <PlayCircleOutlined
                        style={{
                          fontSize: 20,
                          color: token.colorPrimary,
                        }}
                      />
                    }
                    title={video.title}
                    description={video.description}
                  />
                </Card>
              </Col>
            ))}
      </Row>

      <Divider orientation="left" orientationMargin="0">
        <CalculatorOutlined /> {t("toolsTitle")}
      </Divider>

      <Row gutter={[16, 16]}>
        {loadingTools
          ? Array.from({ length: 2 }).map((_, i) => (
              <Col xs={24} md={12} key={i}>
                <Skeleton active />
              </Col>
            ))
          : tools.map((tool, idx) => (
              <Col xs={24} md={12} key={idx}>
                <Card
                  hoverable
                  title={
                    <Text strong>
                      <CalculatorOutlined /> {tool.title}
                    </Text>
                  }
                  style={{
                    borderRadius: token.borderRadiusLG,
                    backgroundColor: token.colorBgContainer,
                  }}
                >
                  <Paragraph>
                    Công cụ tính toán nhanh chóng và dễ sử dụng giúp bạn đưa ra quyết định đúng đắn hơn.
                  </Paragraph>
                  <Button type="primary" block href={tool.link}>
                    {t("useToolButton")}
                  </Button>
                </Card>
              </Col>
            ))}
      </Row>
    </Content>
  )
}

export default EducationPage

