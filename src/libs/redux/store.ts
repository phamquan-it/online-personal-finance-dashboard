import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import { categoriesApi } from "./services/categoriesApi";
import { budgetApi } from "./services/budgetApi";
import { goalsApi } from "./services/goalsApi";
import { apiSlice } from "./services/investmentApi";
import { debtApi } from "./services/debtApi";
import { reportsApi } from "./services/reportsApi";
import { notificationsApi } from "./services/notificationsApi";
import { educationApi } from "./services/educationApi";
import { financeApi } from "./services/financeApi";
import { authApi } from "./services/authApi";
import { incomeApi } from "./services/incomeApi";
// ...

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [budgetApi.reducerPath]: budgetApi.reducer,
        [goalsApi.reducerPath]: goalsApi.reducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [debtApi.reducerPath]: debtApi.reducer,
        [reportsApi.reducerPath]: reportsApi.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,
        [educationApi.reducerPath]: educationApi.reducer,
        [financeApi.reducerPath]: financeApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [incomeApi.reducerPath]: incomeApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            categoriesApi.middleware,
            budgetApi.middleware,
            goalsApi.middleware,
            apiSlice.middleware,
            debtApi.middleware,
            reportsApi.middleware,
            notificationsApi.middleware,
            educationApi.middleware,
            financeApi.middleware,
            authApi.middleware,
            incomeApi.middleware
        ]),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
