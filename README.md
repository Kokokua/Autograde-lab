# AutoGrade Lab — MVP Demo

A working, end-to-end demo of the core AutoGrade Lab loop for your professor:
**student submits Java code → auto-graded → AI feedback on failures.**

Built from the real **Lab 5 (If/Else Statement)** handout you uploaded, using
all 3 checkpoints (salary calculator, number comparison, temperature
converter — reworked as console-based instead of GUI so it can be
auto-graded the same way).

This is deliberately a **simplified stack**, not the final system from the
proposal — see "How this maps to the proposal" below for what's swapped out
and why.

## Requirements

- Node.js 18+ and npm
- A JDK (not just a JRE) — `javac` must be on your PATH.
  Check with: `javac -version`
  If missing on Ubuntu/Debian: `sudo apt-get install openjdk-21-jdk-headless`

## Running it

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in a browser.

Pick a checkpoint, edit the pre-filled Java code (or paste your own/a
student's), hit **Submit for Grading**, and you'll see:
- pass/fail per test case (hidden test cases show as locked 🔒, no details leaked)
- score breakdown
- AI feedback (only generated when at least one test case fails — matches
  the proposal's rule that Gemini is skipped entirely on all-pass submissions)

### Using real Gemini feedback instead of the mock

By default, no API key is set, so AI feedback comes from a **mock generator**
built from the actual failed test case data — clearly labeled in the UI, and
it follows the exact same JSON shape (`strengths` / `improvements` /
`overall_feedback`) that real Gemini output would have. This lets the whole
pipeline run and be demoed without a key or internet access.

To use real Gemini:
```bash
export GEMINI_API_KEY=your_key_here
npm run dev
```
Get a free key (no credit card) at https://aistudio.google.com/apikey — the
free tier (1,500 requests/day) is exactly what the proposal specifies.

## How this maps to the proposal

| Proposal (production) | This demo | Why |
|---|---|---|
| Next.js + React frontend | Single static HTML/JS page | Faster to build/run, no framework setup needed to prove the concept |
| Self-hosted Judge0 on Oracle Cloud | Direct `javac`/`java` subprocess with timeout | Same external interface (code+stdin in, stdout/errors out) — see `gradingService.ts` header comment for exactly what's missing vs. real Judge0 (memory limits, network isolation, cgroup CPU limits) |
| PostgreSQL + Prisma | In-memory array (`submissionLog` in `server.ts`) | No DB setup required to run this; resets on restart |
| Gemini 2.0 Flash, JSON-schema constrained | Same, with a mock fallback when no API key is set | Lets the demo run offline/without a key |
| 3-role auth (Student/TA/Instructor) | Not implemented | Out of scope for proving the grading+feedback loop |
| CSV export, bulk approve, audit log | Not implemented | Same reason — this demo proves Features #4 and #5 specifically |

The important thing preserved exactly: **the AI never computes or adjusts a
score** — `gradingService.ts` calculates `rawScore` deterministically from
test case weights before `aiFeedbackService.ts` is ever called, and the AI
response schema has no score field, matching Section 3.1 of the proposal
("Scoring authority").

## Project structure

```
src/
  types.ts              # shared data model
  assignments.ts        # the 3 checkpoints from Lab 5, with test cases
  gradingService.ts      # javac/java sandbox (swap-in point for real Judge0)
  aiFeedbackService.ts   # Gemini call + JSON schema + mock fallback
  server.ts              # Express API (/api/assignments, /api/submit, /api/submissions)
public/
  index.html             # frontend UI
```

## Known limitations (worth mentioning to your professor as "next steps")

- No sandboxing beyond a wall-clock timeout — a malicious submission could
  still do things a real Judge0 sandbox would block (this is exactly why the
  proposal specifies self-hosted Judge0 for the real system).
- In-memory storage only — submissions vanish on restart.
- No auth/roles yet — this proves the grading+feedback core, not the full
  permission model from Section 3.3 of the proposal.
