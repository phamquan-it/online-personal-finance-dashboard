'use client'

import React, { useState } from 'react'
import { Layout, Typography, Tabs, message, Spin, Form } from 'antd'
import { useTranslations, useLocale } from 'next-intl'
import dayjs from 'dayjs'

import {
    useAddDebtMutation,
    useGetDebtsQuery,
    useDeleteDebtMutation,
    useUpdateDebtMutation,
} from '@/libs/redux/services/debtApi'

import DebtOverviewList from '@/components/debts/DebtOverviewList'
import DebtTable from '@/components/debts/DebtTable'
import DebtModal from '@/components/debts/DebtModal'
import AddDebtForm from '@/components/debts/AddDebtForm'

const { Content } = Layout
const { Title } = Typography

export default function DebtManagementPage() {
    const [form] = Form.useForm()
    const [activeKey, setActiveKey] = useState('overview')
    const [modalVisible, setModalVisible] = useState(false)
    const [modalTab, setModalTab] = useState<'edit' | 'payment'>('edit')
    const [currentDebt, setCurrentDebt] = useState<Debt | null>(null)

    const t = useTranslations('DebtManagementPage')
    const locale = useLocale()
    const [messageApi, contextHolder] = message.useMessage()

    const { data: debts = [], isLoading, isFetching, refetch } = useGetDebtsQuery()
    const [addDebt, { isLoading: isAdding }] = useAddDebtMutation()
    const [deleteDebt] = useDeleteDebtMutation()
    const [updateDebt] = useUpdateDebtMutation()

    const openModal = (debt: Debt, tab: 'edit' | 'payment') => {
        setCurrentDebt(debt)
        setModalTab(tab)
        setModalVisible(true)
    }

    const handleAdd = async (values: any) => {
        try {
            await addDebt({
                debtName: values.debtName,
                debtType: values.debtType,
                totalAmount: values.totalAmount,
                remainingAmount: values.remainingAmount ?? values.totalAmount,
                interestRate: values.interestRate ?? 0,
                minimumPayment: values.minimumPayment ?? 0,
                paymentFrequency: values.paymentFrequency ?? 'monthly',
                dueDate: dayjs(values.dueDate).format('YYYY-MM-DD'),
            }).unwrap()
            messageApi.success(t('addDebtSuccess'))
            form.resetFields()
            setActiveKey('overview')
            refetch()
        } catch {
            messageApi.error(t('addDebtError'))
        }
    }

    const handleUpdate = async (updated: Partial<Debt>) => {
        if (!currentDebt) return
        try {
            await updateDebt({ ...currentDebt, ...updated }).unwrap()
            messageApi.success(t('updateDebtSuccess'))
            setModalVisible(false)
            refetch()
        } catch {
            messageApi.error(t('updateDebtError'))
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteDebt(id).unwrap()
            messageApi.success(t('deleteDebtSuccess'))
            refetch()
        } catch {
            messageApi.error(t('deleteDebtError'))
        }
    }

    const handleAddPayment = async (amount: number) => {
        if (!currentDebt) return
        try {
            await updateDebt({
                ...currentDebt,
                remainingAmount: currentDebt.remainingAmount - amount,
            }).unwrap()
            messageApi.success(t('paymentAdded'))
            setModalVisible(false)
            refetch()
        } catch {
            messageApi.error(('paymentError'))
        }
    }

    if (isLoading || isFetching) {
        return <Content style={{ padding: 24 }}><Spin size="large" /></Content>
    }

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}
            <Title level={2}>
                {t('title')} ({locale})
            </Title>

            <Tabs
                activeKey={activeKey}
                onChange={setActiveKey}
                items={[
                    {
                        key: 'overview',
                        label: t('tabs.overview'),
                        children: (
                            <DebtOverviewList
                                debts={debts}
                            />
                        )
                    },
                    {
                        key: 'table',
                        label: t('tabs.schedule'),
                        children: (
                            <DebtTable
                                debts={debts}
                                onEdit={(debt) => openModal(debt, 'edit')}
                                onAddPayment={(debt) => openModal(debt, 'payment')}
                                onDelete={handleDelete}
                            />
                        )
                    },
                    {
                        key: 'add',
                        label: t('tabs.add'),
                        children: (
                            <AddDebtForm
                                form={form}
                                onSubmit={handleAdd}
                                isLoading={isAdding}  />
                        )
                    }
                ]}
            />

            <DebtModal
                open={modalVisible}
                onClose={() => setModalVisible(false)}
                currentDebt={currentDebt}
                activeTab={modalTab}
                setActiveTab={setModalTab}
                onEdit={handleUpdate}
                onAddPayment={handleAddPayment}
                form={form}
            />
        </Content>
    )
}

