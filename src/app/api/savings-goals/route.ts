import { NextResponse } from 'next/server'

export async function GET() {
  const data = [
    { name: 'Du lịch', current: 7000000, target: 15000000 },
    { name: 'Quỹ khẩn cấp', current: 12000000, target: 30000000 },
  ]

  return NextResponse.json(data)
}
