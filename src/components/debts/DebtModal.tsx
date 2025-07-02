'use client';

import React from 'react';
import { Modal, Tabs } from 'antd';
import EditDebtForm from './EditDebtForm';
import AddPaymentForm from './AddPaymentForm';
import { useTranslations } from 'next-intl';

interface Debt {
  id: number;
  debtName: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate?: number;
  minimumPayment?: number;
  paymentFrequency?: string;
  dueDate: string;
  debtType: string;
}

interface DebtModalProps {
  open: boolean;
  currentDebt: Debt | null;
  onClose: () => void;
  activeTab: 'edit' | 'payment';
  setActiveTab: (tab: 'edit' | 'payment') => void;
  onEdit: (values: Partial<Debt>) => Promise<void>;
  onAddPayment: (amount: number) => Promise<void>;
  form: any;
}

const DebtModal: React.FC<DebtModalProps> = ({
  open,
  currentDebt,
  onClose,
  activeTab,
  setActiveTab,
  onEdit,
  onAddPayment,
  form,
}) => {
  const t = useTranslations('DebtManagementPage');

  if (!currentDebt) return null;

  return (
    <Modal
      open={open}
      title={`${t('debtModalTitle')} - ${currentDebt.debtName}`}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'edit' | 'payment')}
        items={[
          {
            key: 'edit',
            label: t('editDebt'),
            children: <EditDebtForm form={form} />,
          },
          {
            key: 'payment',
            label: t('addPaymentNow'),
            children: <AddPaymentForm onSubmit={onAddPayment} />,
          },
        ]}
      />
    </Modal>
  );
};

export default DebtModal;

