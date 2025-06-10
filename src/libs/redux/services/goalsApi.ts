// store/api/goalsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Goal {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  deadline: string // ISO string
}

export const goalsApi = createApi({
  reducerPath: 'goalsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Goals'],
  endpoints: (builder) => ({
    getGoals: builder.query<Goal[], void>({
      query: () => 'goals',
      providesTags: ['Goals'],
    }),
    addGoal: builder.mutation<Goal, Partial<Goal>>({
      query: (goal) => ({
        url: 'goals',
        method: 'POST',
        body: goal,
      }),
      invalidatesTags: ['Goals'],
    }),
  }),
})

export const { useGetGoalsQuery, useAddGoalMutation } = goalsApi

