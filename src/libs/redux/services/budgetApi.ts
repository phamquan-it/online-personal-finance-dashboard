// src/services/budgetApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './authApi';

export const budgetApi = createApi({
    reducerPath: 'budgetApi',
    baseQuery,
    tagTypes: ['Budget'],
    endpoints: (builder) => ({
        getBudgets: builder.query<Budget[], void>({
            query: () => 'Budget',
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Budget' as const, id })), { type: 'Budget', id: 'LIST' }]
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
                responseHandler: (response) => response.text(), // 👈 Thêm dòng này!
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Budget', id }],
        }),
        deleteBudget: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `Budget/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Budget', id }],
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetBudgetsQuery,
    useAddBudgetMutation,
    useUpdateBudgetMutation,
    useDeleteBudgetMutation,
} = budgetApi;

