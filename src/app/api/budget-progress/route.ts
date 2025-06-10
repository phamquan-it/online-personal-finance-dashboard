import { NextResponse } from 'next/server'

export async function GET() {
  const data = [
    { label: 'Ăn uống', value: 4000000, budget: 5000000 },
    { label: 'Giáo dục', value: 2000000, budget: 2500000 },
    { label: 'Giải trí', value: 1000000, budget: 2000000 },
  ]

  return NextResponse.json(data)
}
