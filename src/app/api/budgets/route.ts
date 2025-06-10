// app/api/budgets/route.ts
import { NextRequest, NextResponse } from 'next/server'

const budgets = [
  {
    id: '1',
    category: 'Ăn uống',
    amount: 4000000,
    spent: 3200000,
    frequency: 'monthly',
  },
  {
    id: '2',
    category: 'Giải trí',
    amount: 1500000,
    spent: 1800000,
    frequency: 'monthly',
  },
]

export async function GET() {
  return NextResponse.json(budgets)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newBudget = {
    id: Date.now().toString(),
    ...data,
  }
  budgets.push(newBudget)
  return NextResponse.json(newBudget, { status: 201 })
}

