'use client';

import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    DatePicker,
    Button,
    Row,
    Col,
    Select,
} from 'antd';
import { useTranslations } from 'next-intl';

interface Props {
    form: any;
    onSubmit: (values: any) => void;
    isLoading: boolean;
}

const AddDebtForm: React.FC<Props> = ({ form, onSubmit, isLoading }) => {
    const t = useTranslations("DebtManagementPage")
    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item name="debtType" label={t('debtType')} rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: 'Credit Card', value: 'credit_card' },
                                { label: 'Student Loan', value: 'student_loan' },
                                { label: 'Mortgage', value: 'mortgage' },
                                { label: 'Personal Loan', value: 'personal_loan' },
                                { label: 'Other', value: 'other' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="debtName" label={t('debtName')} rules={[{ required: true }]}>
                        <Input placeholder={t('placeholderName')} />
                    </Form.Item>
                    <Form.Item name="totalAmount" label={t('debtTotal')} rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            addonAfter={<span>VND</span>}
                        />
                    </Form.Item>
                    <Form.Item name="remainingAmount" label={t('debtRemaining')}>
                        <InputNumber
                            style={{ width: '100%' }}
                            addonAfter={<span>VND</span>}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="interestRate" label={t('interestRate')}>
                        <InputNumber
                            style={{ width: '100%' }}
                            addonAfter={<span>%</span>}
                        />
                    </Form.Item>
                    <Form.Item name="minimumPayment" label={t('minimumPayment')}>
                        <InputNumber
                            style={{ width: '100%' }}
                            addonAfter={<span>VND</span>}
                        />
                    </Form.Item>
                    <Form.Item name="paymentFrequency" label={t('paymentFrequency')}>
                        <Select
                            options={[
                                { label: 'Monthly', value: 'monthly' },
                                { label: 'Weekly', value: 'weekly' },
                                { label: 'Bi-Weekly', value: 'bi-weekly' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="dueDate" label={t('debtDueDate')} rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            {t('saveButton')}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default AddDebtForm;

