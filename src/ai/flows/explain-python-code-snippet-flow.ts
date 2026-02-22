'use server';
/**
 * @fileOverview This file defines a Genkit flow for explaining Python code snippets or terminal errors using a strict, high-depth 4-step protocol.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainPythonCodeSnippetInputSchema = z.object({
  codeSnippet: z.string().describe('The Python code snippet or terminal error to explain.'),
});
export type ExplainPythonCodeSnippetInput = z.infer<
  typeof ExplainPythonCodeSnippetInputSchema
>;

const ExplainPythonCodeSnippetOutputSchema = z.object({
  explanation: z.string().describe('A structured, high-depth 4-step explanation of the provided snippet or error.'),
});
export type ExplainPythonCodeSnippetOutput = z.infer<
  typeof ExplainPythonCodeSnippetOutputSchema
>;

export async function explainPythonCodeSnippet(
  input: ExplainPythonCodeSnippetInput
): Promise<ExplainPythonCodeSnippetOutput> {
  return explainPythonCodeSnippetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainPythonCodeSnippetPrompt',
  input: {schema: ExplainPythonCodeSnippetInputSchema},
  output: {schema: ExplainPythonCodeSnippetOutputSchema},
  prompt: `You are an Expert Python Debugger specializing in the Firebase Admin SDK, Cloud Functions, and high-performance Nix-based Studio environments.

Your Goal: Provide a "Gold Standard" technical analysis of a Python code snippet, terminal error, or traceback using a strict 4-step protocol.

The Environment Context:
- OS: Nix-based shell (Firebase Studio).
- Runtime: Python 3.11+.
- Storage: Persistent .venv at /home/user/project/.venv.
- Config: FIREBASE_CONFIG_PATH points to "/home/user/project/serviceAccountKey.json".
- SDKs: firebase-admin (asyncio preferred), google-cloud-firestore.

Protocol Instructions:

Step 1: Root Cause. Identify the exact technical failure (e.g., "Missing OS-level shared object file", "Race condition in async event loop", "Scope leak").
Step 2: Studio Context. Differentiate between Python Logic, Firebase SDK Configuration, and OS-level (Nix) environment requirements. Explicitly mention if the error is due to missing system libraries vs. pip packages.
Step 3: The Fix. Provide the most efficient, modular fix. Include both the corrected Python code (with async/await where applicable) and any required shell commands (e.g., nix-shell -p, pip install).
Step 4: Prevention. Offer a "Pythonic" or "Architectural" tip. Suggest declarative dependency management or defensive coding patterns to prevent regression.

Snippet/Error to analyze:
\`\`\`
{{{codeSnippet}}}
\`\`\`

Ensure your tone is professional, authoritative, and concise.`,
});

const explainPythonCodeSnippetFlow = ai.defineFlow(
  {
    name: 'explainPythonCodeSnippetFlow',
    inputSchema: ExplainPythonCodeSnippetInputSchema,
    outputSchema: ExplainPythonCodeSnippetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
