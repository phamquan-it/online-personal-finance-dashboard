// app/api/debts/route.ts
import { NextResponse } from 'next/server'

const debts = [
  {
    id: '1',
    type: 'Thẻ tín dụng',
    name: 'Visa Techcombank',
    total: 15000000,
    paid: 5000000,
    monthlyPayment: 1000000,
    dueDate: '2025-12-01',
    startDate: '2025-01-01',
  },
  {
    id: '2',
    type: 'Vay sinh viên',
    name: 'ĐH Quốc Gia',
    total: 30000000,
    paid: 10000000,
    monthlyPayment: 2000000,
    dueDate: '2026-06-01',
    startDate: '2024-01-01',
  },
]

// GET /api/debts
export async function GET() {
  return NextResponse.json(debts)
}

// POST /api/debts
export async function POST(req: Request) {
  const data = await req.json()
  const newDebt = {
    ...data,
    id: Date.now().toString(),
  }
  debts.push(newDebt)
  return NextResponse.json(newDebt, { status: 201 })
}

