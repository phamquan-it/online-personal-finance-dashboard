'use client'

import { Form, Input, InputNumber, DatePicker, Button, Row, Col } from 'antd'
import { useTranslations } from 'next-intl'

export default function AddDebtForm({ form, onFinish, loading }: any) {
  const t = useTranslations('DebtManagementPage')

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="type" label={t('debtType')} rules={[{ required: true }]}>
            <Input placeholder={t('placeholderType')} />
          </Form.Item>
          <Form.Item name="name" label={t('debtName')} rules={[{ required: true }]}>
            <Input placeholder={t('placeholderName')} />
          </Form.Item>
          <Form.Item name="total" label={t('debtTotal')} rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} addonAfter="VND" />
          </Form.Item>
          <Form.Item name="paid" label={t('debtPaid')} initialValue={0}>
            <InputNumber style={{ width: '100%' }} addonAfter="VND" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="monthlyPayment" label={t('debtMonthlyPayment')} rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} addonAfter="VND" />
          </Form.Item>
          <Form.Item name="startDate" label={t('debtStartDate')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="dueDate" label={t('debtDueDate')} rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t('saveButton')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
