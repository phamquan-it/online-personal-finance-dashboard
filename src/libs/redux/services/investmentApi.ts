// src/services/investmentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './authApi';

export const investmentApi = createApi({
    reducerPath: 'investmentApi',
    baseQuery,
    endpoints: (builder) => ({
        createInvestment: builder.mutation<Investment, CreateInvestmentRequest>({
            query: (investment) => ({
                url: 'Investment',
                method: 'POST',
                body: investment,
            }),
        }),
        getInvestmentPortfolios: builder.query<InvestmentPortfolio[], void>({
            query: () => 'InvestmentPortfolio',
        }),
        createInvestmentPortfolio: builder.mutation<InvestmentPortfolio, CreateInvestmentPortfolioRequest>({
            query: (body) => ({
                url: '/InvestmentPortfolio',
                method: 'POST',
                body,
            }),
        }),
        getAssetAllocation: builder.query<
            Array<{ name: string; value: number }>,
            void
        >({
            query: () => 'InvestmentPortfolio/asset-allocation',
        }),
        addInvestmentPriceHistory: builder.mutation<
            AddInvestmentPriceHistoryResponse,
            AddInvestmentPriceHistoryRequest
        >({
            query: ({ investmentId, recordedDate, price }) => ({
                url: `Investment/${investmentId}`,
                method: 'POST',
                body: {
                    investmentId,
                    recordedDate,
                    price,
                },
            }),
        }),
        getInvestmentById: builder.query<InvestmentDetail, number>({
            query: (id) => `Investment/${id}`,
        }),
    }),
});

export const {
    useCreateInvestmentMutation,
    useCreateInvestmentPortfolioMutation,
    useGetInvestmentPortfoliosQuery,
    useGetAssetAllocationQuery
} = investmentApi;

