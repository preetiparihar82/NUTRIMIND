# NutriMind AI

A React + Vite + Tailwind + Recharts frontend for an AI-powered nutrition recommendation experience.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app and backend together:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## Gemini API Integration

This project includes a Node backend at `server/server.js`.
If you want Gemini API responses instead of local mock output, create a `.env` file in the project root or copy `.env.example` and set your values.

```bash
cp .env.example .env
# then edit .env with your key
```

Valid environment variables:

```bash
GEMINI_API_KEY=your_api_key_here
GEMINI_API_URL=https://api.openai.com/v1/responses
GEMINI_MODEL=gemini-1.5
```

Then restart the server.
