import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Wallet, Plus, IndianRupee, ShieldCheck } from 'lucide-react'
import { useAuth } from '#core/hooks/useAuth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../api'
import { cn } from '#lib/utils'

declare global {
    interface Window {
        Razorpay: any
    }
}

function getUserIdFromToken(token: string | null) {
    if (!token) return ''
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.userId || payload.id || payload.sub || ''
    } catch {
        return ''
    }
}

export default function AddMoney() {
    const { token } = useAuth()
    const userId = getUserIdFromToken(token)

    const queryClient = useQueryClient()
    const { data: wallet, isLoading: isWalletLoading } = useQuery({
        queryKey: ['wallet', userId],
        queryFn: () => api.getWallet(userId),
        enabled: !!userId,
    })

    // Pre-set amounts
    const presetAmounts = [500, 1000, 2000, 5000]
    const [amount, setAmount] = useState<string>('1000')
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const handleRecharge = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setSuccessMsg('')

        const numAmount = parseInt(amount)
        if (isNaN(numAmount) || numAmount <= 0) {
            setErrorMsg('Please enter a valid amount')
            return
        }

        try {
            setIsProcessing(true)

            // 1. Create order
            const orderData = await api.createRechargeOrder(userId, numAmount)

            // 2. Open Razorpay checkout
            const rzp = new window.Razorpay({
                key: orderData.keyId,
                order_id: orderData.orderId,
                amount: orderData.amount,
                currency: 'INR',
                name: 'Odoo Rides',
                description: 'Wallet Recharge',
                handler: async (response: any) => {
                    try {
                        // 3. Verify on backend
                        await api.verifyRecharge({
                            ...response,
                            userId,
                            amount: numAmount,
                        })
                        // 4. Refresh wallet balance in UI
                        queryClient.invalidateQueries({ queryKey: ['wallet', userId] })
                        setSuccessMsg(`Successfully recharged your wallet by ₹${numAmount}`)
                        setAmount('')
                    } catch (err: any) {
                        setErrorMsg('Payment verification failed')
                    } finally {
                        setIsProcessing(false)
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false)
                    }
                }
            })

            rzp.on('payment.failed', () => {
                setIsProcessing(false)
                setErrorMsg('Payment failed or was cancelled')
            })

            rzp.open()
        } catch (err: any) {
            setIsProcessing(false)
            setErrorMsg(err?.response?.data?.error || 'Failed to initiate recharge')
        }
    }

    return (
        <main className="min-h-[600px] flex bg-card rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 m-4 lg:mx-auto lg:my-8 max-w-[1000px] border border-border/50">
            {/* Left panel: Form */}
            <div className="flex-1 p-8 lg:p-12 border-r border-border flex flex-col">
                <Link to="/" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8 w-fit">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>

                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        Add Money<span className="text-primary">.</span>
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground mt-2">Recharge your wallet to book rides seamlessly.</p>
                </div>

                <form onSubmit={handleRecharge} className="flex flex-col flex-1">
                    <div className="space-y-6 flex-1">
                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recharge Amount</label>
                            <div className="relative group">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full bg-muted/30 border border-border rounded-xl pl-12 pr-4 py-4 text-base font-bold focus:outline-none focus:border-primary/50 focus:bg-background transition-all"
                                />
                            </div>
                        </div>

                        {/* Quick Amounts */}
                        <div className="grid grid-cols-4 gap-3 pt-2">
                            {presetAmounts.map((amt) => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setAmount(amt.toString())}
                                    className={cn(
                                        "py-2.5 rounded-lg border font-bold text-sm transition-all text-center",
                                        amount === amt.toString()
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card text-foreground hover:border-primary/50 border-border"
                                    )}
                                >
                                    ₹{amt}
                                </button>
                            ))}
                        </div>

                        {errorMsg && (
                            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                                {errorMsg}
                            </div>
                        )}

                        {successMsg && (
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                                {successMsg}
                            </div>
                        )}
                    </div>

                    <div className="pt-8 mt-auto">
                        <button
                            type="submit"
                            disabled={isProcessing || !amount || parseInt(amount) <= 0}
                            className="w-full rounded-xl bg-primary px-4 py-4 text-sm font-extrabold text-primary-foreground hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" /> Proceed to Pay ₹{amount || 0}
                                </>
                            )}
                        </button>
                        <div className="flex items-center justify-center gap-1.5 mt-4 text-muted-foreground text-xs font-medium">
                            <ShieldCheck className="w-4 h-4" /> Secured by Razorpay
                        </div>
                    </div>
                </form>
            </div>

            {/* Right panel: Wallet Status */}
            <div className="hidden lg:flex w-[350px] bg-[#f4f3ed] flex-col p-8 items-center justify-center relative relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Wallet className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Available Balance</h2>

                {isWalletLoading ? (
                    <div className="h-10 w-32 bg-muted rounded animate-pulse" />
                ) : (
                    <div className="text-5xl font-black tracking-tight text-foreground flex items-center">
                        <span className="text-3xl items-start font-bold text-muted-foreground mr-1">₹</span>
                        {wallet?.balance?.toLocaleString('en-IN') || '0'}
                    </div>
                )}
            </div>
        </main>
    )
}
