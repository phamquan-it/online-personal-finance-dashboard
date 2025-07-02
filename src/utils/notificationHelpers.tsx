import {
  NotificationOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  LineChartOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { Tag } from 'antd'
import { NotificationType } from '@/constants/notificationTypes'

export const getIconByType = (type: NotificationType) => {
  switch (type) {
    case 'budget_exceeded': return <ExclamationCircleOutlined style={{ color: '#cf1322' }} />
    case 'bill_due': return <CalendarOutlined style={{ color: '#fa8c16' }} />
    case 'upcoming_payment': return <DollarOutlined style={{ color: '#1890ff' }} />
    case 'investment_change': return <LineChartOutlined style={{ color: '#52c41a' }} />
    case 'savings_opportunity': return <SmileOutlined style={{ color: '#722ed1' }} />
    default: return <NotificationOutlined />
  }
}

export const getTagByType = (type: NotificationType) => {
  switch (type) {
    case 'budget_exceeded': return <Tag color="red">Vượt ngân sách</Tag>
    case 'bill_due': return <Tag color="orange">Hóa đơn đến hạn</Tag>
    case 'upcoming_payment': return <Tag color="blue">Thanh toán sắp tới</Tag>
    case 'investment_change': return <Tag color="green">Thay đổi đầu tư</Tag>
    case 'savings_opportunity': return <Tag color="purple">Cơ hội tiết kiệm</Tag>
    default: return <Tag>Thông báo</Tag>
  }
}

