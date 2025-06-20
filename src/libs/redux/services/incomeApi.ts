// src/features/api/incomeApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './authApi';

// You can adjust this baseQuery with your auth token
export const incomeApi = createApi({
  reducerPath: 'incomeApi',
  baseQuery,
  endpoints: (builder) => ({
    createIncome: builder.mutation({
      query: (body) => ({
        url: '/Income',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Export the hook
export const { useCreateIncomeMutation } = incomeApi;

