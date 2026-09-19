import { PROTOCOL_VERSION } from '@rn-studio/protocol';

export default function HomePage() {
  const signalCards = [
    {
      title: 'Network Telemetry',
      desc: 'Real-time interceptor capturing fetch/XHR with zero payload leaks.',
      tag: 'CAPPED BUFFER',
      status: 'Active',
      color: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    },
    {
      title: 'Console & Logs',
      desc: 'Preserves original console stdout while mirroring to internal bus.',
      tag: 'DEV ONLY',
      status: 'Ready',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      title: 'Navigation State',
      desc: 'Tracks screen transitions, route params, and back-stack anomalies.',
      tag: 'REDACTED PARAMS',
      status: 'Ready',
      color: 'text-violet-400',
      badgeBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    },
    {
      title: 'Device & Runtime',
      desc: 'Captures platform, Hermes memory stats, and OS runtime info.',
      tag: 'IMMUTABLE',
      status: 'Ready',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030712] text-slate-100 bg-grid selection:bg-cyan-500/30">
      {/* Ambient Lighting Gradients */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl" />
      
      {/* Header / Nav */}
      <header className="sticky top-0 z-20 w-full border-b border-white/[0.08] bg-[#030712]/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-cyan-500/25">
              RN
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-base">RN Studio</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-400 font-mono">
                v{PROTOCOL_VERSION}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-400 font-mono tracking-wide">
                SYSTEM ONLINE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
        
        {/* Hero Section */}
        <section className="flex flex-col gap-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-cyan-400">
            <span>●</span> AI-REASONING TELEMETRY PLATFORM
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Developer observability for <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">React Native</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Install one client SDK, inspect your app locally via draggable in-app bubble, stream live sessions over WebSockets, and let AI explain what went wrong.
          </p>
        </section>

        {/* Signals Overview Grid */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase font-mono">
              Core Observability Signals
            </h2>
            <span className="text-xs text-slate-500 font-mono">Phase 0 Baseline</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {signalCards.map((card) => (
              <div
                key={card.title}
                className="glass-panel rounded-xl p-5 flex flex-col justify-between gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/5 group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${card.badgeBg}`}>
                      {card.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {card.status}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Collector: Pending</span>
                  <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Status Panel */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Monorepo Topology Connected</h3>
            </div>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Fastify ingestion (<span className="text-cyan-300 font-mono">:4000</span>), Next.js dashboard (<span className="text-cyan-300 font-mono">:3000</span>), and mobile SDK bound to protocol schema <span className="text-white font-mono">v{PROTOCOL_VERSION}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-500">Event Buffer</span>
              <span className="text-sm font-semibold font-mono text-white">500 Capped</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-500">Redaction</span>
              <span className="text-sm font-semibold font-mono text-emerald-400">Strict Auth/Tokens</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-xs text-slate-600 font-mono">
        RN Studio Platform • Monorepo Architecture Verified
      </footer>
    </div>
  );
}