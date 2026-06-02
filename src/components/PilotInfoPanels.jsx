function tr(t, key, fallback) {
  return typeof t === "function" ? t(key) : fallback;
}

export function PilotSmokeTestChecklist({ StatusPill, t }) {
  const items = [
    ["pilot.smoke.loadCentre", "Load Centre Setup"],
    ["pilot.smoke.candidatesExaminers", "Confirm candidates and examiners are visible"],
    ["pilot.smoke.testPackage", "Import or verify test package"],
    ["pilot.smoke.candidateQr", "Open Candidate QR and save a written test answer"],
    ["pilot.smoke.report", "For Consulting Candidate, save report draft and pilot/archive placeholder"],
    ["pilot.smoke.examinerQr", "Open Examiner QR and save outdoor score and note"],
    ["pilot.smoke.preview", "Load Evaluation Preview"],
    ["pilot.smoke.draftExport", "Download Draft Export"],
    ["pilot.smoke.auditExport", "Download Centre Audit Package"],
  ];

  return (
    <div className="mt-4 rounded-2xl border bg-white p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{tr(t, "pilot.smoke.title", "Pilot smoke-test checklist")}</h3>
          <p className="mt-1 text-sm text-slate-600">{tr(t, "pilot.smoke.subtitle", "Use this after each deploy to confirm the pilot workflow still works.")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill>Pilot</StatusPill>
          <StatusPill>Manual</StatusPill>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {items.map(([key, fallback]) => (
          <div key={key} className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{tr(t, key, fallback)}</div>
        ))}
      </div>
    </div>
  );
}

export function PilotReleaseNotesPanel({ StatusPill, t }) {
  const available = [
    "Centre Setup save/load",
    "Candidate and Examiner QR workspaces",
    "CSV/JSON test package import",
    "sample CSV/JSON downloads",
    "Candidate written test persistence",
    "Consulting report draft persistence",
    "Examiner outdoor score and note persistence",
    "Evaluation Preview",
    "Draft Export",
    "Centre Audit Package",
    "Pilot workflow dashboard and smoke-test checklist",
  ];

  const notIncluded = [
    "official VETcert final certificate/result",
    "final PASS/FAIL decision workflow",
    "official VETcert export template",
    "real image upload/storage",
    "full multilingual production translation review",
    "production-grade user management",
    "offline conflict resolution UI",
  ];

  return (
    <div className="mt-4 rounded-2xl border bg-white p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{tr(t, "pilot.release.title", "Pilot release notes")}</h3>
          <p className="mt-1 text-sm text-slate-600">{tr(t, "pilot.release.subtitle", "This panel describes the pilot prototype scope. It is not the official VETcert certification output.")}</p>
        </div>
        <StatusPill>Pilot scope</StatusPill>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-semibold">{tr(t, "pilot.release.available", "Available in this pilot")}</h4>
          <div className="space-y-2">
            {available.map((item) => <div key={item} className="rounded-xl bg-slate-100 p-2 text-sm text-slate-700">{item}</div>)}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">{tr(t, "pilot.release.notIncluded", "Not included yet")}</h4>
          <div className="space-y-2">
            {notIncluded.map((item) => <div key={item} className="rounded-xl bg-amber-50 p-2 text-sm text-amber-950">{item}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CandidateQuickHelp({ t }) {
  const items = [
    ["help.candidate.qr", "Scan your personal Candidate QR issued by the Centre."],
    ["help.candidate.identity", "Confirm your identity before opening sections."],
    ["help.candidate.autosave", "Written test answers autosave to the sync queue."],
    ["help.candidate.photos", "Consulting report photo entries are pilot/archive placeholders, not real uploads yet."],
    ["help.candidate.ask", "If something looks wrong, ask Centre staff before final submit."],
  ];

  return (
    <div className="mb-4 rounded-2xl border bg-white p-4">
      <h3 className="font-semibold">{tr(t, "help.candidate.title", "Candidate quick help")}</h3>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {items.map(([key, fallback]) => <div key={key} className="rounded-xl bg-slate-100 p-2 text-sm text-slate-700">{tr(t, key, fallback)}</div>)}
      </div>
    </div>
  );
}

export function ExaminerQuickHelp({ t }) {
  const items = [
    ["help.examiner.qr", "Scan your personal Examiner QR issued by the Centre."],
    ["help.examiner.identity", "Confirm your identity before opening outdoor forms."],
    ["help.examiner.assigned", "Only assigned Candidates are shown."],
    ["help.examiner.primary", "Primary Examiner completes the full outdoor form; Secondary input is supporting."],
    ["help.examiner.autosave", "Scores and notes autosave to the sync queue."],
    ["help.examiner.missing", "If assigned Candidates are missing, ask the Centre to assign and save Centre Setup."],
  ];

  return (
    <div className="mb-4 rounded-2xl border bg-white p-4">
      <h3 className="font-semibold">{tr(t, "help.examiner.title", "Examiner quick help")}</h3>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {items.map(([key, fallback]) => <div key={key} className="rounded-xl bg-slate-100 p-2 text-sm text-slate-700">{tr(t, key, fallback)}</div>)}
      </div>
    </div>
  );
}
