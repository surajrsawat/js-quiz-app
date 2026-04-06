---
description: "Add quiz questions through the Add Questions agent. Use when: /add-questions Coding \"CODE_HERE\" or /add-questions MCQ ..."
name: "add-questions"
argument-hint: "Coding \"CODE_HERE\" or MCQ \"Question\" options:[A|B|C|D] answer:\"B\""
agent: "add-questions"
---
Add one new question to the quiz data file using the provided input.

Input:
{{input}}

Requirements:
- Infer mode from the first token (`Coding` or `MCQ`).
- Ask only for missing required fields.
- Append exactly one valid object in [src/data/questions/questions.ts](../../src/data/questions/questions.ts).
- Keep existing style and section placement.
- In Coding mode, rewrite input code into a canonical expected answer before storing.
- Include metadata fields: `difficulty`, `topic`, and `tags`.
