// store/api/notificationsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface NotificationItem {
    id: string
    title: string
    description: string
    type: string
    time: string
    read: boolean
}

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getNotifications: builder.query<NotificationItem[], string[]>({
            query: (types) => {
                const params = new URLSearchParams()
                types.forEach((t) => params.append('types', t))
                return `notifications?${params.toString()}`
            },
        }),
    }),
})

export const { useGetNotificationsQuery } = notificationsApi

