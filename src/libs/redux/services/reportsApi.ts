// lib/reportsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";

export const reportsApi = createApi({
    reducerPath: "reportsApi",
    baseQuery,
    endpoints: (builder) => ({
        getIncomeHistory: builder.query<
            Array<{ date: string; income: number }>,
            void
        >({
            query: () => "Income/income-history",
        }),
    }),
});

export const { useGetIncomeHistoryQuery } = reportsApi;
