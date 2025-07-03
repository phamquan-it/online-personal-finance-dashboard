// libs/redux/services/notificationsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './authApi'
export type NotificationType =
    | 'budget_exceeded'
    | 'bill_due'
    | 'upcoming_payment'
    | 'investment_change'
    | 'savings_opportunity'

export interface Notification {
    id: number
    type: NotificationType
    message: string
    createdAt: string
    isRead: boolean
}

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery,
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query<Notification[], { type?: NotificationType[]; isRead?: boolean } | void>({
            query: (params) => {
                const searchParams = new URLSearchParams()
                if (params?.type?.length) {
                    for (const t of params.type) {
                        searchParams.append('type', t)
                    }
                }
                if (params?.isRead !== undefined) {
                    searchParams.append('isRead', String(params.isRead))
                }

                return {
                    url: `/api/Notification`,
                    method: 'GET',
                    params: searchParams,
                }
            },
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Notification' as const, id })), { type: 'Notification', id: 'LIST' }]
                    : [{ type: 'Notification', id: 'LIST' }],
        }),

        markNotificationAsRead: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/Notification/${id}/mark-as-read`,
                method: 'PATCH',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Notification', id },
                { type: 'Notification', id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
} = notificationsApi

