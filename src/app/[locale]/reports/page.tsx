'use client'

import React from 'react'
import {
  Layout,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Divider,
  Skeleton,
} from 'antd'
import {
  DollarOutlined,
  LineChartOutlined,
  PieChartOutlined,
  FundOutlined,
} from '@ant-design/icons'
import { Datum, Line } from '@ant-design/charts'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { theme } from 'antd'
import { useGetReportsQuery } from '@/libs/redux/services/reportsApi'
import { useTranslations } from 'next-intl'

const { Content } = Layout
const { Title, Text } = Typography
const { useToken } = theme

const COLORS = ['#69c0ff', '#ff85c0', '#ffc069', '#95de64', '#d3adf7']

const ReportsPage = () => {
  // Hook for styling tokens from Ant Design
  const { token } = useToken()
  // Retrieve reports data from the API
  const { data, isLoading, isError } = useGetReportsQuery()
  // Load translations for "ReportsPage". This assumes your translation file
  // is structured with the "ReportsPage" namespace.
  const t = useTranslations("ReportsPage")

  // Render skeleton components during loading
  const renderSkeletonCards = () => (
    <Row gutter={[16, 16]}>
      {[1, 2, 3].map(key => (
        <Col xs={24} md={8} key={key}>
          <Card>
            <Skeleton active paragraph={false} />
          </Card>
        </Col>
      ))}
    </Row>
  )

  const renderSkeletonCharts = () => (
    <Row gutter={[16, 16]}>
      {[1, 2].map(key => (
        <Col xs={24} md={12} key={key}>
          <Card>
            <Skeleton active />
          </Card>
        </Col>
      ))}
    </Row>
  )

  if (isLoading) {
    return (
      <Content style={{ padding: 24 }}>
        <Title level={2}>{t("title")}</Title>
        <Text type="secondary">{t("subtitle")}</Text>
        <Divider />
        {renderSkeletonCards()}
        <Divider />
        {renderSkeletonCharts()}
      </Content>
    )
  }

  if (isError || !data) {
    return (
      <Content style={{ padding: 24 }}>
        <Title level={2}>{t("title")}</Title>
        <Text type="danger">Error: Unable to load data. Please try again later.</Text>
      </Content>
    )
  }

  // Calculate financial values
  const totalIncome = data.incomeData.find(i => i.date === '2025-05')?.income || 0
  const totalExpense = data.expenseData.reduce((acc, cur) => acc + cur.value, 0)
  const savingRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
    : 0

  return (
    <Content style={{ padding: 24 }}>
      <Title level={2}>{t("title")}</Title>
      <Text type="secondary">
        {t("subtitle")}
      </Text>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card variant="borderless">
            <Statistic
              title={t("totalIncome")}
              value={totalIncome}
              prefix={<DollarOutlined />}
              suffix={t("currency")}
              valueStyle={{
                color: token.colorSuccess,
                fontSize: '20px',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant="borderless">
            <Statistic
              title={t("totalExpense")}
              value={totalExpense}
              prefix={<DollarOutlined />}
              suffix={t("currency")}
              valueStyle={{
                color: token.colorError,
                fontSize: '20px',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant="borderless">
            <Statistic
              title={t("savingRate")}
              value={savingRate}
              suffix="%"
              prefix={<FundOutlined />}
              valueStyle={{
                color: token.colorInfoText,
                fontSize: '20px',
              }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title={t("incomeChartTitle")}
            variant="borderless"
            extra={<LineChartOutlined />}
          >
            <Line
              data={data.incomeData}
              xField="date"
              yField="income"
              height={250}
              point={{ size: 5, shape: 'diamond' }}
              color={token.colorPrimary}
              tooltip={{
                formatter: (datum: Datum) => ({
                  name: t("tooltipIncome"),
                  value: `${datum.income.toLocaleString()} ${t("currency")}`,
                }),
              }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={t("spendingDistributionTitle")}
            variant="borderless"
            extra={<PieChartOutlined />}
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.expenseData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, percent }) =>
                    `${category}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.expenseData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} ${t("currency")}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Content>
  )
}

export default ReportsPage

