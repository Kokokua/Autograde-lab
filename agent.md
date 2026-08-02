# Agent Update Log

## Codebase Overview
This project is an interactive multi-lab auto-grader ("AutoGrade Lab - Advanced Demo") built with Node.js and TypeScript. It consists of:
- **Frontend**: A single-page application in `public/index.html` providing a LeetCode-style code editor and dashboard.
- **Backend**: Express server (`src/server.ts`) processing code submissions.
- **Grading Engine**: Custom logic (`src/gradingService.ts`) executing Java files using local compilation (`javac`/`java`) with varying checkers (`numberTolerance`, `containsAllSubstrings`, `matchesRegex`).
- **Configuration**: Assignment data and test cases are strictly defined in `src/assignments.ts`.
- **AI Feedback**: Automated Gemini-based feedback in `src/aiFeedbackService.ts`.

## Changes Made

### 1. Developer Plugins Page Creation
- **File**: `!my/index.html` & `!my/plugins.html`
- **Action**: Created stylized HTML pages listing popular developer plugins for the Antigravity community (Chrome DevTools, Firebase, SDK, agy-hud, etc.).

### 2. LeetCode-style Code Stubs (Frontend)
- **File**: `public/index.html`
- **Action**: Modified `starterTemplates`. Removed full solutions and replaced them with LeetCode-style code stubs containing:
  - Correct `public class` definitions that match the backend's expectations.
  - `main` method signatures.
  - Clear `// TODO:` comments indicating where to write logic.
  - Warning comments instructing students *not* to change the class name, eliminating common `public class must match filename` compilation errors.

### 3. Grammatical Corrections in Test Cases (Backend)
- **File**: `src/assignments.ts`
- **Assignment**: `checkpoint2-compare`
- **Action**: Fixed the `problemStatement` and original `expectedSubstrings` to expect grammatically correct English ("first number is *not* greater" instead of "no greater", and "two *numbers* are equal" instead of "two number").

### 4. Flexible Regex Grading System (Backend)
- **File**: `src/assignments.ts`
- **Assignment**: `checkpoint2-compare`
- **Action**: Upgraded the test cases to use the `matchesRegex` checker instead of strict substring matching.
  - TC1: `^(?!.*(not|no)).*first.*greater.*` (Allows variations without 'not/no').
  - TC2: `first.*(not|no).*greater|second.*greater` (Allows 'not greater', 'no greater', or just 'second is greater').
  - TC3: `equal|same` (Allows 'equal', 'same').
  - This solves the root cause of students failing due to minor sentence variations.

### 5. Disabled All Hidden Test Cases (Backend)
- **File**: `src/assignments.ts`
- **Action**: Replaced all instances of `hidden: true` with `hidden: false` across the entire configuration file.
- **Result**: All test case details (`stdin`, `expected`, `actualStdout`) are now fully visible to students in the frontend UI.

### 6. Added Lab 11 & Lab 12 Assignments (Backend & Frontend)
- **Files**: `src/assignments.ts`, `public/index.html`
- **Action**: Configured 4 new assignments covering Lab 11 (Single Dimension Array) and Lab 12 (Multidimensional Array). Included both Checkpoint 1 (Basic implementations) and Checkpoint 2 (Advanced methods/2D iterations). Added corresponding starter templates.

### 7. Frontend UI Overhaul & Dark/Light Mode
- **File**: `public/index.html`
- **Action**: 
  - Restructured the assignment dropdown menu using `<optgroup>` to group assignments cleanly by their respective Lab.
  - Implemented a fully functional Dark / Light mode toggle using CSS custom variables, inline SVG icons, and `localStorage` for persistent theme state.

### 8. Created PDF Extraction Script
- **File**: `!my/read_pdf.py`
- **Action**: Wrote a Python script utilizing `pymupdf4llm` to parse provided Lab PDF instructions and convert them into readable Markdown format.

### 9. Project Cleanup & Port Troubleshooting
- **Files**: Project Root, `!my.html`, `sandbox/`
- **Action**: 
  - Identified and safely removed unused files (`!my.html` at root) and directories (`sandbox`, as the Java grader operates in the OS temp directory).
  - Resolved `localhost:3000` caching and port collision issues (PID 11340) to ensure the UI successfully pulls the newly updated Lab 11 and Lab 12 configurations.

