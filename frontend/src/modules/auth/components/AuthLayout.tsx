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

    {/* Floating cards */}
    <div className="absolute inset-0 z-10 hidden lg:block">
        {/* Ride matched card */}
        <div
            className="absolute top-[16%] right-[6%] w-64 rotate-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:rotate-0 animate-[float_6s_ease-in-out_infinite]"
        >
            <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white">
                    JD
                    <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-black bg-emerald-400" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">James D.</p>
                    <p className="truncate text-xs text-white/50">Toyota Camry &middot; 4 min away</p>
                </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/70">
                <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ride matched
            </div>
        </div>

        {/* Rating card */}
        <div
            className="absolute top-[46%] left-[2%] w-52 -rotate-2 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:rotate-0 animate-[float_7s_ease-in-out_infinite]"
            style={{ animationDelay: '1.2s' }}
        >
            <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.958c.299.921-.755 1.688-1.538 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.783.57-1.837-.197-1.538-1.118l1.287-3.958a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
                </svg>
                <span className="text-2xl font-black text-white">4.9</span>
            </div>
            <p className="mt-1 text-xs text-white/50">1,204+ rides completed</p>
        </div>

        {/* Live tracking card */}
        <div
            className="absolute bottom-[6%] right-[10%] w-56 rotate-1 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:rotate-0 animate-[float_5.5s_ease-in-out_infinite]"
            style={{ animationDelay: '0.6s' }}
        >
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-white/70">Live tracking</span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    LIVE
                </span>
            </div>
            <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="my-1 h-6 w-px border-l border-dashed border-white/20" />
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                </div>
                <div className="flex flex-1 flex-col justify-between text-xs">
                    <p className="text-white/80">HSR Layout</p>
                    <p className="text-white/80">Whitefield</p>
                </div>
            </div>
        </div>
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
