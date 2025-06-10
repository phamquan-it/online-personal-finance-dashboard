// lib/redux/api/budgetApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const budgetApi = createApi({
  reducerPath: 'budgetApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Budget'],
  endpoints: (builder) => ({
    getBudgets: builder.query({
      query: () => 'budgets',
      providesTags: ['Budget'],
    }),
    createBudget: builder.mutation({
      query: (newBudget) => ({
        url: 'budgets',
        method: 'POST',
        body: newBudget,
      }),
      invalidatesTags: ['Budget'],
    }),
  }),
})

export const { useGetBudgetsQuery, useCreateBudgetMutation } = budgetApi

