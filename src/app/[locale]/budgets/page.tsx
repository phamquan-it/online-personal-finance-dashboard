'use client'
import React, { useState } from 'react'
import {
    Row,
    Col,
    Button,
    Modal,
    Typography,
    Form,
    message,
} from 'antd'
import {
    useAddBudgetMutation,
    useAddExpenseMutation,
    useDeleteBudgetMutation,
    useGetBudgetsQuery,
    useUpdateBudgetMutation,
} from '@/libs/redux/services/budgetApi'
import dayjs from 'dayjs'
import BudgetCard from '@/components/bubget/BudgetCard'
import CreateUpdateBudgetModal from '@/components/bubget/CreateUpdateBudgetModal'
import ExpenseModal from '@/components/bubget/ExpenseModal'

const { Title } = Typography

const BudgetPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [actionModalOpen, setActionModalOpen] = useState(false)
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()

    const { data: budgets = [], isLoading: loadingBudgets } = useGetBudgetsQuery()
    const [addBudget] = useAddBudgetMutation()
    const [updateBudget] = useUpdateBudgetMutation()
    const [deleteBudget] = useDeleteBudgetMutation()
    const [addExpense] = useAddExpenseMutation()

    const handleCreate = async (values: any) => {
        const { dateRange, ...rest } = values
        const [start, end] = dateRange
        const payload = {
            ...rest,
            startDate: start.format('YYYY-MM-DD'),
            endDate: end.format('YYYY-MM-DD'),
        }

        try {
            if (editingId !== null) {
                await updateBudget({ ...payload, id: editingId }).unwrap()
                messageApi.success('Budget updated successfully!')
            } else {
                await addBudget(payload).unwrap()
                messageApi.success('Budget created successfully!')
            }
        } catch (err) {
            messageApi.error('Failed to save budget')
        }

        form.resetFields()
        setEditingId(null)
        setIsModalOpen(false)
    }

    const handleEdit = (budget: any) => {
        form.setFieldsValue({
            ...budget,
            dateRange: [dayjs(budget.startDate), dayjs(budget.endDate)],
        })
        setEditingId(budget.id)
        setIsModalOpen(true)
    }

    const handleDelete = (id: number) => {
        setEditingId(id)
        setActionModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            if (editingId !== null) {
                await deleteBudget(editingId).unwrap()
                messageApi.success('Budget deleted successfully!')
            }
        } catch {
            messageApi.error('Failed to delete budget!')
        }
        setActionModalOpen(false)
        setEditingId(null)
    }


    if (loadingBudgets) return <div>Loading...</div>
    const handleSaveExpense = async (values: any) => {
        if (!editingId) return
        try {
            await addExpense({
                budgetId: editingId,
                amount: values.amount,
                transactionDate: values.expenseDate.format('YYYY-MM-DD'),
                description: values.description,
                paymentMethod: values.paymentMethod,
            }).unwrap()
            messageApi.success('Expense added successfully!')
        } catch {
            messageApi.error('Failed to add expense!')
        }

        setEditingId(null)
    }

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Title level={3}>Your Budgets</Title>

            <Button
                type="primary"
                onClick={() => {
                    form.resetFields()
                    setEditingId(null)
                    setIsModalOpen(true)
                }}
                style={{ marginBottom: 24 }}
            >
                Create Budget
            </Button>

            <Row gutter={[16, 16]}>
                {budgets.map((budget) => (
                    <Col key={budget.id} xs={24} sm={12} md={8}>
                        <BudgetCard key={budget.id}
                            budget={budget}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </Col>
                ))}
            </Row>

            <CreateUpdateBudgetModal
                visible={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false)
                    setEditingId(null)
                }}
                onOk={handleCreate}
                initialValues={budgets.find((b) => b.id === editingId)}
                form={form}
            />

            <Modal
                title="Delete Budget"
                open={actionModalOpen}
                onOk={handleConfirmDelete}
                onCancel={() => setActionModalOpen(false)}
                okText="Delete"
                okButtonProps={{ danger: true }}
            >
                Are you sure you want to delete this budget? This action cannot be undone.
            </Modal>
        </div>
    )
}

export default BudgetPage

