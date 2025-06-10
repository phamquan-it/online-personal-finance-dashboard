'use client'

import React, { useMemo, useState } from 'react'
import {
  Layout,
  Typography,
  Card,
  Table,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  message,
  Skeleton,
} from 'antd'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { PlusOutlined } from '@ant-design/icons'
import { useGetInvestmentsQuery } from '@/libs/redux/services/investmentApi'
import { useTranslations, useLocale } from 'next-intl'

const { Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA46BE']

const InvestmentsPage = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { data = [], isLoading } = useGetInvestmentsQuery([])
  const [localData, setLocalData] = useState<any[]>([])
  const [form] = Form.useForm()

  // Get the current locale and translations
  const locale = useLocale()
  const t = useTranslations('InvestmentsPage')

  // Combine existing investments from API with locally added ones
  const allInvestments = [...data, ...localData]

  // Calculate total amount and asset allocation for Pie Chart display
  const totalAmount = useMemo(
    () => allInvestments.reduce((acc, inv) => acc + inv.amount, 0),
    [allInvestments]
  )

  const assetAllocation = useMemo(() => {
    return Object.entries(
      allInvestments.reduce((acc, inv) => {
        acc[inv.type] = (acc[inv.type] || 0) + inv.amount
        return acc
      }, {} as Record<string, number>)
    ).map(([type, value]) => ({ name: type, value }))
  }, [allInvestments])

  const handleAdd = (values: any) => {
    const newItem = {
      id: Date.now().toString(),
      ...values,
    }
    setLocalData((prev) => [...prev, newItem])
    form.resetFields()
    messageApi.success(t('addInvestmentSuccess'))
  }

  const columns = [
    {
      title: t('investmentName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('investmentType'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('investmentAmount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => `${val.toLocaleString()} VND`,
    },
    {
      title: t('investmentReturnRate'),
      dataIndex: 'returnRate',
      key: 'returnRate',
      render: (val: number) => `${val.toFixed(2)}%`,
    },
  ]

  return (
    <Content style={{ padding: 24 }}>
      {contextHolder}
      {/* Print page title with the current locale */}
      <Title level={2}>
        {t('title')} ({locale})
      </Title>
      <Text type="secondary">{t('subtitle')}</Text>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title={t('totalPortfolio')}>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <>
                <Text>
                  {t('totalValue')}: <strong>{totalAmount.toLocaleString()} VND</strong>
                </Text>
                <div style={{ width: '100%', height: 300, marginTop: 16 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={assetAllocation}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {assetAllocation.map((_, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={t('addInvestmentTitle')}>
            <Form form={form} layout="vertical" onFinish={handleAdd}>
              <Form.Item
                name="name"
                label={t('investmentName')}
                rules={[{ required: true, message: t('placeholderName') }]}
              >
                <Input placeholder={t('placeholderName')} />
              </Form.Item>

              <Form.Item
                name="type"
                label={t('investmentType')}
                rules={[{ required: true, message: t('placeholderType') }]}
              >
                <Select placeholder={t('placeholderType')}>
                  <Option value="Stock">{t('investmentStock')}</Option>
                  <Option value="Bond">{t('investmentBond')}</Option>
                  <Option value="Real Estate">{t('investmentRealEstate')}</Option>
                  <Option value="Crypto">{t('investmentCrypto')}</Option>
                  <Option value="Other">{t('investmentOther')}</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="amount"
                    label={t('investmentAmount')}
                    rules={[{ required: true, message: t('placeholderAmount') }]}
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
                <Col span={12}>
                  <Form.Item
                    name="returnRate"
                    label={t('investmentReturnRate')}
                    rules={[{ required: true, message: t('placeholderReturnRate') }]}
                  >
                    <InputNumber
                      min={-100}
                      max={100}
                      step={0.1}
                      style={{ width: '100%' }}
                      addonAfter="%"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                  {t('addButton')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card title={t('investmentDetails')} style={{ marginTop: 32 }}>
        <Table
          dataSource={allInvestments}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={isLoading}
        />
      </Card>
    </Content>
  )
}

export default InvestmentsPage

