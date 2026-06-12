# LearnLens AI

Turn notes into smarter revision.

LearnLens AI converts study notes into structured summaries, quizzes,
flashcards, and revision sheets using Gemini through a secure serverless API.

## Local development

```bash
npm install
npm run dev
```

For local API testing, run through Vercel:

```bash
vercel dev
```

Set `GEMINI_API_KEY` in `.env.local` or through Vercel environment variables.
Never expose it through a `VITE_` variable.

## Features

- Gemini-powered structured study-set generation
- Full sample mode when AI is unavailable
- Summary, quiz, flashcard, and revision-sheet views
- Saved study sets in localStorage
- Copy and text download exports
- Responsive desktop and mobile interface
