// lib/redux/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getInvestments: builder.query({
      query: () => 'investments',
    }),
  }),
})

export const { useGetInvestmentsQuery } = apiSlice

