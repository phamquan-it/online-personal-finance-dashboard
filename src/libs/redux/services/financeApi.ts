import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './authApi'

export const financeApi = createApi({
    reducerPath: 'financeApi',
    baseQuery,
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
        getBudgetProgress: builder.query<BudgetProgress[], void>({
            query: () => 'Budget/progress-by-category',
            transformResponse: (response: RawBudgetProgress[]): BudgetProgress[] =>
                response.map(item => ({
                    label: item.categoryName,
                    value: item.totalSpent,
                    budget: item.budgetedAmount,
                })),
        }),
        getSavingsGoals: builder.query<
            Array<Goal>,
            void
        >({
            query: () => 'Saving/progress', // Match the backend route exactly
        }),


        getDebtSummary: builder.query<{
            remainingDebt: number;
            totalDebt: number;
            totalPaid: number;
            repaymentProgress: number;
            repaymentPlan: string;
        }, void>({
            query: () => 'Debt/summary',
        }),

    }),
})

export const {
    useGetFinancialOverviewQuery,
    useGetSpendingDistributionQuery,
    useGetBudgetProgressQuery,
    useGetSavingsGoalsQuery,
    useGetDebtSummaryQuery,
} = financeApi
