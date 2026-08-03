// Shared types for AutoGrade Lab demo.
// Mirrors the proposal's data model at a simplified, in-memory scale.

export type CheckerKind = "numberTolerance" | "containsAllSubstrings" | "matchesRegex";

export interface TestCase {
  id: string;
  description: string;
  stdin: string;          // fed to the program's Scanner, lines joined by \n
  weight: number;         // points this test case is worth
  checker: CheckerKind;
  hidden?: boolean;
  // For numberTolerance:
  expectedNumber?: number;
  tolerance?: number;
  // For containsAllSubstrings (case-insensitive):
  expectedSubstrings?: string[];
  // For matchesRegex (case-insensitive):
  expectedRegexPattern?: string;
}

export interface Assignment {
  id: string;
  title: string;
  deadline?: string;
  problemStatement: string;
  className: string;      // required public class name, e.g. "TestScore"
  pdfUrl?: string;        // URL to the original lab PDF file
  testCases: TestCase[];
  instructorContextFlags: string[]; // e.g. ["Explain using simple language for a beginner"]
}

export interface TestCaseResult {
  testCaseId: string;
  description: string;
  passed: boolean;
  weight: number;
  stdin?: string;
  expected?: string;
  actualStdout?: string;
  errorType?: "compile_error" | "runtime_error" | "timeout" | "wrong_output" | null;
  hidden?: boolean;
}

export interface GradingResult {
  compileSuccess: boolean;
  compileError?: string;
  testCaseResults: TestCaseResult[];
  rawScore: number;
  maxScore: number;
  percentage: number;
}

export interface AIFeedback {
  strengths: string;
  improvements: string;
  overall_feedback: string;
  source: "gemini" | "mock"; // "mock" used when no API key / offline, so the demo still runs end to end
}

export interface SubmissionResponse {
  submissionId: string;
  assignmentId: string;
  grading: GradingResult;
  aiFeedback: AIFeedback | null; // null if all tests passed (Gemini call is skipped, matches proposal 4.5)
}
