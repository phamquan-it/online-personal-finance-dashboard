'use client'

import React from 'react'
import {
  Layout,
  Typography,
  Tabs,
  Table,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Tag,
  Progress,
  message,
  Spin,
} from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { Debt, useAddDebtMutation, useGetDebtsQuery } from '@/libs/redux/services/debtApi'
import { useTranslations, useLocale } from 'next-intl'

const { Content } = Layout
const { Title, Text } = Typography

export default function DebtManagementPage() {
  const [form] = Form.useForm()
  const t = useTranslations('DebtManagementPage')
  const locale = useLocale() // Get the active locale

  const { data: debts = [], isLoading, isFetching } = useGetDebtsQuery()
  const [addDebt, { isLoading: isAdding }] = useAddDebtMutation()
  const [messageApi, contextHolder] = message.useMessage()
  const handleAdd = async (values: any) => {
    try {
      await addDebt({
        ...values,
        dueDate: (values.dueDate as Dayjs).format('YYYY-MM-DD'),
        startDate: values.startDate?.format('YYYY-MM-DD') || undefined,
      }).unwrap()
      messageApi.success(t('addDebtSuccess'))
      form.resetFields()
    } catch (err) {
      messageApi.error(t('addDebtError'))
      console.error(err)
    }
  }

  const columns = [
    {
      title: t('debtType'),
      dataIndex: 'type',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: t('debtName'),
      dataIndex: 'name',
    },
    {
      title: t('debtTotal'),
      dataIndex: 'total',
      render: (val: number) => `${val.toLocaleString()} VND`,
    },
    {
      title: t('debtPaid'),
      dataIndex: 'paid',
      render: (val: number) => `${val.toLocaleString()} VND`,
    },
    {
      title: t('debtRemaining'),
      render: (_: string, record: Debt) =>
        `${(record.total - record.paid).toLocaleString()} VND`,
    },
    {
      title: t('debtDueDate'),
      dataIndex: 'dueDate',
      render: (val: string) => dayjs(val).format('DD/MM/YYYY'),
    },
  ]

  if (isLoading || isFetching) {
    return (
      <Content style={{ padding: 24 }}>
        <Spin size="large" />
      </Content>
    )
  }

  return (
    <Content style={{ padding: 24 }}>
        {contextHolder}
      {/* Print page title with the current locale */}
      <Title level={2}>
        {t('title')} ({locale})
      </Title>

      {/* Render Tabs with translated labels */}
      <Tabs
        defaultActiveKey="overview"
        items={[
          {
            key: 'overview',
            label: t('tabs.overview'),
            children: (
              <Row gutter={16}>
                {debts.map((debt, index) => {
                  const percent = Math.round((debt.paid / debt.total) * 100)
                  const remaining = debt.total - debt.paid
                  const monthsLeft = dayjs(debt.dueDate).diff(dayjs(), 'month')
                  const projectedPayoff =
                    monthsLeft > 0 ? Math.ceil(remaining / debt.monthlyPayment) : 0
                  return (
                    <Col xs={24} md={12} key={index}>
                      <Card title={debt.name} variant="outlined" className="!mb-2">
                        <Text>
                          {t('debtType')}: <strong>{debt.type}</strong>
                        </Text>
                        <br />
                        <Text>
                          {t('debtRemaining')}: {remaining.toLocaleString()} VND
                        </Text>
                        <br />
                        <Text>
                          {t('debtDueDate')}: {dayjs(debt.dueDate).format('DD/MM/YYYY')}
                        </Text>
                        <br />
                        <Text>
                          {t('debtProjectedPayoff')} : {projectedPayoff} tháng
                        </Text>
                        <Progress percent={percent} style={{ marginTop: 8 }} />
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            ),
          },
          {
            key: 'schedule',
            label: t('tabs.schedule'),
            children: (
              <Table columns={columns} dataSource={debts} rowKey="id" pagination={false} />
            ),
          },
          {
            key: 'plan',
            label: t('tabs.plan'),
            children: (
              <Table
                rowKey="id"
                dataSource={debts.map((debt) => {
                  const remaining = debt.total - debt.paid
                  const projectedMonth = Math.ceil(remaining / debt.monthlyPayment)
                  return {
                    ...debt,
                    projectedMonth,
                    finish: dayjs().add(projectedMonth, 'month').format('MM/YYYY'),
                  }
                })}
                columns={[
                  { title: t('debtName'), dataIndex: 'name' },
                  {
                    title: t('debtRemaining'),
                    render: (_, r) => (r.total - r.paid).toLocaleString() + ' VND',
                  },
                  {
                    title: t('debtMonthlyPayment'),
                    dataIndex: 'monthlyPayment',
                    render: (v: number) => v.toLocaleString() + ' VND',
                  },
                  { title: t('repaymentPlan'), dataIndex: 'finish' },
                ]}
              />
            ),
          },
          {
            key: 'add',
            label: t('tabs.add'),
            children: (
              <Form form={form} layout="vertical" onFinish={handleAdd}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="type"
                      label={t('debtType')}
                      rules={[{ required: true, message: t('placeholderType') }]}
                    >
                      <Input placeholder={t('placeholderType')} />
                    </Form.Item>
                    <Form.Item
                      name="name"
                      label={t('debtName')}
                      rules={[{ required: true, message: t('placeholderName') }]}
                    >
                      <Input placeholder={t('placeholderName')} />
                    </Form.Item>
                    <Form.Item
                      name="total"
                      label={t('debtTotal')}
                      rules={[{ required: true, message: t('placeholderTotal') }]}
                    >
                      <InputNumber style={{ width: '100%' }} addonAfter="VND" placeholder={t('placeholderTotal')} />
                    </Form.Item>
                    <Form.Item name="paid" label={t('debtPaid')} initialValue={0}>
                      <InputNumber style={{ width: '100%' }} addonAfter="VND" placeholder={t('placeholderPaid')} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="monthlyPayment"
                      label={t('debtMonthlyPayment')}
                      rules={[{ required: true, message: t('placeholderMonthlyPayment') }]}
                    >
                      <InputNumber style={{ width: '100%' }} addonAfter="VND" placeholder={t('placeholderMonthlyPayment')} />
                    </Form.Item>
                    <Form.Item name="startDate" label={t('debtStartDate')}>
                      <DatePicker style={{ width: '100%' }} placeholder={t('placeholderStartDate')} />
                    </Form.Item>
                    <Form.Item
                      name="dueDate"
                      label={t('debtDueDate')}
                      rules={[{ required: true, message: t('placeholderDueDate') }]}
                    >
                      <DatePicker style={{ width: '100%' }} placeholder={t('placeholderDueDate')} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={isAdding}>
                        {t('addButton')}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            ),
          },
        ]}
      />
    </Content>
  )
}

