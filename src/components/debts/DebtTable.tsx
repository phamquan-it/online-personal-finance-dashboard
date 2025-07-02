'use client';

import React from 'react';
import { Table, Button, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';


interface Props {
    debts: Debt[];
    onEdit: (debt: Debt) => void;
    onAddPayment: (debt: Debt) => void;
    onDelete: (id: number) => void;
}

const DebtTable: React.FC<Props> = ({ debts, onEdit, onAddPayment, onDelete }) => {
    const t = useTranslations("DebtManagementPage")
    const columns = [
        {
            title: t('debtType'),
            dataIndex: 'debtType',
            render: (text: string) => <span className="text-blue-500">{text}</span>,
        },
        {
            title: t('debtName'),
            dataIndex: 'debtName',
        },
        {
            title: t('debtTotal'),
            dataIndex: 'totalAmount',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: t('debtRemaining'),
            dataIndex: 'remainingAmount',
            render: (val: number) => `${val.toLocaleString()} VND`,
        },
        {
            title: t('debtDueDate'),
            dataIndex: 'dueDate',
            render: (val: string) => dayjs(val).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            render: (_: any, record: Debt) => {
                const menuItems = [
                    {
                        key: 'edit',
                        label: t('editDebt'),
                        onClick: () => onEdit(record),
                    },
                    {
                        key: 'addPayment',
                        label: t('addPaymentNow'),
                        onClick: () => onAddPayment(record),
                    },
                    {
                        key: 'delete',
                        label: ('deleteDeb'),
                        onClick: () => onDelete(record.id),
                    },
                ];

                return (
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
                        <Button size="small" icon={<EllipsisOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return <Table columns={columns} dataSource={debts} rowKey="id" pagination={false} />;
};

export default DebtTable;