### 10. Added Deadline & Live Countdown Timer (Backend & Frontend)
- **Files**: `src/types.ts`, `src/assignments.ts`, `src/server.ts`, `public/index.html`
- **Action**:
  - Extended the `Assignment` data model and `/api/assignments` endpoint to include an optional `deadline` timestamp (ISO string format).
  - Configured deadline dates across all lab checkpoints in `src/assignments.ts`.
  - Added a live ticking countdown widget (`Time left: HHH:MM:SS`) to the frontend Submit panel in `public/index.html` that dynamically updates whenever an assignment is selected.

### 11. Platform UI Analysis & CMS Benchmarking Documentation
- **File**: `Example.md`
- **Action**:
  - Performed a comprehensive UI analysis benchmarking AutoGrade Lab against CMS (Contest Management System).
  - Evaluated 5 reference screenshots covering Contest Selection, Student Dashboard Overview, Task Statements, Submissions Form & History, and Communication Q&A pages.
  - Documented feature gaps, architecture mappings, scorecard, priority matrix, and recommended a hybrid submission strategy (Inline Editor + `.java` File Attachment).

### 12. Implemented CMS-Style Task Overview Table
- **File**: `public/index.html`
- **Action**:
  - Created a full-width **Task Overview & Status** panel at the top of the main layout, mirroring CMS's student overview dashboard.
  - Formatted a clean table displaying: Score Badges (`0 / 100` red, `75 / 100` orange, `100 / 100` green), Task ID, Task Name, Time Limit (5.000s), Memory Limit (128.00 MiB), Type (`Batch`), and Expected File (`[ClassName.java]`).
  - Added interactive row clicking (`selectTaskFromTable`) that automatically switches the active assignment, code stub, countdown timer, and problem statement.
  - Dynamically calculates the student's best percentage score per assignment whenever submissions update.

### 13. CMS-Style Sidebar Navigation & Multi-View Layout
- **File**: `public/index.html`
- **Action**:
  - Restructured the entire page layout from a 3-column grid to a **sidebar + content area** pattern, mirroring CMS's left navigation.
  - Added a sticky **sidebar nav** with: Overview, Communication, per-task Statement/Submissions links (auto-populated from assignment data), Documentation, and Testing.
  - Implemented **5 switchable views**: Overview (task table), Statement (problem details + compilation info), Submissions (code editor + grading), Communication (Q&A form), Documentation, and Testing placeholders.
  - Each task in the sidebar shows its `className` as the section header with 📄 Statement and 📮 Submissions sub-links.
  - Statement view renders: task title, problem statement, and a details table (Type, Time limit, Memory limit, Compilation command, Execution command).
  - Clicking a row in the Overview table now navigates to the Submissions view for that task.
  - Responsive: sidebar collapses to horizontal on screens ≤900px.

### 14. Grouped Task Overview Table by Lab Sections
- **File**: `public/index.html`
- **Action**:
  - Grouped the flat task rows in the **Task Overview & Status** table into visual sections matching the drop-down list grouping ("Lab 5: If/Else Statement", "Lab 11: Single Dimension Array", "Lab 12: Multidimensional Array").
  - Rendered clean separator group headers with 📂 icons and custom accent colors to demarcate each Lab section clearly.
  - Indented task rows under their corresponding Lab headers for improved readability.

### 15. Fixed Grading Results Persistence on Task Switch
- **File**: `public/index.html`
- **Action**:
  - Fixed a bug where switching to a new assignment (via the dropdown, sidebar, or Overview table click) would keep displaying the old grading score and test case results of the previously submitted task in the **Grading Results** panel.
  - Updated the `updateProblem()` function to automatically reset the **Grading Results** panel (`resultsDiv`) to its default placeholder message ("Submit code to see grading results and AI feedback here.") and restore its `.empty` CSS styling state on switch.

### 16. Added Sidebar Time Widgets (Server Time & Time Left)
- **File**: `public/index.html`
- **Action**:
  - Implemented a time widget section at the top of the left sidebar navigation, matching CMS.
  - Added a live-ticking **Server time** clock (`sidebarServerTime`) using a client-side interval.
  - Moved the selected task's active **Time left** countdown timer to the top of the sidebar (`sidebarTimeLeft`), updating dynamically when tasks are switched.
  - Combined both countdown displays to ensure students can see their deadline timer constantly from any view (Overview, Statement, or Submissions).

