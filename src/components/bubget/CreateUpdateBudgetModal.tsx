import React, { useEffect, useState } from 'react'
import {
    Modal,
    Form,
    InputNumber,
    DatePicker,
    Select,
    FormInstance,
} from 'antd'
import dayjs from 'dayjs'
import { useGetCategoriesQuery } from '@/libs/redux/services/categoriesApi'
import ExpenseModal from './ExpenseModal'

const { RangePicker } = DatePicker

interface Props {
    visible: boolean
    onCancel: () => void
    onOk: (values: any) => void
    initialValues?: any
    form: FormInstance // form passed from parent
}

const CreateUpdateBudgetModal: React.FC<Props> = ({
    visible,
    onCancel,
    onOk,
    initialValues,
    form,
}) => {
    const { data: categories = [] } = useGetCategoriesQuery()
    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    dateRange: [
                        dayjs(initialValues.startDate),
                        dayjs(initialValues.endDate),
                    ],
                })
            } else {
                form.resetFields()
            }
        }
    }, [visible, initialValues])

    const handleFinish = (values: any) => onOk(values)

    return (
        <>
            <Modal
                open={visible}
                title={initialValues ? 'Edit Budget' : 'Create New Budget'}
                onCancel={onCancel}
                onOk={() => form.submit()}
                forceRender
                okText={initialValues ? 'Update' : 'Create'}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleFinish}
                    initialValues={{
                        budgetType: 'monthly',
                        alertThreshold: 80,
                    }}
                >
                    <Form.Item
                        label="Category"
                        name="categoryId"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select
                            placeholder="Select category"
                            options={categories.map((cat: any) => ({
                                label: cat.name,
                                value: cat.id,
                            }))}
                            loading={!categories.length}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Budget Type"
                        name="budgetType"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { label: 'Monthly', value: 'monthly' },
                                { label: 'Yearly', value: 'yearly' },
                                { label: 'Annual', value: 'annual' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Amount (VND)"
                        name="amount"
                        rules={[{ required: true, message: 'Enter an amount' }]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Alert Threshold (%)"
                        name="alertThreshold"
                        tooltip="Alert when spending exceeds this percentage"
                    >
                        <InputNumber min={0} max={100} step={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Date Range"
                        name="dateRange"
                        rules={[{ required: true, message: 'Select a date range' }]}
                    >
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default CreateUpdateBudgetModal

