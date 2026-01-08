# CodeEvolve 🚀

A progressive coding assessment platform that mimics real-world industry interviews (eBay, Capital One, Uber).

**Live Demo:** [https://code-evolve.vercel.app/](https://code-evolve.vercel.app/)

## Key Features
* **Progressive Challenges:** Code evolves over 4 levels; you must maintain state and refactor as requirements change.
* **Client-Side Execution:** Uses **Pyodide (WebAssembly)** to run Python code entirely in the browser. Zero server latency.
* **Auto-Save:** Progress is saved to LocalStorage, so you never lose your work on refresh.
* **70-Minute Timer:** Simulates real interview pressure.

## Tech Stack
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS
* **Editor:** Monaco Editor (VS Code engine)
* **Runtime:** Pyodide (Wasm)

## How to Run Locally
1. `npm install`
2. `npm run dev`