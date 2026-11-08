export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Subtle tech grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:50px_50px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]"
      />

      {/* Clean, luxury ambient edge lighting using hardware-accelerated radial gradients */}
      <div className="absolute -left-48 top-1/4 h-[32rem] w-[32rem] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.035)_0%,transparent_70%)]" />
      <div className="absolute -right-48 top-2/3 h-[30rem] w-[30rem] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.03)_0%,transparent_70%)]" />
    </div>
  );
}
