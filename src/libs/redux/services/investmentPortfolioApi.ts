// src/features/api/investmentPortfolioApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './authApi';

export const investmentPortfolioApi = createApi({
    reducerPath: 'investmentPortfolioApi',
    baseQuery,
    tagTypes: ['Portfolio'],
    endpoints: (builder) => ({
        getAllPortfolios: builder.query<InvestmentPortfolio[], void>({
            query: () => 'investmentportfolio',
            providesTags: ['Portfolio'],
        }),
        getPortfolioById: builder.query<InvestmentPortfolioPerformanceResponse, number>({
            query: (id) => `investmentportfolio/${id}`,
        }),
        createPortfolio: builder.mutation<InvestmentPortfolio, CreateInvestmentPortfolioDto>({
            query: (body) => ({
                url: 'investmentportfolio',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Portfolio'],
        }),
        updatePortfolio: builder.mutation<InvestmentPortfolio, { id: number; body: UpdateInvestmentPortfolioDto }>({
            query: ({ id, body }) => ({
                url: `investmentportfolio/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Portfolio'],
        }),
        deletePortfolio: builder.mutation<void, number>({
            query: (id) => ({
                url: `investmentportfolio/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Portfolio'],
        }),
    }),
})

export const {
    useGetAllPortfoliosQuery,
    useGetPortfolioByIdQuery,
    useCreatePortfolioMutation,
    useUpdatePortfolioMutation,
    useDeletePortfolioMutation,
} = investmentPortfolioApi

