// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'



const categories: Category[] = [
  { key: '1', name: 'Ăn uống', description: 'Nhà hàng, thực phẩm, nước uống', amount: 1500000 },
  { key: '2', name: 'Giáo dục', description: 'Học phí, sách vở, khóa học', amount: 2000000 },
  { key: '3', name: 'Giải trí', description: 'Phim ảnh, game, sự kiện', amount: 500000 },
  { key: '4', name: 'Thuê nhà', description: 'Tiền thuê nhà, bảo trì', amount: 3500000 },
];

export async function GET() {
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description } = body

  if (!name) {
    return NextResponse.json({ error: 'Thiếu tên danh mục' }, { status: 400 })
  }

  const newCategory: Category = {
    key: Date.now().toString(),
    name,
    description,
  }

  categories.push(newCategory)

  return NextResponse.json(newCategory, { status: 201 })
}

