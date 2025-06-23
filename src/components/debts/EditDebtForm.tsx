'use client'

import { useUpdateDebtMutation } from '@/libs/redux/services/debtApi'
import {
    Form,
    Input,
    InputNumber,
    DatePicker,
    Button,
    Row,
    Col,
    Divider,
    Card,
    Select,
    Switch,
    FormInstance,
    message,
} from 'antd'
import dayjs from 'dayjs'

interface EditDebtFormProps {
    form: FormInstance<any>
}

const EditDebtForm: React.FC<EditDebtFormProps> = ({ form }) => {
    const [updateDebt, { isLoading }] = useUpdateDebtMutation()
    const [messageApi, contextHolder] = message.useMessage()

    const handleFinish = async (values: any) => {
        try {
            // Chuyển ngày thành ISO nếu cần
            const payload = {
                ...values,
                dueDate: values.dueDate?.toISOString(),
                remainingAmount: values.totalAmount - (values.paid ?? 0),
            }

            await updateDebt(payload).unwrap()
            messageApi.success('Update successful')
        } catch (error) {
            messageApi.error('Update failed')
        }
    }

    return (
        <Card
            style={{
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: 'none',
            }}
            classNames={{ body: '!p-4' }}
        >
            <Form form={form} layout="vertical" size="large" onFinish={handleFinish}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="debtType"
                            label="Debt Type"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter debt type" allowClear />
                        </Form.Item>

                        <Form.Item
                            name="debtName"
                            label="Debt Name"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter debt name" allowClear />
                        </Form.Item>

                        <Form.Item
                            name="totalAmount"
                            label="Total Amount"
                            rules={[{ required: true }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                addonAfter="VND"
                                placeholder="Enter total amount"
                            />
                        </Form.Item>

                        <Form.Item name="paid" label="Paid Amount">
                            <InputNumber
                                style={{ width: '100%' }}
                                addonAfter="VND"
                                placeholder="Enter paid amount"
                            />
                        </Form.Item>

                        <Form.Item
                            name="interestRate"
                            label="Interest Rate"
                            rules={[{ required: true }]}
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                addonAfter="%"
                                style={{ width: '100%' }}
                                placeholder="Enter interest rate"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="minimumPayment"
                            label="Minimum Payment"
                            rules={[{ required: true }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                addonAfter="VND"
                                placeholder="Enter minimum payment"
                            />
                        </Form.Item>

                        <Form.Item
                            name="paymentFrequency"
                            label="Payment Frequency"
                            rules={[{ required: true }]}
                        >
                            <Select
                                options={[
                                    { label: 'Monthly', value: 'Monthly' },
                                    { label: 'Biweekly', value: 'Biweekly' },
                                    { label: 'Weekly', value: 'Weekly' },
                                ]}
                                placeholder="Select payment frequency"
                            />
                        </Form.Item>

                        <Form.Item
                            name="dueDate"
                            label="Due Date"
                            rules={[{ required: true }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Select due date"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <Row justify="space-between" align="middle">
                    <Form.Item
                        name="isCompleted"
                        label="Completed"
                        valuePropName="checked"
                        style={{ marginBottom: 0 }}
                    >
                        <Switch />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        style={{ borderRadius: 4, minWidth: 120 }}
                    >
                        Save
                    </Button>
                </Row>
            </Form>
        </Card>
    )
}

export default EditDebtForm

