import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './authApi';

export const goalsApi = createApi({
    reducerPath: 'goalsApi',
    baseQuery,
    tagTypes: ['Goals'],
    endpoints: (builder) => ({
        getGoals: builder.query<Goal[], void>({
            query: () => '/Saving',
            providesTags: ['Goals'],
        }),
        addGoal: builder.mutation<Goal, Partial<Goal>>({
            query: (body) => ({
                url: '/Saving',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Goals'],
        }),
        updateGoal: builder.mutation<{ message: string; data: Goal }, Partial<Goal> & Pick<Goal, 'id'>>({
            query: ({ id, ...body }) => ({
                url: `/Saving/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Goals'],
        }),
        deleteGoal: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/Saving/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Goals'],
        }),
        addContribution: builder.mutation<
            { message: string; data: { contribution: Contribution; saving: Goal } },
            { savingId: number; amount: number; contributionDate: string; note: string }
        >({
            query: ({ savingId, ...body }) => ({
                url: `/Saving/${savingId}/contribution`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Goals'],
        }),
    }),
});

export const {
    useGetGoalsQuery,
    useAddGoalMutation,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
    useAddContributionMutation,
} = goalsApi;

