export enum Path {
  HOME = '/',
  
  // Authentication & Profile
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  PROFILE_SETTINGS = '/profile/settings',
  SECURITY_SETTINGS = '/profile/security',

  // Dashboard & Overview
  DASHBOARD = '/dashboard',
  FINANCIAL_SUMMARY = '/dashboard/summary',
  NET_WORTH = '/dashboard/net-worth',

  // Expense Management
  EXPENSE_LIST = '/expenses',
  ADD_EXPENSE = '/expenses/add',
  EDIT_EXPENSE = '/expenses/edit/:id',
  EXPENSE_CATEGORIES = '/expenses/categories',
  EXPENSE_ANALYTICS = '/expenses/analytics',

  // Budget Management
  BUDGET_OVERVIEW = '/budgets',
  CREATE_BUDGET = '/budgets/create',
  EDIT_BUDGET = '/budgets/edit/:id',
  BUDGET_TRACKING = '/budgets/tracking/:id',
  BUDGET_ALERTS = '/budgets/alerts',

  // Goals Management
  GOALS_OVERVIEW = '/goals',
  CREATE_GOAL = '/goals/create',
  EDIT_GOAL = '/goals/edit/:id',
  GOAL_TRACKING = '/goals/tracking/:id',
  SAVINGS_CALCULATOR = '/goals/savings-calculator',

  // Investment Management
  INVESTMENT_PORTFOLIO = '/investments/portfolios',
  ADD_INVESTMENT = '/investments/add',
  EDIT_INVESTMENT = '/investments/edit/:id',
  INVESTMENT_ANALYTICS = '/investments/analytics',
  ASSET_ALLOCATION = '/investments/asset-allocation',
  INVESTMENT_SIMULATOR = '/investments/simulator',

  // Debt Management
  DEBT_OVERVIEW = '/debts',
  ADD_DEBT = '/debts/add',
  EDIT_DEBT = '/debts/edit/:id',
  DEBT_SCHEDULE = '/debts/schedule/:id',
  DEBT_REPAYMENT_PLAN = '/debts/repayment-plan/:id',
  DEBT_CALCULATOR = '/debts/calculator',

  // Reports & Analytics
  FINANCIAL_REPORTS = '/reports',
  TAX_ESTIMATION = '/reports/tax-estimation',
  SPENDING_TRENDS = '/reports/spending-trends',
  INCOME_EXPENSE_REPORT = '/reports/income-expense',

  // Notifications & Alerts
  NOTIFICATIONS = '/notifications',
  ALERT_SETTINGS = '/alerts/settings',
  BILL_REMINDERS = '/alerts/bills',

  // Educational Resources
  EDUCATION_HUB = '/education',
  TUTORIALS = '/education/tutorials',
  FINANCIAL_TIPS = '/education/tips',
  CALCULATORS = '/education/calculators',
}

