import { Assignment } from "./types";

// These three assignments come directly from the uploaded "Lab 5 - If/Else
// Statement" (953100 Computers and Programming 1, SE-CAMT-CMU).
// Checkpoint 3 is reinterpreted as console-based (stdin/stdout) instead of
// GUI, per project decision, so it can be auto-graded the same way as 1 & 2.

export const assignments: Assignment[] = [
  {
    id: "checkpoint1-salary",
    title: "Checkpoint #1 — Weekly Salary Calculator",
    deadline: "2026-08-21T23:59:59",
    className: "Salary",
    pdfUrl: "/pdf/lab5-if-else.pdf",
    problemStatement:
      "Write a Java program to compute and display a person's weekly salary. " +
      "If hours worked <= 40, pay is $8.00/hour. If hours worked > 40, pay is " +
      "$320.00 plus $12.00 for each hour worked over 40. Read hours worked from " +
      "standard input (Scanner) as a number, then print the salary.",
    instructorContextFlags: [
      "This is an early-semester if/else exercise for beginners — keep feedback simple and encouraging.",
      "Do not assume the student knows loops or methods yet.",
    ],
    testCases: [
      {
        id: "tc1",
        description: "Exactly 40 hours (boundary case)",
        stdin: "40",
        weight: 25,
        hidden: false,
        checker: "numberTolerance",
        expectedNumber: 320,
        tolerance: 0.01,
      },
      {
        id: "tc2",
        description: "Under 40 hours",
        stdin: "20",
        weight: 25,
        hidden: false,
        checker: "numberTolerance",
        expectedNumber: 160,
        tolerance: 0.01,
      },
      {
        id: "tc3",
        description: "Over 40 hours",
        stdin: "45",
        weight: 25,
        hidden: false,
        checker: "numberTolerance",
        expectedNumber: 380,
        tolerance: 0.01,
      },
      {
        id: "tc4",
        description: "Zero hours (edge case)",
        stdin: "0",
        weight: 25,
        hidden: false,
        checker: "numberTolerance",
        expectedNumber: 0,
        tolerance: 0.01,
      },
    ],
  },
  {
    id: "checkpoint2-compare",
    title: "Checkpoint #2 — Compare Two Numbers",
    deadline: "2026-08-21T23:59:59",
    className: "CompareNumbers",
    pdfUrl: "/pdf/lab5-if-else.pdf",
    problemStatement:
      "Ask the user to input two numbers using Scanner. If the first number is " +
      "greater than the second, print: 'The first number is greater than the " +
      "second'. If the second is greater than the first, print: 'The first " +
      "number is not greater than the second'. Otherwise (they are equal), " +
      "print: 'These two numbers are equal'.",
    instructorContextFlags: [
      "This is an early-semester if/else exercise for beginners — keep feedback simple and encouraging.",
    ],
    testCases: [
      {
        id: "tc1",
        description: "First number greater",
        stdin: "5\n3",
        weight: 34,
        hidden: false,
        checker: "matchesRegex",
        expectedRegexPattern: "^(?!.*(not|no)).*first.*greater.*",
      },
      {
        id: "tc2",
        description: "Second number greater",
        stdin: "3\n5",
        weight: 33,
        hidden: false,
        checker: "matchesRegex",
        expectedRegexPattern: "first.*(not|no).*greater|second.*greater",
      },
      {
        id: "tc3",
        description: "Numbers equal",
        stdin: "7\n7",
        weight: 33,
        hidden: false,
        checker: "matchesRegex",
        expectedRegexPattern: "equal|same",
      },
    ],
  },
  {
    id: "checkpoint3-temperature",
    title: "Checkpoint #3 — Temperature Converter (console version)",
    deadline: "2026-08-21T23:59:59",
    className: "TempConvert",
    pdfUrl: "/pdf/lab5-if-else.pdf",
    problemStatement:
      "Read a single letter from input: 'c' means convert Fahrenheit to " +
      "Celsius using C = (F - 32) * 5 / 9. 'f' means convert Celsius to " +
      "Fahrenheit using F = (9 * C / 5) + 32. Then read the temperature value " +
      "and print the converted result. The program must accept both upper- and " +
      "lower-case letters ('C'/'c' and 'F'/'f').",
    instructorContextFlags: [
      "This is an early-semester if/else exercise for beginners — keep feedback simple and encouraging.",
      "The uppercase-letter handling is a 'challenge' extension in the original lab — call it out specifically if missing.",
    ],
    testCases: [
      {
        id: "tc1",
        description: "Lowercase c, Fahrenheit 212 -> Celsius 100",
        stdin: "c\n212",
        weight: 25,
        hidden: false,
        checker: "numberTolerance",
        expectedNumber: 100,
        tolerance: 0.1,
      },
      {
        id: "tc2",
        description: "Lowercase f, Celsius 0 -> Fahrenheit 32",
        stdin: "f\n0",
        weight: 25,
        hidden: false,
        checker: "numberTolerance",
        expectedNumber: 32,
        tolerance: 0.1,
      },
      {
        id: "tc3",
        description: "Uppercase C (challenge case), Fahrenheit 32 -> Celsius 0",
        stdin: "C\n32",
        weight: 25,
        hidden: false,
        checker: "numberTolerance",
        expectedNumber: 0,
        tolerance: 0.1,
      },
      {
        id: "tc4",
        description: "Uppercase F (challenge case), Celsius 100 -> Fahrenheit 212",
        stdin: "F\n100",
        weight: 25,
        hidden: false,
        checker: "numberTolerance",
        expectedNumber: 212,
        tolerance: 0.1,
      },
    ],
  },
  {
    id: "lab11-array",
    title: "Lab 11 — Single Dimension Array (AnalyzeNumbers)",
    deadline: "2026-08-28T23:59:59",
    className: "AnalyzeNumbers",
    pdfUrl: "/pdf/lab11-single-dimension-array.pdf",
    problemStatement:
      "Write a Java program to analyze a list of numbers. " +
      "First, read the number of elements (N) from standard input. Then, read N double values. " +
      "The program must display all values in the array, compute and display the sum, " +
      "average, maximum, and minimum values. " +
      "You must use the methods: printArray(double[] array), findMax(double[] array), and findMin(double[] array).",
    instructorContextFlags: [
      "Ensure the student implements printArray(), findMax(), and findMin() methods.",
      "Check if array bounds are handled correctly."
    ],
    testCases: [
      {
        id: "tc1",
        description: "5 positive numbers",
        stdin: "5\n10\n20\n30\n40\n50",
        weight: 30,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: ["sum", "150", "average", "30", "max", "50", "min", "10"]
      },
      {
        id: "tc2",
        description: "4 decimal and negative numbers",
        stdin: "4\n1.5\n-2.5\n4.0\n0",
        weight: 30,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: ["sum", "3", "average", "0.75", "max", "4", "min", "-2.5"]
      },
      {
        id: "tc3",
        description: "Single element edge case",
        stdin: "1\n99.9",
        weight: 40,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: ["sum", "99.9", "average", "99.9", "max", "99.9", "min", "99.9"]
      }
    ]
  },
  {
    id: "lab11-array-reverse",
    title: "Lab 11 Checkpoint #3 — Reverse Array (ReverseArray)",
    deadline: "2026-08-28T23:59:59",
    className: "ReverseArray",
    pdfUrl: "/pdf/lab11-single-dimension-array.pdf",
    problemStatement:
      "Write a Java program to reverse an array of numbers. " +
      "First, read the number of elements (N) from standard input, followed by N double values. " +
      "Create and call a method 'public static void reverse(double[] list)' to reverse the array in place, " +
      "then print all elements of the reversed array in a single line separated by spaces.",
    instructorContextFlags: [
      "Ensure the student implements the reverse(double[] list) method.",
      "Check that the array elements are swapped correctly in place or returned reversed."
    ],
    testCases: [
      {
        id: "tc1",
        description: "Reversing 5 integers",
        stdin: "5\n1\n2\n3\n4\n5",
        weight: 50,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: ["5", "4", "3", "2", "1"]
      },
      {
        id: "tc2",
        description: "Reversing 4 decimal numbers",
        stdin: "4\n10.5\n20.0\n30.5\n40.0",
        weight: 50,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: ["40", "30.5", "20", "10.5"]
      }
    ]
  },
  {
    id: "lab12-matrix",
    title: "Lab 12 — Multidimensional Array (GradeMultipleChoice)",
    deadline: "2026-09-04T23:59:59",
    className: "GradeMultipleChoice",
    pdfUrl: "/pdf/lab12-multidimension-array.pdf",
    problemStatement:
      "Write a Java program to grade multiple choice test sheets for 8 students. " +
      "The student answers are represented as an 8x10 two-dimensional character array. " +
      "Compare each student's answers to the correct key: {'D', 'B', 'D', 'C', 'C', 'D', 'A', 'E', 'A', 'D'}. " +
      "Print the correct score for each student (e.g., 'Student 0's correct count is 7').",
    instructorContextFlags: [
      "Check that the student correctly iterates over the 2D array.",
      "Ensure student indices (0 to 7) match the standard outer loop iteration."
    ],
    testCases: [
      {
        id: "tc1",
        description: "Standard answers grading test",
        stdin: "",
        weight: 100,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: [
          "Student 0's correct count is 7",
          "Student 1's correct count is 6",
          "Student 2's correct count is 5",
          "Student 3's correct count is 4",
          "Student 4's correct count is 8",
          "Student 5's correct count is 7",
          "Student 6's correct count is 7",
          "Student 7's correct count is 7"
        ]
      }
    ]
  },
  {
    id: "lab11-array-basic",
    title: "Lab 11 Checkpoint #1 — AnalyzeNumbers (Basic)",
    deadline: "2026-08-28T23:59:59",
    className: "AnalyzeNumbersBasic",
    pdfUrl: "/pdf/lab11-single-dimension-array.pdf",
    problemStatement:
      "Write a Java program to analyze a list of numbers in the main method. " +
      "First, read the number of elements (N) from standard input. Then, read N double values. " +
      "The program must display all values in the array, compute and display the sum, " +
      "average, maximum, and minimum values. Custom methods are NOT required for this checkpoint.",
    instructorContextFlags: [
      "No custom methods are required for this checkpoint.",
      "Check if array bounds are handled correctly."
    ],
    testCases: [
      {
        id: "tc1",
        description: "5 positive numbers",
        stdin: "5\n10\n20\n30\n40\n50",
        weight: 50,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: ["sum", "150", "average", "30", "max", "50", "min", "10"]
      },
      {
        id: "tc2",
        description: "4 decimal and negative numbers",
        stdin: "4\n1.5\n-2.5\n4.0\n0",
        weight: 50,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: ["sum", "3", "average", "0.75", "max", "4", "min", "-2.5"]
      }
    ]
  },
  {
    id: "lab12-matrix-basic",
    title: "Lab 12 Checkpoint #1 — PassTwoDimensionalArray",
    deadline: "2026-09-04T23:59:59",
    className: "PassTwoDimensionalArray",
    pdfUrl: "/pdf/lab12-multidimension-array.pdf",
    problemStatement:
      "Write a Java program to create a 3-by-4 two-dimensional integer array. " +
      "Read 12 integers from standard input into the array, print all values in grid format, " +
      "and compute and print the sum of all elements.",
    instructorContextFlags: [
      "Ensure the student correctly iterates over the 2D array.",
      "Check that the print output is structured as a 3-by-4 matrix."
    ],
    testCases: [
      {
        id: "tc1",
        description: "1 to 12 sequence",
        stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12",
        weight: 50,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: ["sum", "78", "1 2 3 4", "5 6 7 8", "9 10 11 12"]
      },
      {
        id: "tc2",
        description: "Zeroes and negatives",
        stdin: "0\n0\n0\n0\n-1\n-1\n-1\n-1\n-2\n-2\n-2\n-2",
        weight: 50,
        hidden: false,
        checker: "containsAllSubstrings",
        expectedSubstrings: ["sum", "-12", "0 0 0 0", "-1 -1 -1 -1", "-2 -2 -2 -2"]
      }
    ]
  }
];

export function getAssignment(id: string): Assignment | undefined {
  return assignments.find((a) => a.id === id);
}
