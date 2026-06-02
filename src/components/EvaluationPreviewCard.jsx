function tr(t, key, fallback) {
  return typeof t === "function" ? t(key) : fallback;
}

export function EvaluationPreviewCard({ preview, t }) {
  if (!preview) return null;

  const summary = preview.summary ?? {};
  const reportSummary = preview?.reportSummary ?? null;
  const outdoorScores = preview?.outdoorScores ?? [];
  const yes = tr(t, "evaluation.preview.yes", "yes");
  const no = tr(t, "evaluation.preview.no", "no");

  return (
    <div className="mt-4 rounded-2xl border bg-white p-4 text-sm">
      <div className="mb-3">
        <div className="font-semibold">{tr(t, "evaluation.preview.title", "Evaluation preview")}</div>
        <p className="mt-1 text-slate-600">{tr(t, "evaluation.preview.helper", "Backend-loaded preview of the current Candidate evaluation data.")}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-slate-100 p-3">
          <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.written", "Written")}</div>
          <div className="font-semibold">{summary.writtenScore ?? 0} / {summary.writtenMax ?? 0}</div>
        </div>
        <div className="rounded-xl bg-slate-100 p-3">
          <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.outdoor", "Outdoor")}</div>
          <div className="font-semibold">{summary.outdoorScore ?? 0} / {summary.outdoorMax ?? 0}</div>
        </div>
        <div className="rounded-xl bg-slate-100 p-3">
          <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.report", "Report")}</div>
          <div className="font-semibold">{summary.reportScore ?? 0} / {summary.reportMax ?? 0}</div>
        </div>
        <div className="rounded-xl bg-slate-100 p-3">
          <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.total", "Total")}</div>
          <div className="font-semibold">{summary.totalScore ?? 0} / {summary.totalMax ?? 0}</div>
        </div>
        <div className="rounded-xl bg-slate-100 p-3">
          <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.result", "Result")}</div>
          <div className="font-semibold">{summary.result ?? "-"}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{tr(t, "evaluation.preview.percentage", "Percentage")}: {summary.percentage ?? 0}%</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{tr(t, "evaluation.preview.outdoorScores", "Outdoor scores")}: {summary.outdoorScoresTotal ?? 0}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{tr(t, "evaluation.preview.primaryScores", "Primary scores")}: {summary.hasPrimaryExaminerScores ? yes : no}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{tr(t, "evaluation.preview.secondaryScores", "Secondary scores")}: {summary.hasSecondaryExaminerScores ? yes : no}</span>
      </div>

      {reportSummary && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <div className="mb-2 font-medium">{tr(t, "evaluation.preview.reportSummary", "Report summary")}</div>
          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.hasReportDraft", "Report draft")}</div>
              <div className="font-semibold">{reportSummary.hasReportDraft ? yes : no}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.treesWithContent", "Trees with content")}</div>
              <div className="font-semibold">{reportSummary.treesWithContent ?? 0} / {reportSummary.treesTotal ?? 0}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.fieldNotesFilled", "Field notes filled")}</div>
              <div className="font-semibold">{reportSummary.fieldNotesFilled ?? 0}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.finalSectionsFilled", "Final sections filled")}</div>
              <div className="font-semibold">{reportSummary.finalSectionsFilled ?? 0}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.photoPlaceholders", "Photo placeholders")}</div>
              <div className="font-semibold">{reportSummary.photoPlaceholdersTotal ?? 0}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{tr(t, "evaluation.preview.submitted", "Submitted")}</div>
              <div className="font-semibold">{reportSummary.isSubmitted ? yes : no}</div>
            </div>
          </div>
        </div>
      )}

      {outdoorScores.length > 0 && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <div className="mb-2 font-medium">{tr(t, "evaluation.preview.outdoorScores", "Outdoor scores")}</div>
          <div className="space-y-2">
            {outdoorScores.slice(0, 8).map((score) => (
              <div key={score.id ?? `${score.candidate_id}:${score.examiner_id}:${score.item_id}`} className="grid gap-2 rounded-xl bg-slate-100 p-2 md:grid-cols-4">
                <span>{score.item_id}</span>
                <span>{score.examiner_id}</span>
                <span>{score.payload?.mode ?? "-"}</span>
                <strong>{score.score ?? "-"}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
