// components/education/ToolCardList.tsx
import React from 'react'
import { Card, Col, Row, Skeleton, Typography, Button } from 'antd'
import { CalculatorOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'

const { Paragraph, Text } = Typography

interface Tool {
    title: string
    link: string
}

export default function ToolCardList({
    tools,
    loading,
}: {
    tools: Tool[]
    loading: boolean
}) {
    const t = useTranslations("EducationPage")
    return (
        <Row gutter={[15, 16]}>
            {loading
                ? Array.from({ length: 1 }).map((_, i) => (
                    <Col xs={23} md={12} key={i}>
                        <Skeleton active />
                    </Col>
                ))
                : tools.map((tool, idx) => (
                    <Col xs={23} md={12} key={idx}>
                        <Card
                            hoverable
                            title={
                                <Text strong>
                                    <CalculatorOutlined /> {tool.title}
                                </Text>
                            }
                        >
                            <Paragraph>
                                Công cụ tính toán nhanh chóng và dễ sử dụng giúp bạn đưa ra quyết định đúng đắn hơn.
                            </Paragraph>
                            <Button type="primary" block href={tool.link}>
                                {t('useToolButton')}
                            </Button>
                        </Card>
                    </Col>
                ))}
        </Row>
    )
}

