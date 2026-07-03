export default function ReportsPage() {
  return (
    <div className="max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Organizational metrics, burndown charts, and performance analytics.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-12 text-center shadow-sm">
        <h3 className="text-lg font-medium text-[var(--foreground)]">Analytics Dashboard</h3>
        <p className="text-[var(--foreground-secondary)] mt-2">
          This module requires a charting library (Recharts) and is scheduled for Phase 7.1.
        </p>
      </div>
    </div>
  );
}
