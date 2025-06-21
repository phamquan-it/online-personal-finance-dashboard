import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './authApi'

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => '/ExpenseCategory',
            providesTags: ['Category'],
        }),
        addCategory: builder.mutation<Category, Partial<Category>>({
            query: (body) => ({
                url: '/ExpenseCategory',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Category'],
        }),
        updateExpenseCategory: builder.mutation<Category, Partial<Category> & { id: number }>({
            query: ({ id, ...patch }) => ({
                url: `/ExpenseCategory/${id}`,
                method: 'PATCH',
                body: patch, // only name & description, no id
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation<{ key: string }, string>({
            query: (key) => ({
                url: `ExpenseCategory/${key}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
})

export const {
    useGetCategoriesQuery,
    useAddCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateExpenseCategoryMutation
} = categoriesApi

