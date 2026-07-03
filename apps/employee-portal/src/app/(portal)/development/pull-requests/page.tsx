export default function PullRequestsPage() {
  return (
    <div className="max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Pull Requests</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Review, approve, and merge code changes.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-12 text-center shadow-sm">
        <h3 className="text-lg font-medium text-[var(--foreground)]">Pull Requests List</h3>
        <p className="text-[var(--foreground-secondary)] mt-2">
          This module integrates with the Git service and is scheduled for Phase 5.1.
        </p>
      </div>
    </div>
  );
}
