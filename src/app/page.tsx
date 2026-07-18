"use client";

import { useEffect, useMemo, useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  History,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Analysis = {
  understanding: string;
  assumptions: string[];
  missing_information: string[];
  clarification_questions: string[];
};

type Review = {
  situation: string;
  evidence: string[];
  assumptions: string[];
  blind_spots: string[];
  unknowns: string[];
  recommended_validation: string[];
  next_step: string;
};

type Stage = "start" | "clarifying" | "reviewing" | "complete" | "error";
type ErrorAction = "start" | "complete" | null;

type Draft = {
  stage: Stage;
  decision: string;
  analysis: Analysis | null;
  answers: string[];
  decisionId: number | null;
  submissionId: string | null;
  persistence: "saved" | "unavailable";
  review: Review | null;
};

type HistoryItem = {
  id: number;
  original_decision: string;
  status: string;
  created_at: string;
};

const DRAFT_KEY = "omission-ai:phase-1-draft:v1";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAnalysis(value: unknown): value is Analysis {
  if (!value || typeof value !== "object") return false;
  const analysis = value as Partial<Analysis>;
  return typeof analysis.understanding === "string"
    && isStringArray(analysis.assumptions)
    && isStringArray(analysis.missing_information)
    && isStringArray(analysis.clarification_questions)
    && analysis.clarification_questions.length >= 1
    && analysis.clarification_questions.length <= 3;
}

function isReview(value: unknown): value is Review {
  if (!value || typeof value !== "object") return false;
  const review = value as Partial<Review>;
  return typeof review.situation === "string"
    && typeof review.next_step === "string"
    && isStringArray(review.evidence)
    && isStringArray(review.assumptions)
    && isStringArray(review.blind_spots)
    && isStringArray(review.unknowns)
    && isStringArray(review.recommended_validation);
}

function isSubmissionId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function listOrEmpty(items: string[], empty = "Nothing surfaced here yet.") {
  return items.length > 0 ? (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-zinc-300">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-zinc-500">{empty}</p>
  );
}

function ReviewSection({
  title,
  eyebrow,
  icon,
  items,
  empty,
}: {
  title: string;
  eyebrow: string;
  icon: React.ReactNode;
  items: string[];
  empty?: string;
}) {
  return (
    <Card className="rounded-2xl border-white/10 bg-white/[0.055] text-zinc-100 shadow-xl shadow-black/20 backdrop-blur-sm">
      <CardHeader className="gap-3 border-b border-white/8 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg bg-amber-300/10 text-amber-200">{icon}</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/70">{eyebrow}</p>
            <CardTitle className="mt-1 text-lg text-zinc-100">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">{listOrEmpty(items, empty)}</CardContent>
    </Card>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("start");
  const [decision, setDecision] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [decisionId, setDecisionId] = useState<number | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [persistence, setPersistence] = useState<"saved" | "unavailable">("unavailable");
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState("");
  const [errorAction, setErrorAction] = useState<ErrorAction>(null);
  const [hydrated, setHydrated] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyAvailable, setHistoryAvailable] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const { isLoaded: authLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(DRAFT_KEY);
        if (stored) {
          const draft = JSON.parse(stored) as Partial<Draft>;
          const restoredAnalysis = isAnalysis(draft.analysis) ? draft.analysis : null;
          const restoredReview = isReview(draft.review) ? draft.review : null;

          if (draft.decision) setDecision(draft.decision);
          if (restoredAnalysis) {
            setAnalysis(restoredAnalysis);
            setAnswers(restoredAnalysis.clarification_questions.map((_, index) => draft.answers?.[index] ?? ""));
          }
          if (typeof draft.decisionId === "number") setDecisionId(draft.decisionId);
          if (isSubmissionId(draft.submissionId)) setSubmissionId(draft.submissionId);
          if (draft.persistence === "saved" || draft.persistence === "unavailable") setPersistence(draft.persistence);
          if (restoredReview) setReview(restoredReview);

          if (draft.stage === "complete" && restoredReview) {
            setStage("complete");
          } else if (restoredAnalysis && ["clarifying", "reviewing", "error"].includes(draft.stage ?? "start")) {
            // A request cannot safely resume after refresh, but its entered answers can.
            setStage("clarifying");
          } else {
            setStage("start");
          }
        }
      } catch {
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {
          // Ignore unavailable browser storage.
        }
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const draft: Draft = { stage, decision, analysis, answers, decisionId, submissionId, persistence, review };
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Private browsing and quota limits must never block the review flow.
    }
  }, [hydrated, stage, decision, analysis, answers, decisionId, submissionId, persistence, review]);

  const answeredCount = useMemo(() => answers.filter((answer) => answer.trim()).length, [answers]);

  async function openHistory() {
    setHistoryOpen(true);
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const response = await fetch("/api/history", { cache: "no-store" });
      const payload = (await response.json()) as { history?: HistoryItem[]; available?: boolean };
      setHistory(payload.history ?? []);
      setHistoryAvailable(payload.available !== false);
      if (!response.ok) setHistoryError("History is temporarily unavailable.");
    } catch {
      setHistoryAvailable(false);
      setHistoryError("History is temporarily unavailable.");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function openSavedReview(item: HistoryItem) {
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const response = await fetch(`/api/history/${item.id}`, { cache: "no-store" });
      const payload = (await response.json()) as { decision?: string; review?: Review; error?: string };
      if (!response.ok || !payload.review || !payload.decision) throw new Error(payload.error ?? "This review could not be loaded.");

      setDecision(payload.decision);
      setReview(payload.review);
      setAnalysis(null);
      setAnswers([]);
      setDecisionId(item.id);
      setSubmissionId(null);
      setPersistence("saved");
      setStage("complete");
      setHistoryOpen(false);
    } catch (requestError) {
      setHistoryError(requestError instanceof Error ? requestError.message : "This review could not be loaded.");
    } finally {
      setHistoryLoading(false);
    }
  }

  function clearError() {
    setError("");
    setErrorAction(null);
  }

  function startNewReview() {
    setStage("start");
    setDecision("");
    setAnalysis(null);
    setAnswers([]);
    setDecisionId(null);
    setSubmissionId(null);
    setPersistence("unavailable");
    setReview(null);
    clearError();
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Storage is an enhancement; the in-memory review remains usable.
    }
  }

  async function startReview() {
    if (decision.trim().length < 10) {
      setError("Describe the decision and a little context so the review can be useful.");
      setErrorAction("start");
      setStage("error");
      return;
    }

    clearError();
    setStage("reviewing");

    try {
      const response = await fetch("/api/review/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: decision.trim() }),
      });
      const payload = (await response.json()) as { analysis?: Analysis; decisionId?: number | null; persistence?: "saved" | "unavailable"; error?: string };
      if (!response.ok || !payload.analysis) throw new Error(payload.error ?? "The review could not be started.");

      setAnalysis(payload.analysis);
      setAnswers(payload.analysis.clarification_questions.map(() => ""));
      setDecisionId(payload.decisionId ?? null);
      setSubmissionId(window.crypto.randomUUID());
      setPersistence(payload.persistence ?? "unavailable");
      setStage("clarifying");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The review could not be started. Please retry.");
      setErrorAction("start");
      setStage("error");
    }
  }

  async function completeReview() {
    if (!analysis || answers.length !== analysis.clarification_questions.length || answers.some((answer) => !answer.trim())) {
      setError("Answer each question, or write “I don't know” where the information is still missing.");
      setErrorAction("complete");
      setStage("error");
      return;
    }

    clearError();
    setStage("reviewing");

    const requestSubmissionId = submissionId ?? window.crypto.randomUUID();
    if (!submissionId) setSubmissionId(requestSubmissionId);

    try {
      const response = await fetch("/api/review/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision: decision.trim(),
          answers: analysis.clarification_questions.map((question, index) => ({ question, answer: answers[index].trim() })),
          decisionId,
          submissionId: requestSubmissionId,
        }),
      });
      const payload = (await response.json()) as { review?: Review; persistence?: "saved" | "unavailable"; error?: string };
      if (!response.ok || !payload.review) throw new Error(payload.error ?? "The review could not be completed.");

      setReview(payload.review);
      setPersistence(payload.persistence ?? "unavailable");
      setStage("complete");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The review could not be completed. Please retry.");
      setErrorAction("complete");
      setStage("error");
    }
  }

  function retry() {
    if (errorAction === "start") void startReview();
    if (errorAction === "complete") void completeReview();
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#07090c] text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(251,191,36,0.13),transparent_30%),radial-gradient(circle_at_86%_24%,rgba(120,113,108,0.12),transparent_24%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <header className="flex min-h-16 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-3 shadow-lg shadow-black/10 backdrop-blur-md sm:px-5">
          <button type="button" onClick={startNewReview} className="group flex items-center gap-3 text-left">
            <span className="grid size-9 place-items-center rounded-xl border border-amber-200/20 bg-amber-200/10 text-amber-200 transition-colors group-hover:bg-amber-200/20">
              <Sparkles className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-wide text-zinc-100">Omission AI</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Decision review workspace</span>
            </span>
          </button>
          <div className="flex items-center gap-1 sm:gap-2">
            {!authLoaded && <span className="px-2 text-[11px] text-zinc-600">Account loading…</span>}
            {authLoaded && isSignedIn && (
              <Button variant="ghost" onClick={() => void openHistory()} className="text-zinc-400 hover:text-zinc-100">
                <History /> <span className="hidden sm:inline">History</span>
              </Button>
            )}
            {authLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">Sign in</Button>
              </SignInButton>
            )}
            {authLoaded && isSignedIn && <UserButton />}
            {stage !== "start" && (
              <Button variant="ghost" onClick={startNewReview} className="text-zinc-400 hover:text-zinc-100">
                <RefreshCw /> <span className="hidden sm:inline">New review</span>
              </Button>
            )}
          </div>
        </header>

        {historyOpen && (
          <div className="fixed inset-0 z-40 bg-[#07090c]/95 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-6">
            <section className="mx-auto flex h-full w-full max-w-3xl flex-col rounded-2xl border border-white/10 bg-[#0c0e13]/85 p-4 shadow-2xl shadow-black/30 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Continuity</p>
                  <h1 className="mt-2 text-2xl font-semibold text-zinc-50">Decision history</h1>
                </div>
                <Button variant="ghost" onClick={() => setHistoryOpen(false)} className="text-zinc-400 hover:text-zinc-100">Close</Button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto py-6">
                {historyLoading && <div className="flex items-center gap-3 py-8 text-sm text-zinc-500"><LoaderCircle className="size-4 animate-spin" /> Loading saved reviews…</div>}
                {!historyLoading && historyError && <Alert variant="destructive" className="border-red-300/20 bg-red-300/[0.06] text-zinc-100"><AlertTriangle /><AlertTitle>History unavailable</AlertTitle><AlertDescription className="text-zinc-400">{historyError}</AlertDescription></Alert>}
                {!historyLoading && !historyError && !historyAvailable && <p className="py-8 text-sm text-zinc-500">History is temporarily unavailable. New reviews still work.</p>}
                {!historyLoading && !historyError && historyAvailable && history.length === 0 && <p className="py-8 text-sm text-zinc-500">No completed reviews yet. Your next review will appear here.</p>}
                {!historyLoading && !historyError && history.length > 0 && (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <button key={item.id} type="button" onClick={() => void openSavedReview(item)} className="w-full rounded-xl border border-white/10 bg-white/[0.045] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-amber-200/30 hover:bg-amber-200/[0.06] hover:shadow-lg hover:shadow-black/20">
                        <p className="line-clamp-2 text-sm leading-6 text-zinc-200">{item.original_decision}</p>
                        <p className="mt-2 text-xs text-zinc-500">{new Date(item.created_at).toLocaleDateString()} · {item.status}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center py-10 sm:py-14 lg:py-16">
          {stage === "start" && (
            <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div className="space-y-6 lg:py-8">
                <Badge className="border border-amber-200/20 bg-amber-200/10 px-3 text-amber-100 hover:bg-amber-200/10">Think before you commit</Badge>
                <h1 className="max-w-2xl text-5xl font-semibold tracking-[-0.045em] text-zinc-50 sm:text-6xl sm:leading-[0.98] lg:text-7xl">What might you be missing?</h1>
                <p className="max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">Describe an important decision. Omission AI surfaces assumptions, unknowns, and the questions worth answering before you move.</p>
                <div className="flex flex-wrap gap-x-5 gap-y-3 pt-2 text-xs font-medium text-zinc-500">
                  <span className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full border border-amber-200/20 text-[10px] text-amber-200">1</span> Clarify what matters</span>
                  <span className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full border border-amber-200/20 text-[10px] text-amber-200">2</span> Review before acting</span>
                </div>
              </div>
              <Card className="relative overflow-hidden rounded-2xl border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur-sm">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/45 to-transparent" />
                <CardContent className="space-y-5 p-5 sm:p-7">
                  <div className="space-y-1"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/70">Your decision</p><label htmlFor="decision" className="text-base font-medium text-zinc-100">The decision in front of you</label></div>
                  <Textarea
                    id="decision"
                    value={decision}
                    onChange={(event) => setDecision(event.target.value)}
                    placeholder="Example: Should I leave my job to start freelancing full-time?"
                    maxLength={4000}
                    className="min-h-40 resize-y rounded-xl border-white/10 bg-black/20 p-4 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-amber-200/50 focus-visible:ring-amber-200/20"
                  />
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-zinc-500">Include what you want, what constrains you, and what feels uncertain.</p>
                    <span className="shrink-0 text-xs tabular-nums text-zinc-600">{decision.length}/4000</span>
                  </div>
                  <Button size="lg" onClick={() => void startReview()} className="h-11 w-full rounded-xl bg-amber-200 px-5 text-zinc-950 shadow-lg shadow-amber-200/10 hover:bg-amber-100 sm:w-auto">
                    Begin review <ArrowRight />
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}

          {stage === "clarifying" && analysis && (
            <section className="mx-auto w-full max-w-3xl space-y-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Step 1 of 2 · Clarify</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-50 sm:text-4xl">Let&apos;s inspect the decision.</h1>
                </div>
                <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-zinc-400">{answeredCount}/{answers.length} answered</Badge>
              </div>
              <Card className="rounded-2xl border-white/10 bg-white/[0.055] shadow-xl shadow-black/20 backdrop-blur-sm">
                <CardContent className="space-y-5 p-5 sm:p-7">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Our current understanding</p>
                    <p className="text-base leading-7 text-zinc-200">{analysis.understanding}</p>
                  </div>
                  <div className="rounded-xl border border-amber-200/10 bg-amber-200/[0.055] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/70">What may still be missing</p>
                    <div className="mt-3">{listOrEmpty(analysis.missing_information, "The first pass did not find a clear information gap.")}</div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {analysis.clarification_questions.map((question, index) => (
                  <div key={`${question}-${index}`} className="space-y-2 rounded-xl border border-white/8 bg-white/[0.025] p-4 sm:p-5">
                    <label htmlFor={`answer-${index}`} className="flex gap-3 text-sm font-medium leading-6 text-zinc-200">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-200/10 text-xs text-amber-200">{index + 1}</span>
                      {question}
                    </label>
                    <Textarea
                      id={`answer-${index}`}
                      value={answers[index] ?? ""}
                      onChange={(event) => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? event.target.value : answer))}
                      placeholder="Your answer, or “I don’t know” if this is still an unknown."
                      className="min-h-28 rounded-xl border-white/10 bg-black/20 p-3 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-amber-200/50 focus-visible:ring-amber-200/20"
                    />
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => void completeReview()} className="h-11 w-full rounded-xl bg-amber-200 px-5 text-zinc-950 shadow-lg shadow-amber-200/10 hover:bg-amber-100 sm:w-auto">
                Generate decision review <ArrowRight />
              </Button>
            </section>
          )}

          {stage === "complete" && review && (
            <section className="space-y-7">
              <div className="flex flex-col gap-4 border-b border-white/8 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Step 2 of 2 · Review</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-50 sm:text-4xl">See the decision more clearly.</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="w-fit border border-emerald-300/20 bg-emerald-300/10 text-emerald-200 hover:bg-emerald-300/10"><Check className="mr-1 size-3" /> Review complete</Badge>
                  <Badge variant="outline" className="w-fit border-white/10 bg-white/[0.03] text-zinc-400">{persistence === "saved" && isSignedIn ? "Saved to history" : "Saved for this session"}</Badge>
                </div>
              </div>
              <Card className="rounded-2xl border-amber-200/20 bg-[linear-gradient(135deg,rgba(251,191,36,0.12),rgba(255,255,255,0.04))] text-zinc-100 shadow-xl shadow-black/20">
                <CardHeader className="gap-3 pb-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/75">Situation</p><CardTitle className="max-w-3xl text-xl leading-8 text-zinc-50">{review.situation}</CardTitle></CardHeader>
                <CardContent><p className="text-sm leading-6 text-zinc-300/80">The final decision is still yours. This review shows what deserves validation first.</p></CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <ReviewSection title="Evidence" eyebrow="What we know" icon={<Check />} items={review.evidence} empty="No evidence was confirmed in the review." />
                <ReviewSection title="Assumptions" eyebrow="What is believed" icon={<CircleHelp />} items={review.assumptions} />
                <ReviewSection title="Blind spots" eyebrow="What may be omitted" icon={<ShieldAlert />} items={review.blind_spots} />
                <ReviewSection title="Unknowns" eyebrow="What to find out" icon={<AlertTriangle />} items={review.unknowns} />
              </div>
              <Card className="rounded-2xl border-white/10 bg-white/[0.055] text-zinc-100 shadow-xl shadow-black/20 backdrop-blur-sm">
                <CardHeader className="gap-3 pb-3"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-amber-300/10 text-amber-200"><Lightbulb className="size-4" /></span><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/70">Next validation</p><CardTitle className="mt-1 text-lg text-zinc-100">What to verify before committing</CardTitle></div></div></CardHeader>
                <CardContent>{listOrEmpty(review.recommended_validation)}</CardContent>
              </Card>
              <div className="flex flex-col gap-5 rounded-2xl border border-amber-200/20 bg-amber-200/[0.08] p-5 shadow-xl shadow-black/15 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex gap-3"><ArrowRight className="mt-1 size-5 shrink-0 text-amber-200" /><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Immediate next step</p><p className="mt-2 text-base leading-7 text-zinc-100">{review.next_step}</p></div></div>
                <Button variant="outline" onClick={startNewReview} className="h-10 rounded-xl border-white/15 bg-transparent text-zinc-100 hover:bg-white/10">Review another decision</Button>
              </div>
            </section>
          )}

          {stage === "reviewing" && (
            <section className="flex flex-col items-center justify-center gap-5 py-24 text-center">
              <span className="grid size-16 place-items-center rounded-2xl border border-amber-200/20 bg-amber-200/10 text-amber-200 shadow-xl shadow-amber-200/5"><LoaderCircle className="size-6 animate-spin" /></span>
              <div><h1 className="text-2xl font-semibold text-zinc-50">Reviewing the decision</h1><p className="mt-2 text-sm text-zinc-500">Looking for what is known, assumed, and still missing.</p></div>
            </section>
          )}

          {stage === "error" && (
            <section className="space-y-6">
              <Button variant="ghost" onClick={() => { clearError(); setStage(errorAction === "complete" ? "clarifying" : "start"); }} className="-ml-3 text-zinc-400 hover:text-zinc-100"><ArrowLeft /> Back</Button>
              <Alert variant="destructive" className="border-red-300/20 bg-red-300/[0.06] text-zinc-100">
                <AlertTriangle />
                <AlertTitle>Something interrupted the review</AlertTitle>
                <AlertDescription className="text-zinc-400">{error}</AlertDescription>
              </Alert>
              <div className="flex flex-wrap gap-3"><Button onClick={retry} className="bg-amber-200 text-zinc-950 hover:bg-amber-100"><RefreshCw /> Try again</Button><Button variant="outline" onClick={startNewReview} className="border-white/15 bg-transparent text-zinc-100 hover:bg-white/10">Start over</Button></div>
            </section>
          )}
        </div>
        <footer className="flex items-center gap-2 pt-5 text-xs text-zinc-600"><span className="size-1.5 rounded-full bg-amber-200/70" /> Structured thinking before commitment</footer>
      </div>
    </main>
  );
}
