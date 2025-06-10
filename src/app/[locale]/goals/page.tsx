'use client'

import React from 'react'
import {
  Layout,
  Typography,
  Card,
  Progress,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Row,
  Col,
  message,
  Skeleton,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAddGoalMutation, useGetGoalsQuery } from '@/libs/redux/services/goalsApi'
import { useTranslations, useLocale } from 'next-intl'

dayjs.extend(relativeTime)

const { Content } = Layout
const { Title, Text } = Typography

const GoalsPage = () => {
  const [form] = Form.useForm()
  const t = useTranslations('GoalsPage')
  const locale = useLocale() // Retrieves the current locale (e.g., "en", "vi", etc.)
  const [messageApi, contextHolder] = message.useMessage()
  const { data: goals = [], isLoading } = useGetGoalsQuery()
  const [addGoal, { isLoading: isAdding }] = useAddGoalMutation()

  const handleAddGoal = async (values: any) => {
    try {
      await addGoal({
        name: values.name,
        targetAmount: values.targetAmount,
        savedAmount: values.savedAmount || 0,
        deadline: values.deadline.toISOString(),
      }).unwrap()
      messageApi.success(t('addGoalSuccess'))
      form.resetFields()
    } catch (err) {
      messageApi.error(t('addGoalError'))
    }
  }

  return (
    <Content style={{ padding: 24 }}>
      {contextHolder}
      {/* Print title along with the current locale */}
      <Title level={2}>
        {t('title')} ({locale})
      </Title>
      <Text type="secondary">{t('subtitle')}</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Col xs={24} md={12} lg={8} key={idx}>
              <Card>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))
        ) : (
          goals.map((goal) => {
            const progress = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100)
            const deadline = dayjs(goal.deadline)
            const timeLeft = deadline.fromNow()

            return (
              <Col xs={24} md={12} lg={8} key={goal.id}>
                <Card title={goal.name} hoverable>
                  <Progress
                    percent={Math.round(progress)}
                    status={progress >= 100 ? 'success' : 'active'}
                  />
                  <Text>
                    Đã tiết kiệm: <strong>{goal.savedAmount.toLocaleString()} VND</strong> /{' '}
                    <strong>{goal.targetAmount.toLocaleString()} VND</strong>
                  </Text>
                  <br />
                  <Text type="secondary">
                    Thời hạn: {deadline.format('DD/MM/YYYY')} ({timeLeft})
                  </Text>
                </Card>
              </Col>
            )
          })
        )}
      </Row>

      <Card title={t('addGoalTitle')} style={{ marginTop: 32 }}>
        <Form layout="vertical" form={form} onFinish={handleAddGoal}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label={t('goalName')}
                name="name"
                rules={[{ required: true, message: 'Nhập tên mục tiêu' }]}
              >
                <Input placeholder={t('placeholderName')} />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                label={t('goalTargetAmount')}
                name="targetAmount"
                rules={[{ required: true, message: 'Nhập số tiền' }]}
              >
                <InputNumber
                  min={100000}
                  step={100000}
                  style={{ width: '100%' }}
                  formatter={(val) => `${Number(val).toLocaleString()} VND`}
                  parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item label={t('goalSavedAmount')} name="savedAmount">
                <InputNumber
                  min={0}
                  step={100000}
                  style={{ width: '100%' }}
                  formatter={(val) => `${Number(val).toLocaleString()} VND`}
                  parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                label={t('goalDeadline')}
                name="deadline"
                rules={[{ required: true, message: 'Chọn thời hạn' }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item label=" ">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  block
                  loading={isAdding}
                >
                  {t('addButton')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Content>
  )
}

export default GoalsPage

