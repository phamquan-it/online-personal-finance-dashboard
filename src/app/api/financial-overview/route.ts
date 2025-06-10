import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    totalIncome: 20000000,
    totalExpense: 11500000,
    savingsRate: 43,
    investmentAssets: 35000000,
  }

  return NextResponse.json(data)
}
