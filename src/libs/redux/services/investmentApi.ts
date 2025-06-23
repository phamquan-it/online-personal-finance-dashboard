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

export const { useCreateInvestmentMutation } = investmentApi;

