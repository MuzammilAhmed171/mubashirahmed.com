export default function SkeletonPortfolio() {
  return (
    <div className="relative min-h-screen bg-black font-sans text-white antialiased overflow-x-hidden select-none">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-[38rem] w-[38rem] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.08)_0%,transparent_70%)] animate-pulse"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 h-[32rem] w-[32rem] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.06)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-2/3 h-[34rem] w-[34rem] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.04)_0%,transparent_70%)]"
      />

      {/* Reusable Shimmer Component */}
      {/* 1. Header / Navbar Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-white/5 bg-black/50">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-32 rounded-lg bg-white/[0.08] overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
          </div>
          <div className="h-2 w-2 rounded-full bg-accent animate-ping" />
        </div>
        <div className="hidden md:flex items-center gap-7">
          {[48, 56, 64, 52, 60, 44].map((width, i) => (
            <div
              key={i}
              style={{ width: `${width}px` }}
              className="relative h-4 rounded bg-white/[0.06] overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
            </div>
          ))}
        </div>
        <div className="relative h-10 w-28 rounded-full border border-white/10 bg-white/[0.05] overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
        </div>
      </header>

      {/* 2. Hero Section Skeleton */}
      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pt-36 pb-20 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-16 min-h-[85vh]">
        {/* Left Side */}
        <div className="space-y-6">
          {/* Greeting badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/[0.05] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <div className="relative h-3.5 w-32 rounded bg-accent/25 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            </div>
          </div>

          {/* Headline Name */}
          <div className="space-y-3 pt-2">
            <div className="relative h-14 w-4/5 max-w-lg rounded-2xl bg-white/[0.12] overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
            </div>
            <div className="relative h-11 w-3/5 max-w-md rounded-xl bg-accent/[0.22] overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
            </div>
          </div>

          {/* Role & Bio paragraphs */}
          <div className="space-y-3 pt-3 max-w-lg">
            <div className="relative h-4 w-full rounded bg-white/[0.08] overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
            </div>
            <div className="relative h-4 w-11/12 rounded bg-white/[0.07] overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
            </div>
            <div className="relative h-4 w-3/4 rounded bg-white/[0.06] overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className="relative h-12 w-36 rounded-full bg-accent/[0.25] overflow-hidden border border-accent/30">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            </div>
            <div className="relative h-12 w-36 rounded-full border border-white/15 bg-white/[0.04] overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
            </div>
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Orbital Emblem Placeholder */}
        <div className="hidden lg:flex items-center justify-center relative h-96">
          <div className="h-80 w-80 rounded-full border border-dashed border-accent/25 animate-spin-slow flex items-center justify-center">
            <div className="h-56 w-56 rounded-full border border-white/10 animate-pulse flex items-center justify-center bg-white/[0.02]">
              <div className="h-24 w-24 rounded-full bg-accent/15 flex items-center justify-center border border-accent/35 shadow-[0_0_30px_rgba(255,193,7,0.25)]">
                <span className="h-4 w-4 rounded-full bg-accent animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Banner Skeleton (Yellow Glow) */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-accent/25 bg-accent/[0.04] shadow-[0_0_35px_rgba(255,193,7,0.08)]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 space-y-2.5">
              <div className="relative h-9 w-20 rounded-lg bg-accent/25 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
              </div>
              <div className="relative h-3.5 w-28 rounded bg-white/[0.10] overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. About Section Skeleton */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center space-y-3 mb-14">
          <div className="relative h-4 w-28 rounded-full bg-accent/20 overflow-hidden" />
          <div className="relative h-10 w-52 rounded-xl bg-white/[0.12] overflow-hidden" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Image Skeleton */}
          <div className="relative aspect-[4/5] max-w-md mx-auto w-full rounded-3xl border border-white/10 bg-white/[0.04] p-4 overflow-hidden">
            <div className="w-full h-full rounded-2xl bg-white/[0.06] overflow-hidden relative">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
            </div>
          </div>

          {/* About Info & Skills Skeleton */}
          <div className="space-y-6">
            <div className="relative h-7 w-3/4 rounded-lg bg-white/[0.10] overflow-hidden" />
            <div className="space-y-2.5">
              <div className="relative h-4 w-full rounded bg-white/[0.06] overflow-hidden" />
              <div className="relative h-4 w-11/12 rounded bg-white/[0.06] overflow-hidden" />
              <div className="relative h-4 w-4/5 rounded bg-white/[0.06] overflow-hidden" />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 rounded-xl border border-white/5 bg-white/[0.03] space-y-2">
                  <div className="h-3 w-16 rounded bg-white/10" />
                  <div className="h-4 w-24 rounded bg-accent/20" />
                </div>
              ))}
            </div>

            {/* Skill Bars */}
            <div className="space-y-4 pt-2">
              {[85, 92, 78].map((pct, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3.5 w-32 rounded bg-white/10" />
                    <div className="h-3.5 w-10 rounded bg-accent/20" />
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full rounded-full bg-accent/30 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Projects Section Skeleton */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <div className="relative h-4 w-24 rounded-full bg-accent/20 overflow-hidden" />
          <div className="relative h-10 w-48 rounded-xl bg-white/[0.12] overflow-hidden" />
          <div className="flex gap-2 pt-4">
            {[64, 80, 72, 76].map((w, i) => (
              <div key={i} style={{ width: `${w}px` }} className="h-8 rounded-full bg-white/[0.06] border border-white/10" />
            ))}
          </div>
        </div>

        {/* 6 Project Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden p-4 space-y-4"
            >
              <div className="relative aspect-[16/10] rounded-xl bg-white/[0.07] overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
              </div>
              <div className="space-y-2">
                <div className="relative h-5 w-3/4 rounded-md bg-white/[0.12] overflow-hidden" />
                <div className="relative h-3.5 w-full rounded bg-white/[0.05] overflow-hidden" />
                <div className="relative h-3.5 w-4/5 rounded bg-white/[0.05] overflow-hidden" />
              </div>
              <div className="flex gap-2 pt-1">
                {[1, 2, 3].map((t) => (
                  <div key={t} className="h-5 w-14 rounded-full bg-accent/[0.10] border border-accent/20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Work Experience & Certifications Skeleton */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <div className="relative h-4 w-28 rounded-full bg-accent/20 overflow-hidden" />
          <div className="relative h-10 w-56 rounded-xl bg-white/[0.12] overflow-hidden" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-48 rounded bg-white/[0.12]" />
                  <div className="h-5 w-20 rounded-full bg-accent/20" />
                </div>
                <div className="h-4 w-36 rounded bg-white/[0.08]" />
                <div className="h-3.5 w-80 max-w-full rounded bg-white/[0.05]" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((t) => (
                  <div key={t} className="h-6 w-16 rounded bg-white/[0.05] border border-white/10" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Reviews / Testimonials Skeleton */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <div className="relative h-4 w-24 rounded-full bg-accent/20 overflow-hidden" />
          <div className="relative h-10 w-44 rounded-xl bg-white/[0.12] overflow-hidden" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/[0.08] overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 w-24 rounded bg-white/[0.12]" />
                  <div className="h-3 w-32 rounded bg-white/[0.06]" />
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="h-3.5 w-3.5 rounded-sm bg-accent/30" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-white/[0.06]" />
                <div className="h-3.5 w-11/12 rounded bg-white/[0.06]" />
                <div className="h-3.5 w-4/5 rounded bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Contact & Footer Skeleton */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-10 p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="h-8 w-44 rounded-xl bg-white/[0.12]" />
            <div className="h-4 w-64 rounded bg-white/[0.06]" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="h-10 w-10 rounded-lg bg-accent/15" />
                  <div className="space-y-1">
                    <div className="h-3 w-16 rounded bg-white/10" />
                    <div className="h-4 w-36 rounded bg-white/[0.12]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 rounded-xl border border-white/10 bg-white/[0.04]" />
              <div className="h-12 rounded-xl border border-white/10 bg-white/[0.04]" />
            </div>
            <div className="h-12 rounded-xl border border-white/10 bg-white/[0.04]" />
            <div className="h-28 rounded-xl border border-white/10 bg-white/[0.04]" />
            <div className="h-12 w-full rounded-xl bg-accent/25 border border-accent/30" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="h-6 w-32 rounded bg-white/10" />
          <div className="flex gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-3.5 w-14 rounded bg-white/[0.06]" />
            ))}
          </div>
          <div className="h-3.5 w-40 rounded bg-white/[0.05]" />
        </div>
      </section>
    </div>
  );
}
