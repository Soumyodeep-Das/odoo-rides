import type { ReactNode } from 'react'

export function AuthLayout({ children, title, subtitle }: { children: ReactNode, title: string, subtitle: string }) {
    return (
        <main className="flex min-h-screen bg-background text-foreground">
            {/* Left pane: Animated glowing background */}
            <div className="relative hidden w-1/2 overflow-hidden bg-black lg:flex lg:flex-col lg:justify-between lg:p-12">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    {/* Glowing orbs */}
                    <div className="absolute -top-[10%] -left-[10%] h-[50vh] w-[50vh] animate-pulse rounded-full bg-violet-600/30 blur-[100px] hover:bg-violet-500/40 transition-colors duration-1000" />
                    <div className="absolute top-[40%] right-[10%] h-[40vh] w-[40vh] animate-pulse rounded-full bg-cyan-600/20 blur-[120px]" style={{ animationDelay: '1s' }} />
                    <div className="absolute -bottom-[20%] left-[20%] h-[60vh] w-[60vh] animate-pulse rounded-full bg-indigo-600/20 blur-[100px]" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2">
                        <img src="/favicon.png" alt="Odoo Rides Logo" className="h-8 w-8 object-contain" />
                        <span className="text-xl font-bold text-white tracking-widest">ODOO RIDES</span>
                    </div>
                </div>

                <div className="relative z-10 text-white/90">
                    <h2 className="text-4xl font-black mb-4 leading-tight tracking-tight">
                        Elevate your commute.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                            Seamlessly connected.
                        </span>
                    </h2>
                    <p className="text-xl max-w-md text-white/70">
                        Join the platform designed for professionals. Fast, secure, and always reliable.
                    </p>
                </div>
            </div>

            {/* Right pane: Form area */}
            <div className="flex w-full flex-col items-center justify-center lg:w-1/2 p-4 sm:p-8 relative">
                {/* Mobile background glows for cohesion */}
                <div className="absolute top-0 right-0 w-[30vh] h-[30vh] bg-indigo-500/10 blur-[80px] rounded-full lg:hidden pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[30vh] h-[30vh] bg-cyan-500/10 blur-[80px] rounded-full lg:hidden pointer-events-none" />

                <div className="w-full max-w-md space-y-8 z-10">
                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </main>
    )
}
