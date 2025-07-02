// components/education/VideoCardList.tsx
import React from 'react'
import { Card, Col, Row, Skeleton, Typography, Image } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'

const { Meta } = Card

interface Video {
  title: string
  description: string
  thumbnail: string
}

export default function VideoCardList({ videos, loading }: { videos: Video[]; loading: boolean }) {
  return (
    <Row gutter={[15, 16]}>
      {loading
        ? Array.from({ length: 1 }).map((_, i) => (
            <Col xs={23} md={12} key={i}>
              <Skeleton.Image style={{ width: '99%', height: 180 }} active />
              <Skeleton active paragraph={{ rows: 1 }} />
            </Col>
          ))
        : videos.map((video, index) => (
            <Col xs={23} md={12} key={index}>
              <Card
                hoverable
                cover={
                  <Image
                    alt={video.title}
                    src={video.thumbnail}
                    style={{
                      borderRadius: '7px 8px 0 0',
                      objectFit: 'cover',
                      height: 179,
                    }}
                  />
                }
              >
                <Meta
                  avatar={<PlayCircleOutlined style={{ fontSize: 19, color: '#1677ff' }} />}
                  title={video.title}
                  description={video.description}
                />
              </Card>
            </Col>
          ))}
    </Row>
  )
}

