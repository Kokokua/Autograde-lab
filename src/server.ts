import express from "express";
import path from "path";
import { randomUUID } from "crypto";
import { assignments, getAssignment } from "./assignments";
import { gradeSubmission } from "./gradingService";
import { generateFeedback, generateCompileErrorFeedback } from "./aiFeedbackService";
import { SubmissionResponse } from "./types";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

// In-memory submission log — stands in for the PostgreSQL SUBMISSIONS +
// GRADING_ACTIONS tables from the proposal. Resets when the server restarts.
interface StoredSubmission extends SubmissionResponse {
  studentId: string;
  submittedAt: string;
}
const submissionLog: StoredSubmission[] = [];

app.get("/api/assignments", (_req, res) => {
  res.json(
    assignments.map((a) => ({
      id: a.id,
      title: a.title,
      deadline: a.deadline,
      problemStatement: a.problemStatement,
      className: a.className,
      // only show non-hidden test cases to the "student" side of the API
      visibleTestCases: a.testCases
        .filter((t) => !t.hidden)
        .map((t) => ({ description: t.description, stdin: t.stdin })),
      totalTestCases: a.testCases.length,
    }))
  );
});

app.post("/api/submit", async (req, res) => {
  const { assignmentId, studentId, code } = req.body ?? {};

  if (!assignmentId || !studentId || !code) {
    return res.status(400).json({ error: "assignmentId, studentId, and code are required." });
  }

  const assignment = getAssignment(assignmentId);
  if (!assignment) {
    return res.status(404).json({ error: `Unknown assignmentId: ${assignmentId}` });
  }
  if (typeof code !== "string" || code.length > 50_000) {
    return res.status(400).json({ error: "Code must be a string under 50KB." });
  }

  try {
    const grading = await gradeSubmission(assignment, code);

    // Matches proposal Feature #5: skip the AI call entirely if everything passed.
    let aiFeedback = null;
    if (!grading.compileSuccess) {
      aiFeedback = await generateCompileErrorFeedback(assignment, code, grading.compileError ?? "");
    } else {
      const failedTests = grading.testCaseResults.filter((t) => !t.passed);
      if (failedTests.length > 0) {
        aiFeedback = await generateFeedback(assignment, code, failedTests);
      }
    }

    const response: SubmissionResponse = {
      submissionId: randomUUID(),
      assignmentId,
      grading,
      aiFeedback,
    };

    submissionLog.push({ ...response, studentId, submittedAt: new Date().toISOString() });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Grading failed unexpectedly.", detail: String(err) });
  }
});

// Minimal stand-in for the teacher dashboard's submission list (Feature #6)
app.get("/api/submissions", (_req, res) => {
  res.json(
    submissionLog
      .slice()
      .reverse()
      .map((s) => ({
        submissionId: s.submissionId,
        studentId: s.studentId,
        assignmentId: s.assignmentId,
        submittedAt: s.submittedAt,
        percentage: s.grading.percentage,
        compileSuccess: s.grading.compileSuccess,
      }))
  );
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`AutoGrade Lab demo running at http://localhost:${PORT}`);
  console.log(
    process.env.GEMINI_API_KEY
      ? "Gemini API key detected — using real AI feedback."
      : "No GEMINI_API_KEY set — using mock AI feedback (set the env var for real Gemini calls)."
  );
});
