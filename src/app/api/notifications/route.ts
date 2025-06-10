// app/api/notifications/route.ts
import { NextResponse } from 'next/server'
import dayjs from 'dayjs'

const mockNotifications = [
    {
        id: 'n1',
        title: 'Bạn vừa vượt mức ngân sách Ăn uống',
        description: 'Chi tiêu 3,500,000 VND trong tháng, vượt ngân sách 3,000,000 VND',
        type: 'budget_exceeded',
        time: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
        read: false,
    },
    {
        id: 'n2',
        title: 'Hóa đơn Internet đến hạn',
        description: 'Phải thanh toán trước 2025-06-15',
        type: 'bill_due',
        time: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm'),
        read: false,
    },
    {
        id: 'n3',
        title: 'Khoản vay sinh viên: Thanh toán sắp tới',
        description: 'Số tiền 2,000,000 VND đến hạn vào 2025-06-20',
        type: 'upcoming_payment',
        time: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
        read: true,
    },
    {
        id: 'n4',
        title: 'Đầu tư cổ phiếu ABC tăng 5%',
        description: 'Giá trị đầu tư của bạn đã tăng 5% so với tuần trước',
        type: 'investment_change',
        time: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm'),
        read: false,
    },
    {
        id: 'n5',
        title: 'Bạn có thể hủy gói subscription XYZ để tiết kiệm',
        description: 'Subscription XYZ chi 200,000 VND/tháng, xem xét hủy nếu không cần.',
        type: 'savings_opportunity',
        time: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm'),
        read: false,
    },
]

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const types = searchParams.get('types')

    let result = mockNotifications

    if (types) {
        const typeArray = types.split(',')
        result = result.filter((n) => typeArray.includes(n.type))
    }

    return NextResponse.json(result)
}

