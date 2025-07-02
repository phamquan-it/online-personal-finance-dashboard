import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './authApi';
export interface Expense {
    id: number
    budgetId: number
    amount: number
    description: string
    transactionDate: string
    paymentMethod: string
    createdAt: string
    updatedAt: string
}

export const budgetApi = createApi({
    reducerPath: 'budgetApi',
    baseQuery, // Adjust to your base URL
    tagTypes: ['Budget'],
    endpoints: (builder) => ({
        getBudgets: builder.query<Budget[], void>({
            query: () => 'Budget',
            providesTags: (result) =>
                result ?
                    [...result.map(({ id }) => ({ type: 'Budget' as const, id })), { type: 'Budget', id: 'LIST' }]
                    : [{ type: 'Budget', id: 'LIST' }],
        }),

        addBudget: builder.mutation<Budget, Partial<Budget>>({
            query: (newBudget) => ({
                url: 'Budget',
                method: 'POST',
                body: newBudget,
            }),
            invalidatesTags: [{ type: 'Budget', id: 'LIST' }],
        }),

        updateBudget: builder.mutation<Budget, Partial<Budget> & Pick<Budget, 'id'>>({
            query: ({ id, ...patch }) => ({
                url: `Budget/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Budget', id }],
        }),

        deleteBudget: builder.mutation<void, number>({
            query: (id) => ({
                url: `Budget/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Budget', id }],
        }),
        addExpense: builder.mutation<Expense, {
            budgetId: number
            amount: number
            description: string
            transactionDate: string
            paymentMethod: string
        }>({
            query: (body) => ({
                url: '/Expense',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useGetBudgetsQuery,
    useAddBudgetMutation,
    useUpdateBudgetMutation,
    useDeleteBudgetMutation,
    useAddExpenseMutation,
} = budgetApi;


