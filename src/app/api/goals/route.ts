// app/api/goals/route.ts
import { NextResponse } from 'next/server'

// Dữ liệu giả (giống như lưu trong RAM)
const goals = [
  {
    id: '1',
    name: 'Du lịch Nhật Bản',
    targetAmount: 50000000,
    savedAmount: 20000000,
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(goals)
}

export async function POST(req: Request) {
  const data = await req.json()

  const newGoal = {
    ...data,
    id: Date.now().toString(),
  }

  goals.push(newGoal)

  return NextResponse.json(newGoal, { status: 201 })
}

