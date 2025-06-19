// src/services/authApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base API
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://personal-finance-dashboard.somee.com/api', // <-- update this
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // ✅ POST /api/Auth/login
        login: builder.mutation<{ token: string }, { userName: string; password: string }>({
            query: (credentials) => ({
                url: 'Auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (newUser) => ({
                url: 'Auth/register',
                method: 'POST',
                body: newUser,
            }),
        }),
        // ✅ GET /api/Auth/profile (requires Bearer token)
        getProfile: builder.query<UserProfile, void>({
            query: () => 'Auth/profile',
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useLoginMutation,
    useRegisterMutation,
    useGetProfileQuery,
} = authApi;

