// components/education/TipCardList.tsx
import React from 'react'
import { Card, Col, Row, Skeleton, Typography } from 'antd'

const { Paragraph, Text } = Typography

interface Tip {
  title: string
  content: string
}

export default function TipCardList({ tips, loading }: { tips: Tip[]; loading: boolean }) {
  return (
    <Row gutter={[15, 16]}>
      {loading
        ? Array.from({ length: 2 }).map((_, i) => (
            <Col xs={23} md={8} key={i}>
              <Skeleton active />
            </Col>
          ))
        : tips.map((tip, index) => (
            <Col xs={23} md={8} key={index}>
              <Card hoverable title={<Text strong>{tip.title}</Text>}>
                <Paragraph>{tip.content}</Paragraph>
              </Card>
            </Col>
          ))}
    </Row>
  )
}

