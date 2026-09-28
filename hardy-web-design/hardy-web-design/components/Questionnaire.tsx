"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_QUESTIONS, Answers, Question, SECTIONS, isAnswered } from "@/lib/questions";

const DRAFT_KEY = "hwd-questionnaire-draft-v1";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export default function Questionnaire() {
  const [answers, setAnswers] = useState<Answers>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [showErrors, setShowErrors] = useState(false);
  const loaded = useRef(false);

  // Restore a saved draft so people can come back and finish later.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setAnswers(JSON.parse(saved));
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    } catch {}
  }, [answers]);

  const answeredCount = useMemo(() => ALL_QUESTIONS.filter((q) => isAnswered(answers[q.id])).length, [answers]);
  const missing = ALL_QUESTIONS.filter((q) => q.required && !isAnswered(answers[q.id]));

  const setValue = (id: string, value: string | string[]) => setAnswers((a) => ({ ...a, [id]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (missing.length) {
      setShowErrors(true);
      document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, company_website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Your answers didn't send. Please try again.");
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setStatus({ kind: "sent" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="rounded-xl border border-line bg-surface p-8">
        <h2 className="font-display text-2xl font-bold">Thank you! Your answers were sent.</h2>
        <p className="mt-2 text-muted">
          I&rsquo;ll review everything and reach out within two business days to schedule our planning call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="sticky top-0 z-10 -mx-4 border-b border-line bg-bg px-4 py-3" aria-live="polite">
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${(answeredCount / ALL_QUESTIONS.length) * 100}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-sm tabular-nums text-muted">
          <span>
            {answeredCount} of {ALL_QUESTIONS.length} answered
          </span>
          <span>Progress saves on this device</span>
        </div>
      </div>

      {SECTIONS.map((section, si) => (
        <section key={section.id} className="grid gap-6 border-b border-line py-8">
          <div>
            <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold">
              <span className="font-body text-sm font-semibold tabular-nums text-accent">
                {si + 1} / {SECTIONS.length}
              </span>
              {section.title}
            </h2>
            <p className="mt-1 text-[15px] text-muted">{section.lead}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {section.questions.map((q) => (
              <Field
                key={q.id}
                q={q}
                value={answers[q.id]}
                onChange={(v) => setValue(q.id, v)}
                invalid={showErrors && !!q.required && !isAnswered(answers[q.id])}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Hidden from people; catches spam bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_website">Leave this empty</label>
        <input
          id="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-3 py-8">
        {showErrors && missing.length > 0 && (
          <p className="rounded-lg bg-danger-soft px-4 py-3 text-[15px] text-danger" role="alert">
            Please fill in: {missing.map((q) => q.label).join(", ")}.
          </p>
        )}
        {status.kind === "error" && (
          <p className="rounded-lg bg-danger-soft px-4 py-3 text-[15px] text-danger" role="alert">
            {status.message}
          </p>
        )}
        <div>
          <button
            type="submit"
            disabled={status.kind === "sending"}
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-ink transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          >
            {status.kind === "sending" ? "Sending…" : "Send my answers"}
          </button>
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent";

function Field({
  q,
  value,
  onChange,
  invalid,
}: {
  q: Question;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  invalid: boolean;
}) {
  const span = q.half ? "" : "sm:col-span-2";
  const labelText = (
    <>
      {q.label}
      {q.required && <span className="text-accent"> *</span>}
    </>
  );
  const hint = q.hint && <span className="block text-sm font-normal text-muted">{q.hint}</span>;
  const errorRing = invalid ? "border-danger" : "";

  if (q.type === "checks" || q.type === "radio") {
    const selected = q.type === "checks" ? ((value as string[]) ?? []) : [];
    const atMax = !!q.max && selected.length >= q.max;
    return (
      <fieldset id={`q-${q.id}`} className={`grid gap-2 ${span}`}>
        <legend className="mb-2 font-semibold">
          {labelText}
          {hint}
        </legend>
        <div className="flex flex-wrap gap-2">
          {q.options!.map((opt, i) => {
            const checked = q.type === "checks" ? selected.includes(opt) : value === opt;
            const disabled = q.type === "checks" && atMax && !checked;
            return (
              <label key={opt} className={`relative ${disabled ? "opacity-50" : ""}`}>
                <input
                  id={`${q.id}_${i}`}
                  type={q.type === "checks" ? "checkbox" : "radio"}
                  name={q.id}
                  value={opt}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    if (q.type === "radio") onChange(opt);
                    else onChange(checked ? selected.filter((x) => x !== opt) : [...selected, opt]);
                  }}
                  className="peer absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                />
                <span
                  className={`inline-block cursor-pointer select-none rounded-full border px-3.5 py-2 text-[15px] peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                    invalid ? "border-danger" : "border-line"
                  } bg-surface`}
                >
                  {checked && <span className="text-accent">✓ </span>}
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  const str = (value as string) ?? "";
  return (
    <div id={`q-${q.id}`} className={`grid gap-2 ${span}`}>
      <label htmlFor={q.id} className="font-semibold">
        {labelText}
        {hint}
      </label>
      {q.type === "area" ? (
        <textarea
          id={q.id}
          rows={3}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
          className={`${inputClass} ${errorRing} min-h-24 resize-y`}
        />
      ) : (
        <input
          id={q.id}
          type={q.type}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
          autoComplete={
            q.id === "contact_name" ? "name" : q.id === "contact_email" ? "email" : q.id === "contact_phone" ? "tel" : q.id === "business_name" ? "organization" : "off"
          }
          className={`${inputClass} ${errorRing}`}
        />
      )}
    </div>
  );
}
