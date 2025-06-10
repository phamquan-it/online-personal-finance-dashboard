// app/api/reports/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
    const data = {
        incomeData: [
            { date: '2025-01', income: 10000000 },
            { date: '2025-02', income: 12500000 },
            { date: '2025-03', income: 13000000 },
            { date: '2025-04', income: 11500000 },
            { date: '2025-05', income: 14200000 },
        ],
        expenseData: [
            { category: 'Ăn uống', value: 4000000 },
            { category: 'Giáo dục', value: 2000000 },
            { category: 'Giải trí', value: 1000000 },
            { category: 'Thuê nhà', value: 3000000 },
            { category: 'Khác', value: 1500000 },
        ],
    }

    return NextResponse.json(data)
}

