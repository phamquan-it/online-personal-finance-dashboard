'use client'

import React from 'react'
import {
    Layout,
    Typography,
    Divider,
} from 'antd'
import {
    BookOutlined,
    BulbOutlined,
    CalculatorOutlined,
} from '@ant-design/icons'

import TipCardList from '@/components/education/TipCardList'
import VideoCardList from '@/components/education/VideoCardList'
import ToolCardList from '@/components/education/ToolCardList'

import { useGetTipsQuery, useGetToolsQuery, useGetVideosQuery } from '@/libs/redux/services/educationApi'
import { useTranslations } from 'next-intl'

const { Content } = Layout
const { Title, Paragraph } = Typography

export default function EducationPage() {
    const t = useTranslations("EducationPage")

    const { data: tips = [], isLoading: loadingTips } = useGetTipsQuery()
    const { data: videos = [], isLoading: loadingVideos } = useGetVideosQuery()
    const { data: tools = [], isLoading: loadingTools } = useGetToolsQuery()

    return (
        <Content style={{ padding: 23 }}>
            <Title level={1}>{t("title")}</Title>
            <Paragraph>{t("subtitle")}</Paragraph>

            <Divider orientation="left"><BulbOutlined /> {t("tipsTitle")}</Divider>
            <TipCardList tips={tips} loading={loadingTips} />

            <Divider orientation="left"><BookOutlined /> {t("videosTitle")}</Divider>
            <VideoCardList videos={videos} loading={loadingVideos} />

            <Divider orientation="left"><CalculatorOutlined /> {t("toolsTitle")}</Divider>
            <ToolCardList tools={tools} loading={loadingTools} />
        </Content>
    )
}

