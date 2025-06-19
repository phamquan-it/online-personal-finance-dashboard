'use client'

import { Form, InputNumber, DatePicker, Button, Card, Row, Divider } from 'antd'
import { useTranslations } from 'next-intl'

export default function AddPaymentForm({ maxAmount, onFinish }: any) {
    const t = useTranslations('DebtManagementPage')
    const [form] = Form.useForm()

    return (
        <Card
            style={{
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: 'none',
            }}
            bodyStyle={{ padding: 24 }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
            >
                {/* Payment Date first for logical record */}
                <Form.Item
                    name="date"
                    label={t('paymentDate')}
                    rules={[{ required: true, message: ('paymentDateRequired') }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder={t('paymentDate')}
                    />
                </Form.Item>

                {/* Payment Amount */}
                <Form.Item
                    name="amount"
                    label={t('paymentAmount')}
                    rules={[{ required: true, }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        addonAfter="VND"
                        min={1}
                        max={maxAmount}
                        placeholder={t('paymentAmount')}
                    />
                </Form.Item>

                <Divider />

                <Row justify="end">
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ borderRadius: 4, minWidth: 140 }}
                    >
                        {t('addPaymentNow')}
                    </Button>
                </Row>
            </Form>
        </Card>
    )
}

