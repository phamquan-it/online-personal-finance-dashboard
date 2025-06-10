import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    remainingDebt: 8500000,
    repaymentProgress: 60,
    repaymentPlan: 'Kế hoạch trả xong trong 3 tháng tới',
  }

  return NextResponse.json(data)
}
