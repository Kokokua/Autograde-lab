import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { Assignment, TestCase, TestCaseResult, GradingResult } from "./types";

// -----------------------------------------------------------------------
// GradingService
//
// In the full proposal, this role is played by self-hosted Judge0 on
// Oracle Cloud. For this demo, we implement the same *interface* — submit
// code + stdin, get back stdout/errors — using javac/java directly in a
// temp directory with a wall-clock timeout. Swapping this for a real
// Judge0Client later means implementing the same runOne() contract and
// changing which class gets instantiated in server.ts — not rewriting
// the grading logic, scoring rules, or API surface.
//
// Known limitations vs. real Judge0 (documented on purpose, not hidden):
//   - No memory ceiling enforcement (Judge0 sets memory_limit=128MB)
//   - No network isolation for the child process
//   - No cgroup-based CPU limiting, only a wall-clock timeout
// These are exactly the gaps self-hosted Judge0 is meant to close in
// production, per Section 2.2 of the proposal.
// -----------------------------------------------------------------------

const COMPILE_TIMEOUT_MS = 10_000;
const RUN_TIMEOUT_MS = 5_000;
const MAX_OUTPUT_CHARS = 5_000;

function runProcess(
  cmd: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
  stdin?: string
): Promise<{ stdout: string; stderr: string; timedOut: boolean; exitCode: number | null }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (d) => {
      if (stdout.length < MAX_OUTPUT_CHARS) stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      if (stderr.length < MAX_OUTPUT_CHARS) stderr += d.toString();
    });

    if (stdin !== undefined) {
      child.stdin.write(stdin);
    }
    child.stdin.end();

    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, timedOut, exitCode });
    });

    child.on("error", () => {
      clearTimeout(timer);
      resolve({ stdout, stderr: stderr || "Failed to start process", timedOut, exitCode: -1 });
    });
  });
}

function checkTestCase(tc: TestCase, actualStdout: string): boolean {
  const output = actualStdout.trim();
  if (tc.checker === "numberTolerance") {
    // Extract the last numeric token in the output (handles "$320.00" etc.)
    const matches = output.match(/-?\d+(\.\d+)?/g);
    if (!matches || matches.length === 0) return false;
    const actual = parseFloat(matches[matches.length - 1]);
    const expected = tc.expectedNumber ?? NaN;
    return Math.abs(actual - expected) <= (tc.tolerance ?? 0.01);
  }
  if (tc.checker === "containsAllSubstrings") {
    const lower = output.toLowerCase();
    return (tc.expectedSubstrings ?? []).every((s) => lower.includes(s.toLowerCase()));
  }
  if (tc.checker === "matchesRegex") {
    if (!tc.expectedRegexPattern) return false;
    const regex = new RegExp(tc.expectedRegexPattern, "i");
    return regex.test(output);
  }
  return false;
}

// Java requires the source filename to exactly match the public class name.
// We don't know in advance what the student will name their class, so we
// detect it from the submitted code itself (this is what real online judges
// do — Judge0's Java wrapper does the same kind of detection). If no public
// class is found, we fall back to the assignment's expected class name and
// let javac produce its normal error.
function detectPublicClassName(code: string, fallback: string): string {
  const match = code.match(/public\s+(?:final\s+|abstract\s+)?class\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
  return match ? match[1] : fallback;
}

export async function gradeSubmission(
  assignment: Assignment,
  studentCode: string
): Promise<GradingResult> {
  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "autograde-"));
  const detectedClassName = detectPublicClassName(studentCode, assignment.className);
  const sourceFile = path.join(workDir, `${detectedClassName}.java`);

  try {
    await fs.writeFile(sourceFile, studentCode, "utf-8");

    // --- Compile ---
    const compile = await runProcess(
      "javac",
      [`${detectedClassName}.java`],
      workDir,
      COMPILE_TIMEOUT_MS
    );

    if (compile.timedOut || compile.exitCode !== 0) {
      const testCaseResults: TestCaseResult[] = assignment.testCases.map((tc) => ({
        testCaseId: tc.id,
        description: tc.description,
        passed: false,
        weight: tc.weight,
        errorType: "compile_error",
        hidden: tc.hidden,
      }));
      return {
        compileSuccess: false,
        compileError: compile.timedOut
          ? "Compilation timed out."
          : compile.stderr.slice(0, 2000),
        testCaseResults,
        rawScore: 0,
        maxScore: assignment.testCases.reduce((s, t) => s + t.weight, 0),
        percentage: 0,
      };
    }

    // --- Run each test case ---
    const testCaseResults: TestCaseResult[] = [];
    for (const tc of assignment.testCases) {
      const run = await runProcess(
        "java",
        [detectedClassName],
        workDir,
        RUN_TIMEOUT_MS,
        tc.stdin
      );

      let errorType: TestCaseResult["errorType"] = null;
      let passed = false;

      if (run.timedOut) {
        errorType = "timeout";
      } else if (run.exitCode !== 0) {
        errorType = "runtime_error";
      } else {
        passed = checkTestCase(tc, run.stdout);
        if (!passed) errorType = "wrong_output";
      }

      testCaseResults.push({
        testCaseId: tc.id,
        description: tc.description,
        passed,
        weight: tc.weight,
        stdin: tc.stdin,
        expected: tc.checker === "numberTolerance"
          ? String(tc.expectedNumber)
          : tc.checker === "matchesRegex"
          ? `Matches pattern: ${tc.expectedRegexPattern}`
          : (tc.expectedSubstrings ?? []).join(" / "),
        actualStdout: run.stdout.trim().slice(0, 500),
        errorType,
        hidden: tc.hidden,
      });
    }

    const maxScore = assignment.testCases.reduce((s, t) => s + t.weight, 0);
    const rawScore = testCaseResults
      .filter((r) => r.passed)
      .reduce((s, r) => s + r.weight, 0);

    return {
      compileSuccess: true,
      testCaseResults,
      rawScore,
      maxScore,
      percentage: maxScore === 0 ? 0 : Math.round((rawScore / maxScore) * 100),
    };
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
  }
}
