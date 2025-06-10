import { NextResponse } from 'next/server'

export async function GET() {
  const tools = [
    {
      title: "Tính lãi suất tiết kiệm",
      icon: "calculator",
      link: "/tools/saving-interest"
    },
    {
      title: "Tính lãi vay ngân hàng",
      icon: "calculator",
      link: "/tools/loan-interest"
    }
  ]

  return NextResponse.json(tools)
}
