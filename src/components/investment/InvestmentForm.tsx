'use client'

import React from 'react'
import { Form, Input, Select, InputNumber, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const assetTypeOptions = [
    { label: 'Stock', value: 'stock' },
    { label: 'Bond', value: 'bond' },
    { label: 'Real Estate', value: 'real_estate' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'Mutual Fund', value: 'mutual_fund' },
    { label: 'ETF', value: 'etf' },
    { label: 'Other', value: 'other' },
]

interface InvestmentFormProps {
    form: any
    onFinish: (values: any) => void
    t: (key: string) => string
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ form, onFinish, t }) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
                <Select placeholder={t('placeholderType')} options={assetTypeOptions} />
            </Form.Item>

            <Form.Item
                name="amount"
                label={t('investmentAmount')}
                rules={[{ required: true, message: t('placeholderAmount') }]}
            >
                <InputNumber
                    min={1000}
                    step={1000}
                    style={{ width: '100%' }}
                    formatter={(val) => `${Number(val).toLocaleString()} VND`}
                    parser={(val: any) => Number(val?.replace(/[^\d]/g, ''))}
                />
            </Form.Item>

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

            <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                    {t('addButton')}
                </Button>
            </Form.Item>
        </Form>
    )
}

export default InvestmentForm

