import Link from "next/link";
import { concepts } from "@/data/concepts";

const steps = [
  {
    title: "Place",
    body: "Pick a concept, walk up to a prop, press E. The chest takes variables, the recipe book takes functions, the endless staircase takes loops.",
  },
  {
    title: "Tour",
    body: "A guided camera walks you through the five rooms and re-explains each concept against the object you assigned it to.",
  },
  {
    title: "Recall",
    body: "A five question quiz asks which concept belongs where. Misses stay flagged so you know what to review.",
  },
];

const highlights = [
  {
    title: "Procedural 3D",
    body: "Every room, prop and painting is built from primitives at runtime. No models, no textures, no download.",
  },
  {
    title: "Four distinct rooms",
    body: "Living room, kitchen, study and a staircase landing, each with its own palette, lighting and furniture.",
  },
  {
    title: "Progress that sticks",
    body: "Placements, tour position and quiz score are saved locally, so a refresh drops you back where you were.",
  },
];

function PalacePlan() {
  const rooms = [
    { x: 8, y: 8, label: "Living", accent: "#9b644a" },
    { x: 148, y: 8, label: "Kitchen", accent: "#b8754b" },
    { x: 8, y: 128, label: "Study", accent: "#805447" },
    { x: 148, y: 128, label: "Landing", accent: "#a26748" },
  ];
  const pins = [
    { x: 40, y: 44, label: "variables" },
    { x: 196, y: 40, label: "functions" },
    { x: 44, y: 168, label: "recursion" },
    { x: 124, y: 30, label: "arrays" },
    { x: 186, y: 178, label: "loops" },
  ];

  return (
    <svg
      viewBox="0 0 296 248"
      role="img"
      aria-label="Floor plan of the four room palace with concept markers"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b1412" />
          <stop offset="100%" stopColor="#0c0a0b" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="296" height="248" rx="18" fill="url(#floor)" />
      <rect
        x="0.75"
        y="0.75"
        width="294.5"
        height="246.5"
        rx="17.25"
        fill="none"
        stroke="rgb(148 163 184 / 0.18)"
        strokeWidth="1.5"
      />

      {rooms.map((room) => (
        <g key={room.label}>
          <rect
            x={room.x}
            y={room.y}
            width="140"
            height="112"
            rx="8"
            fill={room.accent}
            fillOpacity="0.22"
            stroke={room.accent}
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
          <text
            x={room.x + 10}
            y={room.y + 20}
            fill="rgb(226 232 240 / 0.75)"
            fontSize="11"
            fontFamily="var(--font-geist-sans), sans-serif"
          >
            {room.label}
          </text>
        </g>
      ))}

      {/* open passages, no doors */}
      <rect x="144" y="8" width="8" height="112" fill="#0c0a0b" />
      <rect x="144" y="128" width="8" height="112" fill="#0c0a0b" />
      <rect x="8" y="116" width="140" height="8" fill="#0c0a0b" />
      <rect x="148" y="116" width="140" height="8" fill="#0c0a0b" />

      {pins.map((pin, index) => (
        <g key={pin.label} className={index % 2 ? "animate-drift-slow" : "animate-drift"}>
          <circle cx={pin.x} cy={pin.y} r="9" fill="#67e8f9" fillOpacity="0.18" />
          <circle cx={pin.x} cy={pin.y} r="3.5" fill="#67e8f9" />
        </g>
      ))}
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="ember-glow pointer-events-none absolute inset-0" />
      <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_50%_at_50%_0%,black,transparent)]" />

      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-amber-300 to-rose-400 text-[13px] font-bold text-slate-950">
              P
            </span>
            <span className="text-sm font-semibold tracking-tight">Programming Palace</span>
          </Link>
          <nav className="hidden items-center gap-5 text-xs text-slate-400 sm:flex">
            <a href="#how" className="transition hover:text-slate-100">
              How it works
            </a>
            <a href="#concepts" className="transition hover:text-slate-100">
              Concepts
            </a>
            <a href="#build" className="transition hover:text-slate-100">
              Under the hood
            </a>
          </nav>
          <Link
            href="/palace"
            className="rounded-full bg-cyan-300 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Enter the palace
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5">
        <section className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] font-medium tracking-wide text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              First person memory palace
            </p>
            <h1 className="mt-5 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Remember code by
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-rose-300 bg-clip-text text-transparent">
                {" "}
                walking through it
              </span>
              .
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Five programming concepts live in five rooms of a 3D house. Place each one on
              the object that makes it obvious, take the guided tour, then prove it stuck with a
              recall quiz.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/palace"
                className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-200"
              >
                Start exploring
              </Link>
              <a
                href="#how"
                className="rounded-full border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                See how it works
              </a>
            </div>
            <dl className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-white/8 pt-5">
              {[
                ["5", "concepts"],
                ["4", "rooms"],
                ["0", "assets to download"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-bold text-slate-100">{value}</dt>
                  <dd className="mt-0.5 text-[11px] tracking-wide text-slate-500 uppercase">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-cyan-400/5 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-slate-950/60 p-3 shadow-2xl">
              <PalacePlan />
              <p className="mt-2 px-1 pb-1 text-[11px] text-slate-500">
                Two by two rooms, open passages, one concept per prop.
              </p>
            </div>
          </div>
        </section>

        <section id="how" className="scroll-mt-20 border-t border-white/8 py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Three steps, then you know it</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            The loop is deliberately short: place, review, recall. Nothing to unlock, nothing to
            grind.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-cyan-300/30 hover:bg-white/[0.05]"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-300/15 text-xs font-bold text-cyan-200">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-400">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="concepts" className="scroll-mt-20 border-t border-white/8 py-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                The five rooms worth remembering
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Each concept is anchored to something you can picture instantly.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-400">
              {concepts.length} concepts
            </span>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {concepts.map((concept) => (
              <li
                key={concept.id}
                className="group rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.05] to-transparent p-4 transition hover:border-amber-300/30"
              >
                <h3 className="text-sm font-semibold text-slate-100">{concept.title}</h3>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-400">{concept.explanation}</p>
                <p className="mt-2 text-[12px] leading-5 text-amber-200/80 italic">
                  {concept.visualHint}
                </p>
              </li>
            ))}
            <li className="flex items-center justify-between rounded-2xl border border-dashed border-white/12 p-4">
              <p className="text-[13px] leading-5 text-slate-500">
                Finish all five and the guided tour plus the quiz unlock.
              </p>
              <Link
                href="/palace"
                className="shrink-0 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                Play
              </Link>
            </li>
          </ul>
        </section>

        <section id="build" className="scroll-mt-20 border-t border-white/8 py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Under the hood</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-400/10 via-slate-950/60 to-cyan-400/10 px-6 py-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            The palace is lit. Step inside.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
            First person controls, four warm rooms, and a house that remembers where you left
            off.
          </p>
          <Link
            href="/palace"
            className="mt-6 inline-block rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-200"
          >
            Enter the palace
          </Link>
        </section>
      </main>

      <footer className="relative mt-16 border-t border-white/8 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-[11px] text-slate-500 sm:flex-row">
          <p>Programming Palace · built with Next.js, three.js and React Three Fiber</p>
          <p className="font-mono">WASD to move · E to place</p>
        </div>
      </footer>
    </div>
  );
}
