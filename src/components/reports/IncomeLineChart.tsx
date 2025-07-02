// components/reports/IncomeLineChart.tsx
import React from 'react'
import { Card } from 'antd'
import { LineChartOutlined } from '@ant-design/icons'
import { Datum, Line } from '@ant-design/charts'
import { useTranslations } from 'next-intl'

interface Props {
    data: Datum[]
    token: any
}

export default function IncomeLineChart({ data, token }: Props) 
{

    const t = useTranslations("ReportsPage")
    return (
        <Card title={t("incomeChartTitle")} variant="borderless" extra={<LineChartOutlined />}>
            <Line
                data={data}
                xField="date"
                yField="income"
                height={250}
                point={{ size: 5, shape: 'diamond' }}
                color={token.colorPrimary}
                tooltip={{
                    formatter: (datum: Datum) => ({
                        name: t("tooltipIncome"),
                        value: `${datum.income.toLocaleString()} ${t("currency")}`,
                    }),
                }}
            />
        </Card>
    )
}

