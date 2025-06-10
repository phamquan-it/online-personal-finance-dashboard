import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const financeApi = createApi({
    reducerPath: 'financeApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getFinancialOverview: builder.query<{
            totalIncome: number
            totalExpense: number
            savingsRate: number
            investmentAssets: number
        }, void>({
            query: () => 'financial-overview',
        }),
        getSpendingDistribution: builder.query<
            Array<{ category: string; value: number }>,
            void
        >({
            query: () => 'spending-distribution',
        }),
        getBudgetProgress: builder.query<
            Array<{ label: string; value: number; budget: number }>,
            void
        >({
            query: () => 'budget-progress',
        }),
        getSavingsGoals: builder.query<
            Array<{ name: string; current: number; target: number }>,
            void
        >({
            query: () => 'savings-goals',
        }),
        getDebtInfo: builder.query<{
            remainingDebt: number
            repaymentProgress: number
            repaymentPlan: string
        }, void>({
            query: () => 'debt-info',
        }),
    }),
})

export const {
    useGetFinancialOverviewQuery,
    useGetSpendingDistributionQuery,
    useGetBudgetProgressQuery,
    useGetSavingsGoalsQuery,
    useGetDebtInfoQuery,
} = financeApi
