import { Assignment, TestCaseResult, AIFeedback } from "./types";

// -----------------------------------------------------------------------
// AIFeedbackService
//
// Calls Gemini (2.0/2.5 Flash) with a structured prompt and validates the
// JSON response against a fixed schema, per Section 3.6 Feature #5 of the
// proposal: strengths / improvements / overall_feedback, no score field.
//
// If GEMINI_API_KEY is not set (e.g. running this demo offline, or in an
// environment without internet access to Google's API), this falls back
// to a deterministic MOCK response built from the actual failed test
// cases, so the end-to-end flow still runs and is demoable without a key.
// Set GEMINI_API_KEY in your environment to get real AI-generated
// feedback instead of the mock.
// -----------------------------------------------------------------------

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function buildPrompt(
  assignment: Assignment,
  code: string,
  failedTests: TestCaseResult[]
): string {
  const contextFragment = assignment.instructorContextFlags.length
    ? `Instructor context rules to respect:\n- ${assignment.instructorContextFlags.join("\n- ")}\n`
    : "";

  const failedSummary = failedTests
    .map((t, i) => {
      const detail = t.hidden
        ? `Test ${i + 1} (${t.description}): FAILED (hidden test case — describe likely cause in general terms, do not invent exact input/output).`
        : `Test ${i + 1} (${t.description}): input="${t.stdin}", expected≈"${t.expected}", actual="${t.actualStdout ?? "(no output)"}", errorType=${t.errorType}`;
      return detail;
    })
    .join("\n");

  return `You are a supportive teaching assistant for a beginner Java course.
${contextFragment}
Problem statement:
${assignment.problemStatement}

Student's submitted code:
\`\`\`java
${code}
\`\`\`

Failed test cases:
${failedSummary}

Respond ONLY with a JSON object matching exactly this schema, no markdown fences, no extra text:
{"strengths": string, "improvements": string, "overall_feedback": string}
Do not include a numeric score anywhere in your response.`;
}

function buildCompileErrorPrompt(
  assignment: Assignment,
  code: string,
  compileError: string
): string {
  const contextFragment = assignment.instructorContextFlags.length
    ? `Instructor context rules to respect:\n- ${assignment.instructorContextFlags.join("\n- ")}\n`
    : "";

  return `You are a supportive teaching assistant for a beginner Java course.
${contextFragment}
Problem statement:
${assignment.problemStatement}

Student's submitted code:
\`\`\`java
${code}
\`\`\`

This code failed to COMPILE. The compiler error was:
${compileError}

Explain in beginner-friendly terms what's causing this specific compile error and how to fix it.
Respond ONLY with a JSON object matching exactly this schema, no markdown fences, no extra text:
{"strengths": string, "improvements": string, "overall_feedback": string}
Do not include a numeric score anywhere in your response.`;
}

function buildMockCompileErrorFeedback(compileError: string): AIFeedback {
  const classNameIssue = compileError.includes("should be declared in a file named");
  return {
    strengths: "The code was submitted in valid Java syntax structure overall — this is a naming/compilation issue, not a logic problem.",
    improvements: classNameIssue
      ? "Your public class name doesn't match what the grader expected for this checkpoint's filename. In Java, a public class must be named exactly the same as its .java file. Either rename your class to match the checkpoint's expected class name, or (if you're seeing this after the fix) this should now be auto-detected from your code."
      : `The compiler reported:\n${compileError.slice(0, 500)}\nRead the line number in the error and check for the specific issue (often a missing semicolon, bracket, or typo near that line).`,
    overall_feedback:
      "[MOCK FEEDBACK — no GEMINI_API_KEY set] This is a template response for a compile error, generated locally from the actual javac output rather than a real Gemini call.",
    source: "mock",
  };
}

export async function generateCompileErrorFeedback(
  assignment: Assignment,
  code: string,
  compileError: string
): Promise<AIFeedback> {
  const prompt = buildCompileErrorPrompt(assignment, code, compileError);
  const real = await callGemini(prompt);
  if (real) return real;
  return buildMockCompileErrorFeedback(compileError);
}

async function callGemini(prompt: string): Promise<AIFeedback | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              strengths: { type: "string" },
              improvements: { type: "string" },
              overall_feedback: { type: "string" },
            },
            required: ["strengths", "improvements", "overall_feedback"],
          },
        },
      }),
    });

    if (!res.ok) return null;
    const data: any = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    const parsed = JSON.parse(text);
    return {
      strengths: parsed.strengths,
      improvements: parsed.improvements,
      overall_feedback: parsed.overall_feedback,
      source: "gemini",
    };
  } catch {
    return null;
  }
}

function buildMockFeedback(
  assignment: Assignment,
  failedTests: TestCaseResult[]
): AIFeedback {
  const visibleFails = failedTests.filter((t) => !t.hidden);
  const hiddenCount = failedTests.length - visibleFails.length;

  const improvementLines = visibleFails.map(
    (t) =>
      `- "${t.description}": with input ${JSON.stringify(t.stdin)}, expected output around ${t.expected}, but got ${JSON.stringify(t.actualStdout || "(nothing)")}${
        t.errorType === "runtime_error" ? " — the program crashed before printing a result, check for unhandled input or a missing branch." : ""
      }${t.errorType === "timeout" ? " — the program never finished, check for an infinite loop or a Scanner waiting on input that never comes." : ""}`
  );

  return {
    strengths:
      "The program compiles and handles at least one branch of the if/else logic correctly.",
    improvements:
      (improvementLines.length
        ? improvementLines.join("\n")
        : "Some hidden test cases failed — double check edge cases like boundary values (exactly 40 hours, equal numbers, uppercase letters).") +
      (hiddenCount > 0
        ? `\n- ${hiddenCount} additional hidden test case(s) also failed; re-check edge cases mentioned in the problem statement.`
        : ""),
    overall_feedback:
      `[MOCK FEEDBACK — no GEMINI_API_KEY set] This is a template response generated locally from the failed test case data, ` +
      `standing in for what Gemini would return. It follows the exact same JSON shape (strengths / improvements / overall_feedback) ` +
      `so the rest of the pipeline (UI, storage, CSV export) works identically once a real API key is added for "${assignment.title}".`,
    source: "mock",
  };
}

export async function generateFeedback(
  assignment: Assignment,
  code: string,
  failedTests: TestCaseResult[]
): Promise<AIFeedback> {
  const prompt = buildPrompt(assignment, code, failedTests);
  const real = await callGemini(prompt);
  if (real) return real;
  return buildMockFeedback(assignment, failedTests);
}
