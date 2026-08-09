import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cn } from '#lib/utils'
import { registerVehicle } from '../api'

export default function RegisterVehicle() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        make: '',
        carModel: '',
        color: '',
        year: new Date().getFullYear().toString(),
        seats: '4',
        regNo: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await registerVehicle({
                ...formData,
                year: Number(formData.year),
                seats: Number(formData.seats),
            })
            navigate('/')
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to register vehicle. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="container mx-auto px-4 py-8 space-y-8 max-w-2xl">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>

            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Register Vehicle</h1>
                <p className="text-muted-foreground mt-2">Add your vehicle to start offering rides. Your vehicle will be put in pending state and requires admin approval before you can offer rides.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="make" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Make (e.g. Honda)</label>
                            <input
                                required
                                type="text"
                                id="make"
                                name="make"
                                value={formData.make}
                                onChange={handleChange}
                                placeholder="e.g. Honda"
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="carModel" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Model (e.g. City)</label>
                            <input
                                required
                                type="text"
                                id="carModel"
                                name="carModel"
                                value={formData.carModel}
                                onChange={handleChange}
                                placeholder="e.g. City"
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="color" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Color</label>
                            <input
                                required
                                type="text"
                                id="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder="e.g. White"
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="year" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Year</label>
                            <input
                                required
                                type="number"
                                id="year"
                                name="year"
                                min="1990"
                                max={new Date().getFullYear()}
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="e.g. 2022"
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="seats" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total Seats Available</label>
                            <select
                                required
                                id="seats"
                                name="seats"
                                value={formData.seats}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="regNo" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Registration Number</label>
                            <input
                                required
                                type="text"
                                id="regNo"
                                name="regNo"
                                value={formData.regNo}
                                onChange={handleChange}
                                placeholder="e.g. WB 24 CX 4471"
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "rounded-xl bg-primary text-primary-foreground px-8 py-3 font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto",
                            loading && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {loading ? 'Submitting Registration...' : 'Submit for Admin Approval'}
                    </button>
                    <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                    </Link>
                </div>
            </form>
        </main >
    )
}
