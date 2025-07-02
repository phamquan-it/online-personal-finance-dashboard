interface Budget {
    category: string;
    id: number;
    categoryId: number;
    budgetType: 'monthly' | 'yearly' | 'annual'; // adjust if you have other types
    amount: number;
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    alertThreshold: number;
    totalExpense: number;
}

interface Category {
    id?: number;
    key: string
    name: string
    description?: string,
    expensePercentage?: number,
}

interface Tip {
    id: string
    title: string
    content: string
}

interface Video {
    id: string
    title: string
    description: string
    thumbnail: string
}

interface Tool {
    id: string
    title: string
    link: string
}
interface ForgotPasswordFormValues {
    email: string;
}


interface Goal {
    id: number;
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string; // or Date, depending on how you handle it
    goalType: 'savings' | 'investment' | string; // adjust if you have fixed types
    isCompleted: boolean;
}

interface GoalFormValues {
    name: string
    targetAmount: number
    savedAmount?: number
    deadline: any
}

interface InvestmentFormValues {
    name: string
    type: 'Stock' | 'Bond' | 'Real Estate' | 'Crypto' | 'Other'
    amount: number
    returnRate: number
}

// src/types/investment.ts

interface Investment {
    id: number;
    portfolioId: number;
    name: string;
    assetType: string; // You can make this a union: 'stock' | 'crypto' | 'real_estate' etc.
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
    purchaseDate: string; // ISO date string
    createdAt: string;
    updatedAt: string | null;
    investmentPriceHistories: InvestmentPriceHistory[];
    portfolio: any | null; // You can type this if you have a Portfolio interface
}

interface InvestmentPriceHistory {
    id: number;
    investmentId: number;
    recordedDate: string; // ISO date string
    price: number;
    createdAt: string;
    updatedAt: string | null;
}

interface CreateInvestmentRequest {
    portfolioId: number;
    name: string;
    assetType: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
    purchaseDate: string; // ISO date
}

interface LoginFormValues {
    email: string;
    password: string;
}

// types/notification.ts
interface Notification {
    id: number;
    userId: number;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}


interface ProfileFormValues {
    name: string;
    email: string;
    password?: string;
}

interface RegisterFormValues {
    fullname: string;
    email: string;
    password: string;
    confirm: string;
}


interface IncomeData {
    date: string;     // e.g., '2025-05'
    income: number;   // e.g., 5000000
}

interface ExpenseData {
    category: string; // e.g., 'Rent', 'Food'
    value: number;    // e.g., 1500000
}

interface ReportResponse {
    incomeData: IncomeData[];
    expenseData: ExpenseData[];
}


interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    avatarUrl?: string
}

interface RegisterRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    userName: string;
    password: string;
}

interface RegisterResponse {
    message: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        userName: string;
    };
}
interface Contribution {
    id: number;
    savingId: number;
    amount: number;
    contributionDate: string; // ISO
    note: string;
    createdAt: string;
    updatedAt: string | null;
}
interface AddInvestmentPriceHistoryRequest {
    investmentId: number;
    recordedDate: string;
    price: number;
}

interface AddInvestmentPriceHistoryResponse {
    message: string;
    data: Investment;
}

// src/types/investment.ts
interface InvestmentDetail {
    portfolioId: number;
    name: string;
    assetType: string;
    totalInvested: number;
    currentValue: number;
    performance: number;
    purchaseDate: string;
    priceHistory: InvestmentPriceHistory[];
}
interface CreatePortfolioRequest {
    name: string;
    description: string;
}

interface Portfolio {
    id: number;
    userId: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
    user?: any; // optional, if you have a User type you can replace this
}

interface Debt {
    id: number;
    userId: number;
    debtName: string;
    debtType: string;
    totalAmount: number;
    remainingAmount: number;
    interestRate: number;
    minimumPayment: number;
    paymentFrequency: string;
    dueDate: string;
    isCompleted: boolean;
}

interface CreateDebtRequest {
    debtName: string;
    debtType: string;
    totalAmount: number;
    remainingAmount: number;
    interestRate: number;
    minimumPayment: number;
    paymentFrequency: string;
    dueDate: string;
}
interface MonthlySummary {
    year: number;
    month: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    totalSavings: number;
    investmentGainLoss: number;
    investmentPercentChange: string;
    incomeTax: number;
}

interface InvestmentPortfolio {
    id: number;
    userId: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
    user: any | null;
}

interface CreateInvestmentPortfolioRequest {
    name: string;
    description: string;
}

interface IncomeTotal {
    today: number;
    month: number;
    year: number;
    all: number;
}

interface RawBudgetProgress {
    categoryId: number
    categoryName: string
    budgetedAmount: number
    totalSpent: number
    progressPercentage: number
}

interface BudgetProgress {
    label: string
    value: number
    budget: number
}


// src/features/api/types.ts
interface InvestmentPortfolio {
    id: number
    name: string
    totalInvested: number
    currentValue: number
    performance: number
    investmentCount: number
}

interface CreateInvestmentPortfolioDto {
    name: string
    description?: string
}

interface UpdateInvestmentPortfolioDto {
    name?: string
    description?: string
}

interface InvestmentPortfolioPerformanceDto {
    portfolioId: number
    totalInvested: number
    currentValue: number
    performance: number
}

interface InvestmentDto {
    id: number
    name: string
    purchasePrice: number
    currentPrice: number
    quantity: number
}

interface InvestmentPortfolioPerformanceResponse {
    portfolioPerformance: InvestmentPortfolioPerformanceDto
    investments: InvestmentDto[]
}

