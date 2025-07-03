import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './authApi'

export const investmentApi = createApi({
    reducerPath: 'investmentApi',
    baseQuery,
    tagTypes: ['Investment', 'Portfolio', 'AssetAllocation'],
    endpoints: (builder) => ({
        // ───── INVESTMENTS ───────────────────────────────────────────────
        getInvestments: builder.query<Investment[], void>({
            query: () => 'Investment',
            providesTags: ['Investment'],
        }),
        getInvestmentsByPortfolio: builder.query<Investment[], number>({
            query: (portfolioId) => `Investment?portfolioId=${portfolioId}`,
            providesTags: ['Investment'],
        }),

        getInvestmentById: builder.query<InvestmentDetail, number | string>({
            query: (id) => `Investment/${id}`,
            providesTags: (result, error, id) => [{ type: 'Investment', id }],
        }),

        createInvestment: builder.mutation<Investment, CreateInvestmentRequest>({
            query: (investment) => ({
                url: 'Investment',
                method: 'POST',
                body: investment,
            }),
            invalidatesTags: ['Investment', 'AssetAllocation'],
        }),

        updateInvestment: builder.mutation<
            Investment,
            Partial<Investment> & { id: number | string }
        >({
            query: ({ id, ...patch }) => ({
                url: `Investment/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Investment', id },
                'AssetAllocation',
            ],
        }),

        deleteInvestment: builder.mutation<void, number | string>({
            query: (id) => ({
                url: `Investment/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Investment', id },
                'AssetAllocation',
            ],
        }),

        addInvestmentPriceHistory: builder.mutation<
            AddInvestmentPriceHistoryResponse,
            AddInvestmentPriceHistoryRequest
        >({
            query: ({ investmentId, recordedDate, price }) => ({
                url: `Investment/${investmentId}`,
                method: 'POST',
                body: { investmentId, recordedDate, price },
            }),
            invalidatesTags: (result, error, { investmentId }) => [
                { type: 'Investment', id: investmentId },
            ],
        }),

        // ───── PORTFOLIOS ───────────────────────────────────────────────
        getInvestmentPortfolios: builder.query<InvestmentPortfolio[], void>({
            query: () => 'InvestmentPortfolio',
            providesTags: ['Portfolio'],
        }),

        createInvestmentPortfolio: builder.mutation<
            InvestmentPortfolio,
            CreateInvestmentPortfolioRequest
        >({
            query: (body) => ({
                url: 'InvestmentPortfolio',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Portfolio'],
        }),

        // ───── ASSET ALLOCATION ─────────────────────────────────────────
        getAssetAllocation: builder.query<
            Array<{ name: string; value: number }>,
            void
        >({
            query: () => 'InvestmentPortfolio/asset-allocation',
            providesTags: ['AssetAllocation'],
        }),
        // --- UPDATE ---
        updateInvestmentPortfolio: builder.mutation<
            any, // response type
            { id: number; name?: string; description?: string }
        >({
            query: ({ id, ...body }) => ({
                url: `InvestmentPortfolio/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Portfolio'],
        }),
        getPortfolioPerformance: builder.query<{
            portfolioPerformance: {
                portfolioId: number
                name: string
                totalInvested: number
                currentValue: number
                performance: number
            }
            investments: Investment[]
        }, number>({
            query: (portfolioId) => `InvestmentPortfolio/${portfolioId}`,
            providesTags: ['Investment'],
        }),

        // --- DELETE ---
        deleteInvestmentPortfolio: builder.mutation<void, number>({
            query: (id) => ({
                url: `InvestmentPortfolio/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Portfolio'],
        }),
    }),
})

export const {
    // Investment
    useGetInvestmentsByPortfolioQuery,
    useGetInvestmentsQuery,
    useGetInvestmentByIdQuery,
    useCreateInvestmentMutation,
    useUpdateInvestmentMutation,
    useDeleteInvestmentMutation,
    useAddInvestmentPriceHistoryMutation,

    // Portfolio
    useGetInvestmentPortfoliosQuery,
    useCreateInvestmentPortfolioMutation,
    useUpdateInvestmentPortfolioMutation,
    useDeleteInvestmentPortfolioMutation,
    useGetPortfolioPerformanceQuery,
    // Asset Allocation
    useGetAssetAllocationQuery,
} = investmentApi