### 17. Added Lab 11 Checkpoint #3 (ReverseArray)
- **Files**: `src/assignments.ts`, `public/index.html`
- **Action**:
  - Added `lab11-array-reverse` (`ReverseArray`) as Checkpoint #3 for Lab 11.
  - Defined problem statement requiring students to implement a `reverse(double[] list)` method.
  - Added test cases (`tc1` for integer reversal, `tc2` for decimal reversal).
  - Configured starter code template in `public/index.html` and updated `getDisplayTitle`, dropdown rendering, and sidebar sorting to properly display all 3 Checkpoints for Lab 11 (`CP#1 — AnalyzeNumbers (Basic)`, `CP#2 — AnalyzeNumbers`, and `CP#3 — ReverseArray`).

### 19. Git Repository Audit & Branching Strategy Setup
- **File**: `.gitignore`, `agent.md`, Git Branches
- **Action**:
  - Performed a comprehensive Git tracking audit confirming safe exclusion of `node_modules/`, `dist/`, `!my/`, `.env`, `*.log`, and system junk files (`.DS_Store`).
  - Established standard Git Workflow & Branching Strategy:
    - `main`: Stable production releases.
    - `develop`: Integration & staging branch for features.
    - `feature/ui-enhancements`: Feature branch dedicated to frontend UI & CMS layout upgrades.
    - `feature/grading-system`: Feature branch dedicated to Java grading engine & assignment configuration.
    - `feature/ai-feedback`: Feature branch dedicated to Gemini AI Feedback service updates.
  - Successfully created and pushed all branches (`develop`, `feature/*`) to GitHub origin repository (`https://github.com/Kokokua/Autograde-lab.git`).

### 20. Implemented Dual Submission Mode (Inline Editor + `.java` Drag & Drop)
- **File**: `public/index.html`
- **Action**:
  - Implemented a dual-mode submission interface allowing students to switch between `📝 Live Editor` (LeetCode-style `<textarea>`) and `📎 Attach .java File` (CMS-style Drag & Drop zone).
  - Added HTML5 `FileReader` API integration to automatically parse uploaded/dragged `.java` files client-side, populating the code payload seamlessly for `/api/submit`.
  - Added drag-and-drop event listeners on both the dedicated dropzone AND directly on the editor textarea.
  - Implemented file extension validation (`.java` only) and file size safety limit (max 500 KB).

---

## Current Core Codebase Architecture Summary (Excluding `!my/`)

| Core Component | Primary Files | Description / Key Capabilities |
|---|---|---|
| **Frontend UI** | [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) | CMS-style SPA with Left Sidebar Navigation, 5 Multi-Views (Overview, Statement, Submissions, Communication, Documentation), Grouped Task Overview Table with Best Score Badges, Live Server Time Clock, Time Left Countdown Timer, LeetCode-style Starter Code Stubs, and Persistent Dark/Light Mode. |
| **Backend API** | [server.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/server.ts) | Express HTTP server serving static assets and endpoints (`GET /api/assignments`, `POST /api/submit`, `GET /api/submissions`). |
| **Grading Engine** | [gradingService.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/gradingService.ts) | Java sandbox executing `javac`/`java` via local subprocesses in OS temp directories. Enforces timeouts (10s compile, 5s run) and evaluates checkers (`numberTolerance`, `containsAllSubstrings`, `matchesRegex`). |
| **AI Feedback** | [aiFeedbackService.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/aiFeedbackService.ts) | Gemini 2.0 Flash integration with structured JSON response schema (`strengths`, `improvements`, `overall_feedback`). Includes mock fallback, skips AI call on 100% pass, and enforces deterministic scoring (AI cannot alter scores). |
| **Assignments Configuration** | [assignments.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/assignments.ts), [types.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/types.ts) | Strictly typed assignment models covering 7 Checkpoints across Lab 5 (If/Else), Lab 11 (1D Arrays), and Lab 12 (2D Matrices). Defines test cases, weights, checkers, instructor flags, and deadlines. |
| **Development Engine** | [package.json](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/package.json), [tsconfig.json](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/tsconfig.json) | Node.js + TypeScript setup configured with `npx tsx watch src/server.ts` for instant hot-reloading during development. |



