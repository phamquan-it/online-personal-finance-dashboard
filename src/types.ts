interface Budget {
    id: string
    category: string
    amount: number
    spent: number
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

interface Category {
    key: string
    name: string
    description?: string
    amount?: number
}
interface Debt {
    id?: string | number
    key: string
    type: string
    name: string
    total: number
    paid: number
    monthlyPayment: number
    dueDate: string
    startDate?: string
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

interface Investment extends InvestmentFormValues {
    id: string
}

interface LoginFormValues {
    email: string;
    password: string;
}

type NotificationType =
    | "budget_exceeded"
    | "bill_due"
    | "upcoming_payment"
    | "investment_change"
    | "savings_opportunity";

interface Notification {
    id: string;
    ntitle: string;
    description: string;
    time: string;
    type: NotificationType;
    read?: boolean;
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



