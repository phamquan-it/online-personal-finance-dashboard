import { NextResponse } from 'next/server'

export async function GET() {
  const videos = [
    {
      title: "Cách lập ngân sách cá nhân",
      description: "Hướng dẫn chi tiết cách lập và theo dõi ngân sách hàng tháng",
      thumbnail: "https://i.ytimg.com/vi/example1/maxresdefault.jpg"
    },
    {
      title: "Đầu tư cơ bản cho người mới",
      description: "Những kiến thức nền tảng trước khi bắt đầu đầu tư",
      thumbnail: "https://i.ytimg.com/vi/example2/maxresdefault.jpg"
    }
  ]

  return NextResponse.json(videos)
}
