// lib/reportsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const reportsApi = createApi({
    reducerPath: 'reportsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getReports: builder.query<{
            incomeData: { date: string; income: number }[],
            expenseData: { category: string; value: number }[]
        }, void>({
            query: () => 'reports',
        }),
    }),
})

export const { useGetReportsQuery } = reportsApi

