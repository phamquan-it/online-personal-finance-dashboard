// app/api/login/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const { email, password } = body

  // Đây là phần giả lập: bạn có thể thêm điều kiện nếu muốn kiểm tra
  if (email === 'admin@example.com' && password === '123456') {
    return NextResponse.json(
      { accessToken: 'fake-jwt-token-1234567890' },
      { status: 200 }
    )
  }

  return NextResponse.json(
    { message: 'Invalid credentials' },
    { status: 401 }
  )
}

