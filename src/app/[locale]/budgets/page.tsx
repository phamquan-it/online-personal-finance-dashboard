'use client'

import React from 'react'
import {
  Layout,
  Card,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Progress,
  message,
  Skeleton,
} from 'antd'
import { AlertOutlined, PlusOutlined } from '@ant-design/icons'
import { useCreateBudgetMutation, useGetBudgetsQuery } from '@/libs/redux/services/budgetApi'
import { useTranslations, useLocale } from 'next-intl'

const { Content } = Layout
const { Title, Text } = Typography
const { Option } = Select
interface BudgetType {
  id: string;
  category: string;
  amount: number;
  spent: number;
  frequency: 'monthly' | 'yearly' | 'weekly' | 'daily'; // specify possible values
}
const BudgetPage = () => {
  const [form] = Form.useForm()
  const t = useTranslations('BudgetPage')
  const locale = useLocale() // Get current language locale

  const { data: budgets = [], isLoading } = useGetBudgetsQuery({})
  const [createBudget] = useCreateBudgetMutation()
  const [messageApi, contextHolder] = message.useMessage()
  
  const handleAddBudget = async (values:string) => {
    try {
      await createBudget(values).unwrap()
      messageApi.success(t('addBudgetSuccess'))
      form.resetFields()
    } catch (err) {
      messageApi.error(t('addBudgetError'))
      console.error(err)
    }
  }

  return (
    <Content style={{ padding: 24 }}>
      {contextHolder}
      {/* Print page title with current locale */}
      <Title level={2}>
        {t('title')} ({locale})
      </Title>
      <Text type="secondary">{t('subtitle')}</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card hoverable>
                <Skeleton active />
              </Card>
            </Col>
          ))
        ) : (
          budgets.map((budget: BudgetType) => {
            const percent = Math.round((budget.spent / budget.amount) * 100)
            const overBudget = percent > 100

            return (
              <Col xs={24} md={12} lg={8} key={budget.id}>
                <Card
                  title={`${budget.category} (${
                    budget.frequency === 'monthly'
                      ? t('budgetMonthly')
                      : budget.frequency === 'weekly'
                      ? t('budgetWeekly')
                      : t('budgetYearly')
                  })`}
                  hoverable
                >
                  <Progress
                    percent={Math.min(percent, 100)}
                    status={overBudget ? 'exception' : 'active'}
                  />
                  <Text>
                    {t('budgetSpent')}: <strong>{budget.spent.toLocaleString()} VND</strong> /{' '}
                    <strong>{budget.amount.toLocaleString()} VND</strong>
                  </Text>
                  {overBudget && (
                    <div style={{ marginTop: 8 }}>
                      <Text type="danger">
                        <AlertOutlined /> {t('overBudgetWarning')}
                      </Text>
                    </div>
                  )}
                </Card>
              </Col>
            )
          })
        )}
      </Row>

      <Card title={t('addBudgetTitle')} style={{ marginTop: 32 }}>
        <Form layout="vertical" form={form} onFinish={handleAddBudget}>
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item
                label={t('budgetCategory')}
                name="category"
                rules={[{ required: true, message: t('placeholderCategory') }]}
              >
                <Input placeholder={t('placeholderCategory')} />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                label={t('budgetAmount')}
                name="amount"
                rules={[{ required: true, message: t('placeholderAmount') }]}
              >
                <InputNumber
                  min={100000}
                  step={100000}
                  style={{ width: '100%' }}
                  formatter={(val) => `${Number(val).toLocaleString()} VND`}
                  parser={(val: string | undefined) => Number(val?.replace(/[^\d]/g, ''))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item label={t('budgetSpent')} name="spent">
                <InputNumber
                  min={0}
                  step={100000}
                  style={{ width: '100%' }}
                  formatter={(val) => `${Number(val).toLocaleString()} VND`}
                  parser={(val: string | undefined) => Number(val?.replace(/[^\d]/g, ''))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                label={t('budgetFrequency')}
                name="frequency"
                rules={[{ required: true, message: t('placeholderFrequency') }]}
              >
                <Select placeholder={t('placeholderFrequency')}>
                  <Option value="weekly">{t('budgetWeekly')}</Option>
                  <Option value="monthly">{t('budgetMonthly')}</Option>
                  <Option value="yearly">{t('budgetYearly')}</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item label=" ">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  block
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

export default BudgetPage

