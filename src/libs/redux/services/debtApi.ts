import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Dayjs } from 'dayjs'

export const debtApi = createApi({
  reducerPath: 'debtApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Debts'],
  endpoints: (builder) => ({
    getDebts: builder.query<Debt[], void>({
      query: () => 'debts',
      providesTags: ['Debts'],
    }),
    addDebt: builder.mutation<void, Omit<Debt, 'key'>>({
      query: (newDebt) => ({
        url: 'debts',
        method: 'POST',
        body: newDebt,
      }),
      invalidatesTags: ['Debts'],
    }),
    updateDebt: builder.mutation<void, Debt>({
      query: (debt) => ({
        url: `debts/${debt.key}`,
        method: 'PUT',
        body: debt,
      }),
      invalidatesTags: ['Debts'],
    }),
    deleteDebt: builder.mutation<void, string>({
      query: (id) => ({
        url: `debts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Debts'],
    }),
  }),
})

export const {
  useGetDebtsQuery,
  useAddDebtMutation,
  useUpdateDebtMutation,
  useDeleteDebtMutation,
} = debtApi

