import type { Metadata } from "next";
import Questionnaire from "@/components/Questionnaire";
import { STUDIO_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website Questionnaire",
  description: `Tell ${STUDIO_NAME} about your business so we can plan the right website for you.`,
};

export default function QuestionnairePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-20">
      <div className="pb-6 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">New website project</p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
          Website Discovery Questionnaire
        </h1>
        <p className="mt-3 max-w-[60ch] text-muted">
          These answers help me plan a site that fits your business, your customers and your budget. Answer what you
          can. &ldquo;Not sure&rdquo; is a fine answer, and we&rsquo;ll talk through anything that&rsquo;s open on our
          call. It takes about 10–15 minutes.
        </p>
      </div>
      <Questionnaire />
    </main>
  );
}
