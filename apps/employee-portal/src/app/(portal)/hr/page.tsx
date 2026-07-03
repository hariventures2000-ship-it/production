export default function HRPage() {
  return (
    <div className="max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">HR & Organization</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Leave management, organizational chart, and team directories.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-12 text-center shadow-sm">
        <h3 className="text-lg font-medium text-[var(--foreground)]">HR Dashboard</h3>
        <p className="text-[var(--foreground-secondary)] mt-2">
          This module is scheduled for Phase 7.2.
        </p>
      </div>
    </div>
  );
}
