function tr(t, key, fallback) {
  return typeof t === "function" ? t(key) : fallback;
}

export function CentreValidationSummary({ issues, StatusPill, t }) {
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.length - errorCount;
  const sortedIssues = [...issues].sort((a, b) => (a.severity === "error" ? 0 : 1) - (b.severity === "error" ? 0 : 1));

  return (
    <div className="mt-3 rounded-2xl border bg-white p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{tr(t, "centre.validation.title", "Centre Setup checks")}</h3>
          <p className="mt-1 text-slate-600">{tr(t, "centre.validation.helper", "Errors should be fixed before distributing QR links. Warnings should be reviewed before opening the exam session.")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={errorCount ? "bad" : "good"}>{errorCount ? tr(t, "centre.validation.action", "Action required before exam session check") : tr(t, "centre.validation.ready", "Ready for exam session check")}</StatusPill>
          <StatusPill>{issues.length} validation issue(s)</StatusPill>
          <StatusPill tone={errorCount ? "bad" : "default"}>{errorCount} error(s)</StatusPill>
          <StatusPill tone={warningCount ? "warn" : "default"}>{warningCount} warning(s)</StatusPill>
        </div>
      </div>
      {sortedIssues.length === 0 ? (
        <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-emerald-900">{tr(t, "centre.validation.empty", "No validation issues. Setup is ready for the exam session.")}</div>
      ) : (
        <div className="mt-3 space-y-2">
          {sortedIssues.map((issue, index) => (
            <div key={`${issue.message}-${index}`} className={`rounded-xl p-3 ${issue.severity === "error" ? "bg-rose-50 text-rose-950" : "bg-amber-50 text-amber-950"}`}>
              <span className="font-semibold">{issue.severity === "error" ? "Error" : "Warning"}:</span> {issue.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function OperationalReadinessChecks({ centreValidationIssues, centreSetupDirty, testImportSummary, dataMode, StatusPill, t }) {
  const warnings = [
    ...(centreValidationIssues.some((issue) => issue.severity === "error") ? [tr(t, "centre.guardrails.validation", "Fix validation errors before distributing QR links.")] : []),
    ...(centreSetupDirty ? [tr(t, "centre.guardrails.unsaved", "Save Centre Setup before distributing QR links.")] : []),
    ...(!testImportSummary ? [tr(t, "centre.guardrails.testPackage", "Import/select a test package before opening the written test.")] : []),
    ...(dataMode === "demo" ? [tr(t, "centre.guardrails.backend", "Load saved Centre Setup before opening the exam session.")] : []),
  ];

  return (
    <div className="mt-4 rounded-2xl border bg-white p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{tr(t, "centre.guardrails.title", "Operational readiness checks")}</h3>
          <p className="mt-1 text-slate-600">{tr(t, "centre.guardrails.helper", "These checks should be resolved before opening the exam session.")}</p>
        </div>
        <StatusPill tone={warnings.length ? "warn" : "good"}>{warnings.length ? `${warnings.length} warning(s)` : "ready"}</StatusPill>
      </div>
      {warnings.length === 0 ? (
        <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-emerald-900">{tr(t, "centre.guardrails.ready", "Operational readiness looks good.")}</div>
      ) : (
        <div className="mt-3 space-y-2">
          {warnings.map((warning) => <div key={warning} className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950">{warning}</div>)}
        </div>
      )}
    </div>
  );
}

export function ExamRunSummary({ centreValidationIssues, centreSetupDirty, testImportSummary, dataMode, StatusPill, t }) {
  const hasValidationErrors = centreValidationIssues.some((issue) => issue.severity === "error");
  const qrDistributionReady = dataMode === "backend" && !centreSetupDirty && !hasValidationErrors && Boolean(testImportSummary);
  const rows = [
    [tr(t, "centre.run.dataMode", "Data mode"), dataMode === "backend" ? tr(t, "centre.run.backend", "Centre-loaded exam data") : tr(t, "centre.run.demo", "local session data"), dataMode === "backend" ? "good" : "warn"],
    [tr(t, "centre.run.setup", "Centre Setup"), centreSetupDirty ? tr(t, "centre.run.unsaved", "Unsaved local changes") : tr(t, "centre.run.saved", "Saved / no local changes"), centreSetupDirty ? "warn" : "good"],
    [tr(t, "centre.run.validation", "Validation"), hasValidationErrors ? tr(t, "centre.validation.action", "Action required before exam session check") : tr(t, "centre.validation.ready", "Ready for exam session check"), hasValidationErrors ? "bad" : "good"],
    [tr(t, "centre.run.testPackage", "Test package"), testImportSummary ? tr(t, "centre.run.imported", "Imported") : tr(t, "centre.run.missing", "Missing"), testImportSummary ? "good" : "warn"],
    [tr(t, "centre.run.qrDistribution", "QR distribution"), qrDistributionReady ? tr(t, "centre.run.qrReady", "Ready after setup is saved and backend-loaded") : tr(t, "centre.run.review", "Review guardrails"), qrDistributionReady ? "good" : "warn"],
  ];

  return (
    <div className="mt-4 rounded-2xl border bg-white p-4 text-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{tr(t, "centre.run.title", "Exam session summary")}</h3>
          <p className="mt-1 text-slate-600">{tr(t, "centre.run.helper", "Use this summary before sharing Candidate or Examiner QR links.")}</p>
        </div>
        <StatusPill tone={qrDistributionReady ? "good" : "warn"}>{qrDistributionReady ? "ready" : "review"}</StatusPill>
      </div>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
        {rows.map(([label, value, tone]) => (
          <div key={label} className="rounded-xl bg-slate-100 p-3">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="mt-1"><StatusPill tone={tone}>{value}</StatusPill></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CentreNetworkReadinessChecklist({ StatusPill, t }) {
  const items = [
    ["centre.network.wifi", "Stable Wi-Fi/router is running"],
    ["centre.network.internet", "Internet access works on tablets"],
    ["centre.network.url", "Deployed VetBara URL opens on tablets"],
    ["centre.network.centreQr", "Centre QR/session opens"],
    ["centre.network.candidateQr", "Candidate QR opens on a tablet"],
    ["centre.network.examinerQr", "Examiner QR opens on a tablet"],
    ["centre.network.setup", "Save/Load Centre Setup tested"],
    ["centre.network.sync", "Sync/Audit panel checked"],
    ["centre.network.export", "Export download tested"],
  ];

  return (
    <div className="mt-4 rounded-2xl border bg-white p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{tr(t, "centre.network.title", "Network readiness checklist")}</h3>
          <p className="mt-1 text-sm text-slate-600">{tr(t, "centre.network.helper", "Use this before distributing Candidate QR and Examiner QR links during the exam session.")}</p>
        </div>
        <StatusPill>LAN session</StatusPill>
      </div>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {items.map(([key, fallback]) => (
          <div key={key} className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{tr(t, key, fallback)}</div>
        ))}
      </div>
    </div>
  );
}
