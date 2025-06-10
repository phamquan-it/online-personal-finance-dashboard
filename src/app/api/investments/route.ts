// app/api/investments/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const data = [
    {
      id: '1',
      name: 'Cổ phiếu VNM',
      type: 'Stock',
      amount: 15000000,
      returnRate: 12.5,
    },
    {
      id: '2',
      name: 'Bất động sản Đà Nẵng',
      type: 'Real Estate',
      amount: 50000000,
      returnRate: 9.2,
    },
    {
      id: '3',
      name: 'Trái phiếu Chính phủ',
      type: 'Bond',
      amount: 20000000,
      returnRate: 5,
    },
  ]

  return NextResponse.json(data)
}

