import { useMemo, useState } from 'react'

export function useInvestments(initialData: Investment[] = []) {
    const [localData, setLocalData] = useState<Investment[]>(initialData)
    const [currentRecord, setCurrentRecord] = useState<Investment | null>(null)

    const allInvestments = [...localData]

    const totalValue = useMemo(
        () =>
            allInvestments.reduce(
                (acc, inv) => acc + inv.quantity * inv.currentPrice,
                0
            ),
        [allInvestments]
    )

    const totalCost = useMemo(
        () =>
            allInvestments.reduce(
                (acc, inv) => acc + inv.quantity * inv.purchasePrice,
                0
            ),
        [allInvestments]
    )

    const profit = totalValue - totalCost

    const assetAllocation = useMemo(() => {
        const result: Record<string, number> = {}
        for (const inv of allInvestments) {
            const value = inv.quantity * inv.currentPrice
            result[inv.assetType] = (result[inv.assetType] || 0) + value
        }
        return Object.entries(result).map(([name, value]) => ({ name, value }))
    }, [allInvestments])

    const addInvestment = (investment: Omit<Investment, 'id' | 'createdAt'>) => {
        const newItem: Investment = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            ...investment,
        }
        setLocalData(prev => [...prev, newItem])
    }

    const updateInvestment = (updated: Investment) => {
        setLocalData(prev =>
            prev.map(inv => (inv.id === updated.id ? updated : inv))
        )
    }

    const deleteInvestment = (id: number) => {
        setLocalData(prev => prev.filter(inv => inv.id !== id))
    }

    return {
        allInvestments,
        totalValue,
        totalCost,
        profit,
        assetAllocation,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        currentRecord,
        setCurrentRecord,
    }
}

// data/dummyInvestments.ts
export const dummyInvestments = [
    {
        id: 1,
        name: 'Apple Stock',
        portfolioId: 1,
        assetType: 'stock',
        quantity: 10,
        purchasePrice: 2000000,
        currentPrice: 2500000,
        purchaseDate: '2024-01-15',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: null,
        investmentPriceHistories: [],
        portfolio: undefined,
    },
    {
        id: 2,
        name: 'Bitcoin',
        portfolioId: 1,
        assetType: 'crypto',
        quantity: 0.5,
        purchasePrice: 600000000,
        currentPrice: 700000000,
        purchaseDate: '2023-10-01',
        createdAt: '2023-10-01T10:00:00Z',
        updatedAt: null,
        investmentPriceHistories: [],
        portfolio: undefined,
    },
    {
        id: 3,
        name: 'Vietnam Government Bond',
        portfolioId: 2,
        assetType: 'bond',
        quantity: 100,
        purchasePrice: 100000,
        currentPrice: 105000,
        purchaseDate: '2023-05-20',
        createdAt: '2023-05-20T09:00:00Z',
        updatedAt: null,
        investmentPriceHistories: [],
        portfolio: undefined,
    },
    {
        id: 4,
        name: 'Tech Mutual Fund',
        portfolioId: 2,
        assetType: 'mutual_fund',
        quantity: 200,
        purchasePrice: 50000,
        currentPrice: 52000,
        purchaseDate: '2024-04-10',
        createdAt: '2024-04-10T07:30:00Z',
        updatedAt: null,
        investmentPriceHistories: [],
        portfolio: undefined,
    },
    {
        id: 5,
        name: 'Sunshine Real Estate',
        portfolioId: 3,
        assetType: 'real_estate',
        quantity: 1,
        purchasePrice: 3_000_000_000,
        currentPrice: 3_300_000_000,
        purchaseDate: '2022-12-01',
        createdAt: '2022-12-01T08:00:00Z',
        updatedAt: null,
        investmentPriceHistories: [],
        portfolio: undefined,
    },
]

