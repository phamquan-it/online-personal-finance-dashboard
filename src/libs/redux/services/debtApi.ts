// services/debtApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './authApi';

export const debtApi = createApi({
    reducerPath: 'debtApi',
    baseQuery,
    tagTypes: ['Debt'],
    endpoints: (builder) => ({
        getDebts: builder.query<Debt[], void>({
            query: () => 'Debt',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Debt' as const, id })),
                        { type: 'Debt', id: 'LIST' },
                    ]
                    : [{ type: 'Debt', id: 'LIST' }],
        }),

        getDebt: builder.query<Debt, number>({
            query: (id) => `Debt/${id}`,
            providesTags: (result, error, id) => [{ type: 'Debt', id }],
        }),

        addDebt: builder.mutation<Debt, CreateDebtRequest>({
            query: (body) => ({
                url: 'Debt',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Debt', id: 'LIST' }],
        }),

        updateDebt: builder.mutation<Debt, Debt>({
            query: ({ id, ...body }) => ({
                url: `Debt/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Debt', id }],
        }),

        deleteDebt: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `Debt/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Debt', id },
                { type: 'Debt', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetDebtsQuery,
    useGetDebtQuery,
    useAddDebtMutation,
    useUpdateDebtMutation,
    useDeleteDebtMutation,
} = debtApi;

