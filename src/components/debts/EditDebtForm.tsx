'use client'

import { Form, Input, InputNumber, DatePicker, Button, Row, Col, Divider, Card } from 'antd'
import { useTranslations } from 'next-intl'

export default function EditDebtForm({ form, onFinish, loading }: any) {
  const t = useTranslations('DebtManagementPage')

  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: 'none',
      }}
        classNames={{ body:"!p-4"  }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        size="large"
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="type"
              label={t('debtType')}
              rules={[{ required: true }]}
            >
              <Input
                placeholder={t('placeholderType')}
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="name"
              label={t('debtName')}
              rules={[{ required: true }]}
            >
              <Input
                placeholder={t('placeholderName')}
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="total"
              label={t('debtTotal')}
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter="VND"
                placeholder={t('placeholderTotal')}
              />
            </Form.Item>

            <Form.Item
              name="paid"
              label={t('debtPaid')}
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter="VND"
                placeholder={t('placeholderPaid')}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="monthlyPayment"
              label={t('debtMonthlyPayment')}
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter="VND"
                placeholder={t('placeholderMonthlyPayment')}
              />
            </Form.Item>

            <Form.Item
              name="startDate"
              label={t('debtStartDate')}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder={t('placeholderStartDate')}
              />
            </Form.Item>

            <Form.Item
              name="dueDate"
              label={t('debtDueDate')}
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder={t('placeholderDueDate')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row justify="end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              borderRadius: 4,
              minWidth: 120,
            }}
          >
            {t('saveButton')}
          </Button>
        </Row>
      </Form>
    </Card>
  )
}

