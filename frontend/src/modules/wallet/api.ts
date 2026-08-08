import client from '#core/api/client'
import { ENDPOINTS } from '#core/api/endpoints'

export interface RechargeOrder {
    orderId: string
    amount: number
    currency: string
    keyId: string
}

export async function createRechargeOrder(userId: string, amount: number) {
    const { data } = await client.post<{ success: boolean; data: RechargeOrder }>(
        ENDPOINTS.WALLET.CREATE_RECHARGE,
        { userId, amount }
    )
    return data.data
}

export async function verifyRecharge(payload: any) {
    const { data } = await client.post(ENDPOINTS.WALLET.VERIFY_RECHARGE, payload)
    return data
}

export async function getWallet(userId: string) {
    const { data } = await client.get(ENDPOINTS.WALLET.GET(userId))
    return data.data
}
