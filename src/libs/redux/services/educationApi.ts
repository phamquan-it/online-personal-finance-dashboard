// src/features/api/educationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const educationApi = createApi({
    reducerPath: 'educationApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }), // sử dụng mock hoặc json-server
    endpoints: (builder) => ({
        getTips: builder.query<{ title: string; content: string }[], void>({
            query: () => 'tips',
        }),
        getTools: builder.query<{ title: string; icon: string; link: string }[], void>({
            query: () => 'tools',
        }),
        getVideos: builder.query<{ title: string; description: string; thumbnail: string }[], void>({
            query: () => 'videos',
        }),
    }),
})

export const {
    useGetTipsQuery,
    useGetToolsQuery,
    useGetVideosQuery,
} = educationApi

