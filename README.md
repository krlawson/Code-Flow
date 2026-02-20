# CodeFlow: Expert Python Hub for Firebase Studio

CodeFlow is a high-performance Python development environment prototype designed specifically for Firebase Studio. It provides a simulated coding experience integrated with Genkit AI to help developers build, debug, and optimize Python scripts for Firebase Admin SDK and Cloud Functions.

## 🚀 Key Features

### 1. Expert AI Debugger & Generator
Powered by **Genkit AI**, the built-in assistant follows a strict **4-Step Debugging Protocol**:
- **Step 1: Root Cause** – Identifies exactly why an error occurred (e.g., "Permission Denied" vs "Type Error").
- **Step 2: Studio Context** – Explains if the issue is logic-based or specific to the Nix/venv configuration.
- **Step 3: The Fix** – Provides clean, modular, async-first Python code blocks.
- **Step 4: Prevention** – Offers "Expert" Pythonic tips to avoid future issues.

### 2. Studio-Ready Environment
Optimized for the Firebase Studio Nix environment:
- **Python 3.11** support.
- Aware of `.venv` isolation requirements for dependency management.
- Pre-configured for `FIREBASE_CONFIG_PATH` pointing to `/home/user/project/serviceAccountKey.json`.
- Prioritizes `firebase-admin` SDK and `asyncio` for high-performance operations.

### 3. Integrated Terminal Simulator
- Test script logic with simulated execution output.
- Automated environment scanning (detecting virtual environments and Python versions).
- **Command Extraction**: Easily copy shell commands (like Git syncs or Pip installs) from the simulator and paste them into your **actual** Firebase Studio terminal.

### 4. Persistence
- All scripts are persisted in **Local Storage**, ensuring your workspace remains intact across browser refreshes.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS & ShadCN UI
- **AI Engine**: Genkit 1.x (Google Gemini 2.5 Flash)
- **Icons**: Lucide React
- **Runtime Persistence**: Browser Local Storage

## 📂 Core Project Structure

- `src/app/`: Next.js App Router routes, layouts, and global styles.
- `src/components/code-flow/`: Core UI components including the Editor, Sidebar, and Terminal.
- `src/ai/flows/`: Genkit server actions for AI generation and code explanation.
- `src/lib/storage.ts`: Logic for managing Python scripts in local storage.
- `src/firebase/`: Firebase client initialization and utilities.

## 📝 Usage Guide

1. **Initialize Workspace**: Use the `setup_venv.py` script to understand how to isolate your environment.
2. **AI Generation**: Use the "AI Generator" to describe complex Firebase logic in natural language.
3. **Debug/Explain**: Use the "Debug/Explain" tool to analyze tracebacks or code snippets using the expert 4-step protocol.
4. **Deploy to GitHub**: Run `push_to_github.py` to see the exact sequence of commands required to sync your workspace, then copy-paste them into the real Studio terminal.

---
*Built with ❤️ for the Firebase Developer Community.*
