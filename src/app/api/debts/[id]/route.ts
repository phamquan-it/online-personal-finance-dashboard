// app/api/debts/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'

let debts: Debt[] = [] // Just for demo. Use DB or context in production.

// PUT /api/debts/:id
export async function PUT(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop() || ''
    const updated = await req.json()
    debts = debts.map((d) => (d.id === id ? { ...d, ...updated } : d))
    return NextResponse.json({ success: true })
}

// DELETE /api/debts/:id
export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop() || ''
    debts = debts.filter((d) => d.id !== id)
    return NextResponse.json({ success: true })
}

