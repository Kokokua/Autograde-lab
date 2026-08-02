# 🔍 UI Analysis: CMU Autolab Website Grader vs. AutoGrade Lab Demo

> **Date:** 2026-07-24  
> **Reference Screenshots:**  
> - `Screenshot 2026-07-24 134355.png` — CMU Autolab "Choose a contest" page  
> - `Screenshot 2026-07-24 135101.png` — CMU Autolab student dashboard (inside a contest)  
>
> **Project:** AutoGrade Lab — MVP Demo (`autograde-demo`)

---

## 📸 Screenshot #1 — Contest Selection Page

The first screenshot shows the **CMU Autolab** grading platform's contest selection page:

| Element | Description |
|---|---|
| **Page Title** | "Choose a contest" (bold, left-aligned heading) |
| **Container** | Light gray rounded card (`#f5f5f5`-ish background), full-width, padded |
| **Contest List** | Two items in a white list with subtle borders |
| **Item 1** | `🚫 Instructors Only 🔴` — restricted, non-clickable, with emoji indicators |
| **Item 2** | `Task451(dateline 2026-08-21)` — clickable link (cyan/teal color `#17a2b8`), shows task name + deadline |

### Key Design Patterns

1. **Minimalist Layout** — clean, no visual clutter; single-purpose page
2. **Role-Based Visibility** — "Instructors Only" items are visible but visually blocked (🚫 + 🔴 icons)
3. **Task = Contest** — Autolab calls assignments "contests" — each has a name and a **deadline**
4. **Link-Based Navigation** — clicking a task name navigates to the submission page
5. **No Sidebar / No Header Nav** — simple, standalone page (typical of Autolab's minimal Rails UI)

---

## 📸 Screenshot #2 — Student Dashboard (Inside Contest)

The second screenshot reveals the **full student view** after entering a contest. This is the most important screen for your adaptation. Here's everything it shows:

### Header Bar
| Element | Detail |
|---|---|
| **Title** | `Task451(dateline 2026-08-21)` — orange/yellow background bar |
| **User Info** | `Logged in as Rattananarin Yodruan (a670510676)` — shows **full name + student ID** |
| **Logout** | Orange `Logout` button on the top-right |

### Left Sidebar Navigation
| Item | Description |
|---|---|
| **Server time** | `13:50:57` — real-time server clock |
| **Time left** | `689:09:02` — live countdown timer until deadline |
| **Overview** | Currently active (highlighted in cyan/blue) |
| **Communication** | Link to announcements/messages from instructors |
| **TASK451_1** | Sub-task group with → `📄 Statement` and `⭐ Submissions` links |
| **TASK451_2** | Same structure — `📄 Statement` and `⭐ Submissions` links |
| **Documentation** | External docs link |
| **Testing** | Testing/practice mode link |

### Main Content — "Overview" Page

**General Information:**
- "The contest is currently running."
- "The contest started at Jan 1, 2000, 7:00:00 AM and will end at Aug 22, 2026, 7:00:00 AM."

**Task Overview Table:**

| Column | Example Values |
|---|---|
| **Score** | `0 / 100` (red/pink background when 0) |
| **Task** | `task451_1`, `task451_2` (bold, clickable) |
| **Name** | `task451_1Divide and Conqure`, `task451_2greedyAlgorithm(nlognTime)` |
| **Time limit** | `0.100 seconds` |
| **Memory limit** | `8.00 MiB` |
| **Type** | `Batch` |
| **Files** | `task451_1[.cpp|.c|.py]`, `task451_2[.cpp|.c|.py]` — accepted file extensions |

### Footer
- "Contest Management System is released under the GNU Affero General Public License."
- This confirms the platform is **CMS (Contest Management System)**, not Autolab — it's the same system used for IOI-style competitive programming contests.

### 🔑 Critical Insights from Screenshot #2

1. **Countdown Timer** — Students see a live `Time left: 689:09:02` countdown — creates urgency and clarity
2. **Per-Task Score Tracking** — Score shown as `0 / 100` with red background for 0 scores — immediate visual feedback
3. **Time & Memory Limits** — Each task shows `0.100 seconds` and `8.00 MiB` constraints — this is the sandbox specification
4. **Multi-Language Support** — Accepts `.cpp`, `.c`, `.py` files — not just Java
5. **Task Grouping** — A single "contest" contains multiple tasks (task451_1, task451_2), each with its own Statement and Submissions
6. **Statement + Submissions Split** — The problem statement and submission history are separate pages per task
7. **Communication Channel** — Built-in messaging between instructors and students
8. **Batch Type** — Tasks are "Batch" type (stdin → stdout), same as your grading model

---

## 📸 Screenshot #3 — Task Statement Page

This page shows the **problem statement and technical details** for a single task (`task451_1 — Divide and Conquer`):

### Page Title
`task451_1Divide and Conqure (task451_1)` description

### Statement Section
- **"Download task statement"** — a prominent **green button** that downloads a **PDF file** containing the full problem description
- This is a key pattern: the problem statement is a **separate PDF document**, not inline text

### "Some details" Table

| Field | Value |
|---|---|
| **Type** | Batch |
| **Time limit** | 0.100 seconds |
| **Memory limit** | 8.00 MiB |
| **Compilation commands** | (see below) |

### Compilation Commands (per language)

| Language | Command |
|---|---|
| **C++20 / g++** | `/usr/bin/g++ -DEVAL -std=c++20 -O2 -pipe -static -s -o task451_1 task451_1.cpp` |
| **C11 / gcc** | `/usr/bin/gcc -DEVAL -std=c11 -O2 -pipe -static -s -o task451_1 task451_1.c -lm` |
| **Python 3 / CPython** | `/usr/bin/python3 -m compileall -b .` → `/bin/mv task451_1.pyc __main__.pyc` → `/usr/bin/zip task451_1.pyz __main__.pyc` |

### 🔑 Key Insights from Statement Page

1. **PDF-based Problem Statements** — Problems are distributed as downloadable PDFs, not inline text
2. **Transparent Compilation** — Students can see the exact compiler flags and commands used
3. **Multi-language Details** — Each supported language has its own compilation pipeline shown
4. **Technical Constraints Visible** — Time/memory limits are repeated here so students know the exact constraints while reading the problem

---

## 📸 Screenshot #4 — Submissions Page

This page shows the **submission interface and history** for `task451_1`:

### Score Banner
- **`Score: 0 / 100`** — displayed in a **full-width red/pink banner** at the top
- Very prominent visual — immediately tells the student their current standing

### "Submit a solution" Form

| Element | Detail |
|---|---|
| **File label** | `task451_1:` — identifies which task this upload is for |
| **File input** | `Choose File` button + `No file chosen` text — standard HTML file upload |
| **Language selector** | Dropdown defaulting to `C++20 / g++` |
| **Submit button** | Green `Submit` button |
| **Reset button** | Gray `Reset` button to clear the form |

### "Previous submissions" Table

| Column | Description |
|---|---|
| **Time** | Timestamp of submission |
| **Status** | Compilation/evaluation status |
| **Score** | Points received |
| **Files** | Submitted filename(s) |
| *(Currently)* | `no submissions` — empty state |

### 🔑 Key Insights from Submissions Page

1. **File Upload Model** — CMS uses file upload, NOT an inline code editor — your textarea approach is actually more convenient
2. **Language Selector** — Dropdown to pick language (C++20/g++, C11/gcc, Python 3) before submitting
3. **Persistent Score Banner** — Always-visible score at the top in red/pink — strong visual motivator
4. **Structured History Table** — Time / Status / Score / Files columns — more structured than your current flat list
5. **Per-Task Submission** — Each task has its OWN submission page, unlike your unified form

---

## 📸 Screenshot #5 — Communication Page

This page shows the **student ↔ instructor Q&A system**:

### "Questions" Form

| Element | Detail |
|---|---|
| **Subject** | Text input for the question title |
| **Text** | Textarea for the detailed question body |
| **Ask question** | Blue submit button |
| **Reset** | Gray reset button |

### 🔑 Key Insights from Communication Page

1. **Built-in Q&A** — Students can ask questions to instructors directly within the platform
2. **Structured Messages** — Subject + body format (like email), not a free-form chat
3. **Contest-scoped** — Questions are tied to the specific contest/assignment
4. **No Chat UI** — This is a simple form-based Q&A, not a real-time chat — relatively basic

---

## 🔄 Comparison: CMS/Autolab vs. Your AutoGrade Lab Demo

| Feature | CMS Student Dashboard | Your AutoGrade Lab Demo | Gap / Opportunity |
|---|---|---|---|
| **Assignment Selection** | Separate "Choose a contest" page → sidebar per task | Dropdown `<select>` with `<optgroup>` grouping | ✅ Your approach is **better** for single-page UX |
| **Deadline / Countdown** | Header shows deadline + live `Time left: 689:09:02` countdown | ❌ **No deadline or timer** | 🔴 **High priority** — add deadline + countdown timer |
| **Server Time** | Shows `Server time: 13:50:57` | ❌ Not shown | 🔸 Nice-to-have for exam fairness |
| **User Identity Bar** | `Logged in as Rattananarin Yodruan (a670510676)` + Logout | Only a Student ID input field | ⚠️ Add user display bar (even mock) |
| **Task Overview Table** | Table with Score, Task, Name, Time limit, Memory limit, Type, Files | ❌ No overview table | 🔴 **High priority** — add a task overview panel |
| **Per-Task Score** | `0 / 100` with **full-width red/pink banner** | Score shown only after submission | ⚠️ Show persistent score banner |
| **Time & Memory Limits** | `0.100 seconds`, `8.00 MiB` displayed per task | Only wall-clock timeout internally (5s), not shown to user | ⚠️ Display limits in UI |
| **Problem Statement** | **PDF download** button (`Download task statement`) + inline details table | Inline text in a `<div>` box | 🔸 Your inline approach is fine; consider adding PDF export |
| **Compilation Commands** | Shows exact compiler flags per language (g++, gcc, python3) | Uses `javac`/`java` internally, not shown to students | ⚠️ Show compilation info for transparency |
| **Code Submission** | **File upload** (`Choose File`) + language dropdown | Inline `<textarea>` editor | ✅ Your inline editor is **more convenient** |
| **Submission History** | Structured table: Time / Status / Score / Files | Flat card list: Student / Score / Assignment / Time | ⚠️ Add Status column and structure as table |
| **Role Restrictions** | `🚫 Instructors Only 🔴` on contest page | ❌ No role/auth system | Expected — out-of-scope for MVP |
| **Visual Theme** | Light gray + white, basic CMS look | Modern dark theme with glassmorphism | ✅ Your UI is **significantly more polished** |
| **Grading Results** | Shown on separate page after submission | Inline real-time results panel | ✅ Your UX is better — no page reload |
| **AI Feedback** | ❌ Not available | ✅ Gemini-powered feedback | ✅ **Major differentiator** |
| **Communication / Q&A** | Subject + Text form to ask instructors questions | ❌ Not implemented | 🔸 Nice-to-have for production |
| **Multi-Language** | `.cpp`, `.c`, `.py` with language selector dropdown | Java only | ⚠️ Expected for Java course — not a gap |
| **Test Case Details** | ❌ Only shows final score, no test case breakdown | ✅ Shows pass/fail per test with input/output/error | ✅ **Your demo is far better** |

---

## ✅ What Your Demo Already Does Well

1. **Single-Page Architecture** — No need for multi-page navigation like Autolab; everything is visible at once
2. **Modern Visual Design** — Dark/light theme toggle, gradient headers, rounded panels — far more polished than Autolab's Bootstrap 3 look
3. **Grouped Assignments** — `<optgroup>` for Lab 5 / Lab 11 / Lab 12 is cleaner than Autolab's flat list
4. **Real-Time Grading** — Results appear inline without page reload (Autolab requires navigating between pages)
5. **AI Feedback Loop** — This is your **key differentiator** over Autolab — the `strengths / improvements / overall_feedback` structure is excellent
6. **Test Case Transparency** — Showing pass/fail per test case with input/output detail is more informative than Autolab's basic score view

---

## ⚠️ Recommended Adaptations from CMS's Model

### 🔴 1. Add Deadline + Countdown Timer (HIGH PRIORITY)

CMS shows both a deadline in the header AND a live countdown. This is the #1 missing feature.

**Where to change:**
- [types.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/types.ts) — Add `deadline?: string` to the `Assignment` interface
- [assignments.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/assignments.ts) — Add deadline values to each assignment
- [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) — Display deadline + live countdown near the assignment selector

```diff
 export interface Assignment {
   id: string;
   title: string;
+  deadline?: string;  // ISO date string, e.g. "2026-08-21T07:00:00"
   problemStatement: string;
   className: string;
   testCases: TestCase[];
   instructorContextFlags: string[];
 }
```

**UI suggestion** — add a countdown bar below the header:
```html
<div class="deadline-bar">
  📅 Due: Aug 21, 2026 · ⏱️ Time left: <span id="countdown">689:09:02</span>
</div>
```

### 🔴 2. Add a Task Overview Table (HIGH PRIORITY)

CMS shows a clean table with Score, Task, Name, Time limit, Memory limit, Type, and Files. This gives students an instant overview before they start coding.

**Proposed layout for your demo:**

```
┌────────┬──────────────────────────────┬───────────┬──────────┬────────┐
│ Score  │ Assignment                   │ Time Lim. │ Mem Lim. │ Status │
├────────┼──────────────────────────────┼───────────┼──────────┼────────┤
│ 0/100  │ CP#1 — Weekly Salary Calc.   │ 5.0s      │ 128 MiB  │ ⬚ Open │
│ 75/100 │ CP#2 — Compare Two Numbers   │ 5.0s      │ 128 MiB  │ ✅ 75% │
│ 0/100  │ CP#3 — Temperature Converter │ 5.0s      │ 128 MiB  │ ⬚ Open │
└────────┴──────────────────────────────┴───────────┴──────────┴────────┘
```

This could be displayed **above** or **instead of** the current dropdown selector.

### ⚠️ 3. Add a User Identity Bar

CMS shows `Logged in as Rattananarin Yodruan (a670510676)` in the header. Even without real auth, display the student info:

```diff
- <div class="demo-tag">Instructor Dashboard Mode</div>
+ <div class="demo-tag">👨‍🎓 Student: 662115099</div>
```

Or better yet, show both name and ID dynamically from the Student ID input.

### ⚠️ 4. Display Time & Memory Limits Per Assignment

CMS shows `0.100 seconds` and `8.00 MiB` for each task. Your [gradingService.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/gradingService.ts) already has `RUN_TIMEOUT_MS = 5000` — just surface this in the UI:

```diff
 export interface Assignment {
   // ... existing fields
+  timeLimitMs?: number;   // e.g. 5000
+  memoryLimitMb?: number; // e.g. 128 (shown only, not enforced in demo)
 }
```

### ⚠️ 5. Show Per-Assignment Score Summary

CMS shows `0 / 100` with a red/pink background for zero scores. Add a persistent score display:

```
┌──────────────────────────────────┐
│  📊 Your Scores                  │
│  CP#1 Salary:     ████████ 100%  │
│  CP#2 Compare:    ██████   75%   │
│  CP#3 Temp:       ░░░░░░    0%   │
└──────────────────────────────────┘
```

### 🔸 6. Consider a Sidebar Navigation (Nice-to-have)

CMS uses a left sidebar with:
- Overview
- Communication
- Per-task: Statement / Submissions

For your single-page app, this could be a **tab bar** instead:
```
[📋 Overview] [📝 Submit] [📊 Results] [📜 History]
```

### 🔸 7. Code Submission Strategy: Hybrid Inline Editor + `.java` File Attachment

CMS strictly uses **file uploads** (`Choose File`), whereas your demo currently uses an **inline `<textarea>` editor**.

**Recommendation: Implement a Dual-Mode Submission Component (Best of Both Worlds)**

| Submission Mode | Primary Audience / Purpose | Pros | Cons |
|---|---|---|---|
| **Inline Editor** (Current) | Live Professor Demos & Quick Testing | Fast UX, zero file dialogs, supports starter code templates | Awkward for multi-file or huge projects |
| **`.java` File Attachment** (CMS Style) | Real Student Workflow | Matches IDE output (IntelliJ / Eclipse / VS Code), natural for homework | Extra clicks required for quick demos |

#### Proposed Hybrid Component Design:
```
┌────────────────────────────────────────────────────────────┐
│ Java Source Code                                           │
│ [📝 Type Code]  [📎 Attach .java File]    ← Mode Tabs       │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ import java.util.Scanner;                              │ │
│ │ public class Salary { ... }                            │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ Or drag & drop a .java file into the editor area directly  │
└────────────────────────────────────────────────────────────┘
```
* **Default Tab:** Inline Editor with starter template pre-filled.
* **Secondary Tab / Drag-and-Drop:** Allows attaching or dropping a `.java` file, which automatically populates the code editor text before sending it to `/api/submit`.
* **Backend:** Remains 100% unified — both modes send `{ assignmentId, studentId, code }` JSON to `/api/submit`.

### ⚠️ 8. Add a Persistent Score Banner (from Submissions Page)

CMS shows a **full-width red/pink banner** at the top of the submissions page with `Score: 0 / 100`. This is always visible and creates a strong visual motivator.

**Adaptation for your demo:**
```html
<div class="score-banner" style="background: rgba(239,68,68,0.15); border: 1px solid var(--bad); 
     padding: 12px 20px; border-radius: 8px; text-align: center; font-weight: 700;">
  Score: <span id="currentScore">0 / 100</span>
</div>
```
- Show this **above** the code editor, updating after each submission
- Use green background when score ≥ 60%, red/pink when < 60%

### ⚠️ 9. Improve Submission History Structure (from Submissions Page)

CMS uses a proper table with **Time / Status / Score / Files** columns. Your current history is a flat card list. Upgrade to a structured table:

```
┌──────────┬──────────────┬─────────┬─────────┬─────────────────┐
│ Time     │ Assignment     │ Status  │ Score   │ Student          │
├──────────┼──────────────┼─────────┼─────────┼─────────────────┤
│ 14:23:01 │ CP#1 Salary    │ ✅ Pass │ 100%    │ 662115099        │
│ 14:20:15 │ CP#2 Compare   │ ⚠️ Fail │  75%    │ 662115099        │
│ 14:18:30 │ CP#1 Salary    │ ❌ Err  │   0%    │ 662115099        │
└──────────┴──────────────┴─────────┴─────────┴─────────────────┘
```

Add a **Status** column (`Pass` / `Fail` / `Compile Error`) based on `compileSuccess` and `percentage`.

### 🔸 10. Show Compilation Info (from Statement Page)

CMS transparently shows the exact compilation commands used. For your demo, display the Java compilation pipeline:

```html
<div class="compile-info">
  <strong>Compilation:</strong> javac YourClass.java
  <strong>Execution:</strong> java YourClass (timeout: 5s)
</div>
```

This builds trust with students — they know exactly how their code is being compiled and run.

---

## 🏗️ Architecture Mapping

Here's how your project files map to what CMS does:

| Your File | Role | CMS Equivalent |
|---|---|---|
| [server.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/server.ts) | Express API server | CMS ContestWebServer (Python/Tornado) |
| [assignments.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/assignments.ts) | In-memory assignment data | PostgreSQL `tasks` table |
| [gradingService.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/gradingService.ts) | javac/java subprocess grading | CMS Worker (isolate sandbox with cgroups) |
| [aiFeedbackService.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/aiFeedbackService.ts) | Gemini AI feedback | ❌ **Does not exist in CMS** — this is your innovation |
| [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) | Single-page frontend | CMS Jinja2 templates (multi-page) |
| [types.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/types.ts) | TypeScript interfaces | CMS SQLAlchemy models |
| ❌ Not implemented | Countdown timer / Server time | CMS JavaScript timer in sidebar |
| ❌ Not implemented | Task overview table | CMS `TaskOverviewHandler` |
| ❌ Not implemented | PDF problem statement download | CMS `TaskStatementHandler` (serves PDF) |
| ❌ Not implemented | Compilation command display | CMS task details page (shows compiler flags) |
| ❌ Not implemented | Communication / Q&A | CMS `CommunicationHandler` |
| ✅ Inline `<textarea>` | Code editor (better than CMS) | CMS file upload only (`<input type="file">`) |

---

## 📊 Summary Scorecard

| Criteria | CMS (Autolab) | Your Demo | Winner |
|---|---|---|---|
| Visual Design | ⭐⭐ (Basic Bootstrap) | ⭐⭐⭐⭐⭐ (Modern dark theme) | **You** |
| UX Flow | ⭐⭐⭐ (Multi-page, 5+ pages) | ⭐⭐⭐⭐⭐ (Single-page) | **You** |
| AI Feedback | ❌ None | ⭐⭐⭐⭐⭐ | **You** |
| Test Case Detail | ⭐ (Score only, zero detail) | ⭐⭐⭐⭐⭐ (Input/output/error) | **You** |
| Code Submission | ⭐⭐ (File upload only) | ⭐⭐⭐⭐ (Inline editor + templates) | **You** |
| Problem Statement | ⭐⭐⭐⭐ (PDF download + details) | ⭐⭐⭐ (Inline text only) | **CMS** |
| Deadline + Countdown | ⭐⭐⭐⭐⭐ (Live timer) | ❌ Missing | **CMS** |
| Task Overview Table | ⭐⭐⭐⭐⭐ (Score/limits/files) | ❌ Missing | **CMS** |
| Score Banner | ⭐⭐⭐⭐⭐ (Full-width, persistent) | ⭐⭐ (Only after submit) | **CMS** |
| User Identity Bar | ⭐⭐⭐⭐ (Name + ID + Logout) | ⭐⭐ (ID input only) | **CMS** |
| Compilation Transparency | ⭐⭐⭐⭐⭐ (Exact flags shown) | ❌ Hidden | **CMS** |
| Time/Memory Limits | ⭐⭐⭐⭐⭐ (Displayed + enforced) | ⭐⭐ (Exists but not shown) | **CMS** |
| Submission History | ⭐⭐⭐⭐ (Structured table) | ⭐⭐⭐ (Flat card list) | **CMS** |
| Communication / Q&A | ⭐⭐⭐ (Basic form) | ❌ Not implemented | **CMS** |
| Role/Auth | ⭐⭐⭐⭐⭐ (Full RBAC) | ❌ Not implemented | **CMS** |
| Sandbox Security | ⭐⭐⭐⭐⭐ (isolate + cgroups) | ⭐⭐ (Basic timeout) | **CMS** |

**Final Score: You win 5 categories, CMS wins 11 — but your 5 wins are the ones that matter most for a demo (design, AI, UX, test detail, inline editing).**

---

## 🎯 Implementation Priority Matrix

| Priority | Feature | Effort | Impact | Files to Change |
|---|---|---|---|---|
| 🔴 P0 | Deadline + countdown timer | ~2 hrs | High | [types.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/types.ts), [assignments.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/assignments.ts), [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) |
| 🔴 P0 | Task overview table | ~3 hrs | High | [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html), [server.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/server.ts) |
| 🔴 P0 | Persistent score banner | ~1 hr | High | [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) |
| 🟡 P1 | User identity bar in header | ~30 min | Medium | [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) |
| 🟡 P1 | Display time/memory limits | ~1 hr | Medium | [types.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/types.ts), [assignments.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/assignments.ts), [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) |
| 🟡 P1 | Structured submission history table | ~1.5 hrs | Medium | [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) |
| 🟡 P1 | Show compilation info | ~30 min | Medium | [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) |
| 🟡 P1 | Hybrid `.java` file upload tab + drag & drop | ~1 hr | Medium | [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) |
| 🔵 P2 | Tab/sidebar navigation | ~3 hrs | Low | [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) |
| 🔵 P2 | Code editor (CodeMirror) | ~2 hrs | Low | [index.html](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/public/index.html) |
| 🔵 P2 | Q&A communication form | ~3 hrs | Low | New files + [server.ts](file:///D:/CMU/4th/autograde-lab-demo/autograde-demo/src/server.ts) |

---

> [!TIP]
> **Top 5 actions to make your demo match the CMS student experience:**
> 1. 🔴 Add `deadline` + live countdown timer (the most visible missing feature)
> 2. 🔴 Add a Task Overview table showing Score / Time Limit / Memory Limit per assignment
> 3. 🔴 Add a persistent score banner (full-width, red/green based on pass/fail)
> 4. 🟡 Show compilation info and time/memory limits for transparency
> 5. 🟡 Upgrade submission history from flat cards to a structured table

> [!IMPORTANT]
> Your demo's **AI feedback feature** is the #1 differentiator from CMS. CMS shows only a raw score (`0 / 100`) with **zero explanation** and **zero test case detail** — students have no idea what went wrong. Your Gemini-powered `strengths / improvements / overall_feedback` + per-test-case input/output breakdown is a **massive upgrade**. This is your strongest selling point.

> [!NOTE]
> The platform shown in the screenshots is **CMS (Contest Management System)** — an IOI-style competitive programming judge — not CMU Autolab. The footer confirms: *"Contest Management System is released under the GNU Affero General Public License."* Key differences from Autolab: CMS is more contest/exam oriented, uses file upload instead of inline editing, and provides no feedback beyond a numeric score.
