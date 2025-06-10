import { NextResponse } from 'next/server'

export async function GET() {
  const data = [
    { category: 'Ăn uống', value: 4000000 },
    { category: 'Giáo dục', value: 2000000 },
    { category: 'Giải trí', value: 1000000 },
    { category: 'Thuê nhà', value: 3000000 },
    { category: 'Khác', value: 1500000 },
  ]

  return NextResponse.json(data)
}
