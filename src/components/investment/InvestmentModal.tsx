'use client'

import React from 'react'
import {
    Modal,
    Tabs,
    Form,
    Input,
    Select,
    InputNumber,
    Button,
} from 'antd'

const { Option } = Select

interface Investment {
    id: string | number
    name: string
    type: string
    amount: number
    returnRate: number
}

interface InvestmentModalProps {
    open: boolean
    onCancel: () => void
    activeTab: string
    setActiveTab: (key: string) => void
    record: Investment | null
    form: any
    onEditSubmit: (values: any) => void
    onDelete: (id: string | number) => void
    t: (key: string, opts?: any) => string
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({
    open,
    onCancel,
    activeTab,
    setActiveTab,
    record,
    form,
    onEditSubmit,
    onDelete,
    t,
}) => {
    return (
        <Modal
            title={`Manage: ${record?.name}`}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'edit',
                        label: t('modalEditTab'),
                        children: (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onEditSubmit}
                                initialValues={record || {}}
                            >
                                <Form.Item name="name" label={t('investmentName')} rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="type" label={t('investmentType')} rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Stock">{t('investmentStock')}</Option>
                                        <Option value="Bond">{t('investmentBond')}</Option>
                                        <Option value="Real Estate">{t('investmentRealEstate')}</Option>
                                        <Option value="Crypto">{t('investmentCrypto')}</Option>
                                        <Option value="Other">{t('investmentOther')}</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="amount" label={t('investmentAmount')} rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} min={100000} />
                                </Form.Item>
                                <Form.Item name="returnRate" label={t('investmentReturnRate')} rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} min={-100} max={100} step={0.1} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        {t('modalSaveChangesButton')}
                                    </Button>
                                </Form.Item>
                            </Form>
                        ),
                    },
                    {
                        key: 'delete',
                        label: t('modalDeleteTab'),
                        children: (
                            <>
                                <p>{t('modalConfirmDelete', { name: record?.name })}</p>
                                <Button danger block onClick={() => record && onDelete(record.id)}>
                                    {t('modalConfirmDeleteButton')}
                                </Button>
                            </>
                        ),
                    },
                ]}
            />
        </Modal>
    )
}

export default InvestmentModal

