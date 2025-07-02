import React, { useState } from 'react'
import { Card, Button, Typography, message } from 'antd'
import ExpenseModal from './ExpenseModal'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface Props {
    budget: Budget
    onEdit: (budget: any) => void
    onDelete: (id: number) => void
}

const BudgetCard: React.FC<Props> = ({ budget, onEdit, onDelete }) => {
    const [expenseModalOpen, setExpenseModalOpen] = useState(false)
    const [messageApi, contextHolder] = message.useMessage()

    return (
        <>
            {contextHolder}
            <Card
                title={<Title level={5}>{budget.category}</Title>}
                actions={
                    [
                        <span onClick={() => setExpenseModalOpen(true)}>
                            <PlusCircleOutlined /> Add Expense
                        </span>,
                        <span onClick={() => onEdit(budget)}>
                            <EditOutlined /> Edit
                        </span>,
                        <span onClick={() => onDelete(budget.id)}>
                            <DeleteOutlined /> Delete
                        </span>,
                    ]}
            >
                <Text>Số tiền: {budget.amount.toLocaleString()} VND</Text><br />
                <Text>Kiểu: {budget.budgetType}</Text><br />
                <Text>Ngày: {budget.startDate} - {budget.endDate}</Text>

                <ExpenseModal
                    visible={expenseModalOpen}
                    onCancel={() => setExpenseModalOpen(false)}
                    initialValues={{ budgetId: budget.id }}
                    onOk={() => {
                        setExpenseModalOpen(false)
                        messageApi.success('Thêm chi tiêu thành công!')
                    }}
                />
            </Card>
        </>
    )
}

export default BudgetCard

