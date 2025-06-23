// services/statisticsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './authApi'

export const statisticsApi = createApi({
    reducerPath: 'statisticsApi',
    baseQuery,
    endpoints: (builder) => ({
        getMonthlySummary: builder.query<MonthlySummary, void>({
            query: () => 'Statistics/monthly-summary',
        }),
    }),
})

export const { useGetMonthlySummaryQuery } = statisticsApi

