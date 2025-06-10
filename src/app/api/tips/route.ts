import { NextResponse } from 'next/server'

export async function GET() {
    const tips = [
        {
            title: "Quy tắc 50/30/20",
            content: "Dành 50% thu nhập cho nhu cầu thiết yếu, 30% cho mong muốn cá nhân và 20% để tiết kiệm hoặc đầu tư."
        },
        {
            title: "Ưu tiên trả nợ lãi cao",
            content: "Luôn tập trung trả các khoản nợ có lãi suất cao trước để giảm gánh nặng tài chính lâu dài."
        },
        {
            title: "Tự động hóa tiết kiệm",
            content: "Thiết lập chuyển khoản tự động vào tài khoản tiết kiệm ngay khi nhận lương để hình thành thói quen."
        }
    ]

    return NextResponse.json(tips)
}
