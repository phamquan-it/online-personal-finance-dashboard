import { useMemo } from 'react'

interface ChartDataItem {
    name: string
    value: number
}

interface Investment {
    id: number
    name: string
    assetType: string
    quantity: number
    currentPrice: number
}

/**
 * Hook to calculate chart data based on asset allocation.
 * Groups total value by assetType.
 */
export function useAssetAllocationChartData(investments: Investment[]): ChartDataItem[] {
    return useMemo(() => {
        const group: Record<string, number> = {}

        for (const inv of investments) {
            const value = inv.quantity * inv.currentPrice
            if (!group[inv.assetType]) group[inv.assetType] = 0
            group[inv.assetType] += value
        }

        return Object.entries(group).map(([name, value]) => ({ name, value }))
    }, [investments])
}

