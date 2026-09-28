"use client";

import { concepts } from "@/data/concepts";
import { palaceObjects } from "@/data/palaceObjects";
import { usePalaceStore } from "@/stores/palaceStore";

/**
 * Questions come from the snapshot taken when the quiz started, so every prompt
 * refers to an object the player actually tagged. Correctness is decided by the
 * store, this component only renders the outcome.
 */
export default function RecallQuiz() {
  const mode = usePalaceStore((state) => state.mode);
  const questions = usePalaceStore((state) => state.quizQuestions);
  const index = usePalaceStore((state) => state.quizIndex);
  const score = usePalaceStore((state) => state.quizScore);
  const answers = usePalaceStore((state) => state.quizAnswers);
  const recordQuizAnswer = usePalaceStore((state) => state.recordQuizAnswer);
  const nextQuestion = usePalaceStore((state) => state.nextQuestion);

  if (mode !== "quiz") return null;

  const question = questions[index];
  const object = palaceObjects.find((item) => item.id === question?.objectId);
  const previousAnswer = question ? answers[question.objectId] : undefined;
  const submitted = previousAnswer !== undefined;
  const isLast = index >= questions.length - 1;
  const isCorrect = Boolean(question) && previousAnswer === question?.conceptId;

  if (!question) {
    return (
      <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex w-full items-end p-4 sm:w-auto sm:max-w-[43rem]">
        <p className="rounded-[1.4rem] border border-white/10 bg-slate-950/85 px-6 py-4 text-base text-slate-300">
          Nothing tagged yet — head back and press E on a few props.
        </p>
      </div>
    );
  }

  const choose = (conceptId: string) => {
    if (submitted) return;
    recordQuizAnswer(conceptId);
  };

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex w-full items-end p-4 sm:w-auto sm:max-w-[43rem]">
      <section className="pointer-events-auto w-full rounded-[1.4rem] border border-amber-200/25 bg-slate-950/88 p-[1.25rem] text-white shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.9rem] font-semibold tracking-[0.18em] text-amber-300 uppercase">
            Recall {index + 1}/{questions.length}
          </p>
          <p className="text-[0.9rem] text-slate-400">
            Score {score}/{questions.length}
          </p>
        </div>

        <h2 className="mt-[0.4rem] text-xl leading-7 font-bold">
          Which concept did you put on the {object?.name.toLowerCase() ?? "prop"}?
        </h2>

        <div className="mt-[0.6rem] grid grid-cols-2 gap-[0.4rem] sm:grid-cols-3">
          {concepts.map((concept) => {
            const selected = previousAnswer === concept.id;
            const correct = submitted && concept.id === question.conceptId;
            return (
              <button
                key={concept.id}
                type="button"
                disabled={submitted}
                onClick={() => choose(concept.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm leading-5 transition ${
                  correct
                    ? "border-emerald-300 bg-emerald-400/20 text-emerald-100"
                    : selected
                      ? "border-rose-300 bg-rose-400/20 text-rose-100"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-amber-300/60 hover:bg-white/10"
                }`}
              >
                {concept.title}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-[0.6rem] flex items-center justify-between gap-4">
            <p className="text-sm leading-5 text-slate-300">
              {isCorrect
                ? "Correct!"
                : `You tagged it ${concepts.find((item) => item.id === question.conceptId)?.title}.`}
            </p>
            <button
              type="button"
              onClick={nextQuestion}
              className="shrink-0 rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-200"
            >
              {isLast ? "Results" : "Next"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
