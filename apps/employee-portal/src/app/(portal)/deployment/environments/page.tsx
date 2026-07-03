export default function EnvironmentsPage() {
  return (
    <div className="max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Environments</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Manage staging, UAT, and production environments.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-12 text-center shadow-sm">
        <h3 className="text-lg font-medium text-[var(--foreground)]">Environment Configs</h3>
        <p className="text-[var(--foreground-secondary)] mt-2">
          This module requires Kubernetes integration and is scheduled for Phase 6.2.
        </p>
      </div>
    </div>
  );
}
