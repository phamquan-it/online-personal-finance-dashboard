import React, { useEffect } from 'react'
import {
    Modal,
    Form,
    InputNumber,
    DatePicker,
    Input,
    Select,
    message as antdMessage,
} from 'antd'
import dayjs from 'dayjs'
import { useAddExpenseMutation } from '@/libs/redux/services/budgetApi'

const { TextArea } = Input

interface ExpenseModalProps {
    visible: boolean
    onCancel: () => void
    onOk: (data: any) => void
    initialValues?: {
        budgetId: number
    }
}

const paymentMethodOptions = [
    { label: 'Tiền mặt', value: 'cash' },
    { label: 'Thẻ', value: 'card' },
    { label: 'Chuyển khoản', value: 'bank_transfer' },
]

const ExpenseModal: React.FC<ExpenseModalProps> = ({
    visible,
    onCancel,
    onOk,
    initialValues,
}) => {
    const [form] = Form.useForm()
    const [addExpense, { isLoading }] = useAddExpenseMutation()
    const [messageApi, contextHolder] = antdMessage.useMessage()

    useEffect(() => {
        if (visible) {
            form.resetFields()
            form.setFieldsValue({
                expenseDate: dayjs(),
                paymentMethod: 'cash',
            })
        }
    }, [visible])

    const handleSubmit = async (values: any) => {
        if (!initialValues?.budgetId) {
            messageApi.error('Thiếu budgetId')
            return
        }

        try {
            const payload = {
                budgetId: initialValues.budgetId,
                amount: values.amount,
                transactionDate: values.expenseDate.format('YYYY-MM-DD'),
                description: values.description,
                paymentMethod: values.paymentMethod,
            }

            await addExpense(payload).unwrap()

            messageApi.success('Thêm chi tiêu thành công')
            form.resetFields()
            onOk(payload) // Gọi onOk từ parent nếu cần reload dữ liệu
        } catch (err) {
            messageApi.error('Thêm thất bại')
        }
    }

    return (
        <>
            {contextHolder}
            <Modal
                open={visible}
                title="Thêm chi tiêu"
                onCancel={onCancel}
                onOk={() => form.submit()}
                okText="Lưu"
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Số tiền (VND)"
                        name="amount"
                        rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày chi tiêu"
                        name="expenseDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <TextArea rows={3} placeholder="Nhập mô tả" />
                    </Form.Item>

                    <Form.Item
                        label="Phương thức thanh toán"
                        name="paymentMethod"
                        rules={[{ required: true, message: 'Chọn phương thức' }]}
                    >
                        <Select options={paymentMethodOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ExpenseModal

