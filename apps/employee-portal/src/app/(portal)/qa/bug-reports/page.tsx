export default function BugReportsPage() {
  return (
    <div className="max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Bug Reports</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Track and manage identified defects.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-12 text-center shadow-sm">
        <h3 className="text-lg font-medium text-[var(--foreground)]">Bug Tracking System</h3>
        <p className="text-[var(--foreground-secondary)] mt-2">
          This module integrates with the ticketing system and is scheduled for Phase 6.1.
        </p>
      </div>
    </div>
  );
}
