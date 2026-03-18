# Chat with your PDF

A production-quality, frontend-only React application that lets you upload a PDF, view it, generate an AI-powered summary, and ask questions with page-level citations — all without a backend.

---

## Features

- **PDF Upload & Preview** — Drag-and-drop or click to upload. Rendered with `react-pdf` with zoom and page navigation.
- **Text Extraction** — Full per-page text extraction via `pdfjs-dist`.
- **AI Summary** — One-click 5–7 bullet point summary via Gemini.
- **Smart Q&A** — Ask anything about the document; the AI cites exact page numbers.
- **Page Jump** — Click any page citation in a chat response to jump directly to that page in the viewer.

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd pdf-chat
npm install
```

### 2. Set up your API Key

Copy the example env file and add your key:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_GEMINI_API_KEY=your_actual_key_here
```

Get a free Gemini API key at: https://aistudio.google.com/app/apikey

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| PDF Rendering | react-pdf |
| Text Extraction | pdfjs-dist |
| AI / LLM | Google Gemini 1.5 Flash |
| Icons | lucide-react |

---

## Folder Structure

```
src/
├── components/
│   ├── FileUpload.jsx      # Drag-and-drop PDF uploader
│   ├── PdfViewer.jsx       # PDF canvas with page controls and zoom
│   ├── ChatBox.jsx         # Chat UI with message list and input
│   ├── MessageBubble.jsx   # Individual message with page citation badges
│   └── SummaryPanel.jsx    # Analyze button + bullet-point summary
├── hooks/
│   ├── usePdfProcessor.js  # PDF file state, text extraction, page nav
│   └── useChat.js          # Chat history, LLM calls, summary state
├── services/
│   └── llmService.js       # Gemini API calls (summarize + Q&A)
├── utils/
│   └── extractText.js      # pdfjs text extraction + page number parsing
├── App.jsx                 # Root layout + state wiring
├── main.jsx                # React entry point
└── index.css               # Tailwind + custom styles
```

---

## Constraints

- **No backend** — everything runs in the browser
- **No database or vector store** — full PDF text is sent to the LLM each query
- **PDF size** — works best with PDFs under ~50 pages; very large documents may hit Gemini token limits

---

## Build for Production

```bash
npm run build
npm run preview
```

---

## Notes

- The app uses **Gemini 1.5 Flash** for fast, cost-effective responses.
- Text is extracted client-side; no PDF content is sent to any server other than the Gemini API.
- Scanned PDFs (image-only) will extract no text — use a PDF with a text layer.
