'use client'

import React from 'react'
import { Card, Col, Progress, Row, Typography } from 'antd'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'

const { Text } = Typography

interface Debt {
  id: number
  debtName: string
  debtType: string
  totalAmount: number
  remainingAmount: number
  dueDate: string
}

interface Props {
  debts: Debt[]
}

const DebtOverviewList: React.FC<Props> = ({ debts }) => {
    const t = useTranslations("DebtManagementPage")
  return (
    <Row gutter={[16, 16]}>
      {debts.map((debt) => {
        const paid = debt.totalAmount - debt.remainingAmount
        const percent = debt.totalAmount > 0
          ? Math.round((paid / debt.totalAmount) * 100)
          : 0

        return (
          <Col xs={24} md={12} key={debt.id}>
            <Card title={debt.debtName} className="!mb-2">
              <Text>{t('debtType')}: <strong>{debt.debtType}</strong></Text><br />
              <Text>{t('debtRemaining')}: {debt.remainingAmount.toLocaleString()} VND</Text><br />
              <Text>{t('debtDueDate')}: {dayjs(debt.dueDate).format('DD/MM/YYYY')}</Text><br />
              <Progress percent={percent} status="active" style={{ marginTop: 8 }} />
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default DebtOverviewList

