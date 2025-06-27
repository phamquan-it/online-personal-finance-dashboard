// ========================
// ✅ Frontend: notificationsApi.ts (RTK Query)
// ========================

import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './authApi'

export interface Notification {
    id: number;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery,
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query<Notification[], { type?: string[]; isRead?: boolean } | void>({
            query: (params) => {
                const queryParts: string[] = []
                if (params?.type) {
                    for (const t of params.type) {
                        queryParts.push(`type=${encodeURIComponent(t)}`)
                    }
                }
                if (params?.isRead !== undefined) {
                    queryParts.push(`isRead=${params.isRead}`)
                }
                const queryStr = queryParts.length > 0 ? `?${queryParts.join('&')}` : ''
                return `notification${queryStr}`
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'Notification' as const, id })),
                          { type: 'Notification', id: 'LIST' },
                      ]
                    : [{ type: 'Notification', id: 'LIST' }],
        }),

        markNotificationAsRead: builder.mutation<void, number>({
            query: (id) => ({
                url: `notification/${id}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Notification', id },
                { type: 'Notification', id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
} = notificationsApi;

