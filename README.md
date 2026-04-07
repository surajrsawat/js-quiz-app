# ⚡ ScriptSprint — JavaScript Quiz App

A fast-paced, feature-rich JavaScript quiz application built with React and TypeScript. Test your JS knowledge across multiple topics and difficulty levels, track your progress with XP and streaks, and challenge yourself with the daily quiz.

🔗 **[Live Production App → https://quiz-app.vercel.app](https://quiz-app.vercel.app)**

---

## Features

### Quiz Modes
- **Regular Quiz** — 60 randomized questions per run drawn from your selected topics and difficulty level.
- **Daily Challenge** — A fixed set of 10 deterministic questions that resets every day. Score at least 70% to mark it as completed. Your last score and completion status are persisted between sessions.

### Experience Levels
Choose your skill level before starting a quiz:
- Beginner
- Intermediate
- Expert

### Topic Selection
Pick one or more JavaScript topics to focus your quiz on:
- JavaScript Basics
- Language Mechanics
- Advanced JavaScript
- Data Structures
- Algorithms

### Question Types
- **MCQ (Multiple Choice)** — Select the correct answer from four options.
- **Coding** — Write a TypeScript/JavaScript solution in a built-in code editor. Submissions are auto-evaluated where possible, with a self-marking fallback ("Got it / Missed it").

### Difficulty Levels
Questions are tagged as **Easy**, **Medium**, or **High** difficulty and displayed on the question card.

### XP & Streak System
- Earn **Session XP** for every correct answer.
- **Total XP** accumulates across all sessions.
- **Current Streak** and **Best Streak** are tracked and shown live during the quiz and on the results screen.

### Per-Question Timer
Each question has a countdown timer. The timer turns red when fewer than 10 seconds remain and auto-submits when it reaches zero.

### Progress Bar
A visual progress bar shows how far through the quiz you are, along with the current question number and percentage complete.

### Weak Areas Dashboard
After completing a quiz, the results screen shows a personalized **Weak Areas Dashboard** broken down by:
- **Topic** — which JavaScript topics you struggled with most.
- **Question Type** — MCQ vs Coding accuracy.
- **Difficulty** — Easy / Medium / High accuracy.

Each entry shows wrong count, total count, and accuracy percentage, alongside a personalized recommendation.

### Detailed Review Screen
Dive into a question-by-question review of your answers after the quiz, including the correct answer, your response, and reference coding solutions.

### Session Persistence
Your quiz progress is saved automatically. If you leave mid-quiz you can **Resume** from where you stopped or **Start Fresh** the next time you open the app.

### Personalization
Enter your name before starting — it appears on the quiz header and result screen alongside your level.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build Tool | [Vite](https://vite.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + SCSS |
| State Management | [Zustand](https://zustand-demo.pmnd.rs) |
| Testing | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |
| Containerisation | [Docker](https://www.docker.com) |
| Deployment | [Vercel](https://vercel.com) |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v20 or later
- npm v10 or later

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run tests

```bash
npm test
```

### Run tests with coverage

```bash
npm run coverage
```

### Lint

```bash
npm run lint
```

### Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
├── app/            # Root App component
├── components/     # UI components (StartScreen, QuestionCard, ResultScreen, ReviewScreen, …)
├── data/           # Question bank
├── store/          # Zustand store (quiz state, XP, streaks, persistence)
├── styles/         # Global SCSS styles
└── types/          # TypeScript type definitions
```

---

## License

[MIT](./LICENSE)
