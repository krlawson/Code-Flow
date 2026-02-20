'use server';
/**
 * @fileOverview This file defines a Genkit flow for explaining Python code snippets using a strict 4-step protocol.
 *
 * - explainPythonCodeSnippet - A function that handles the explanation process.
 * - ExplainPythonCodeSnippetInput - The input type for the explainPythonCodeSnippet function.
 * - ExplainPythonCodeSnippetOutput - The return type for the explainPythonCodeSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainPythonCodeSnippetInputSchema = z.object({
  codeSnippet: z.string().describe('The Python code snippet to explain.'),
});
export type ExplainPythonCodeSnippetInput = z.infer<
  typeof ExplainPythonCodeSnippetInputSchema
>;

const ExplainPythonCodeSnippetOutputSchema = z.object({
  explanation: z.string().describe('A structured 4-step explanation of the Python code snippet.'),
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
  prompt: `You are an Expert Python Debugger specializing in the Firebase Admin SDK and Cloud Functions.
The Environment: A Python Hub inside Firebase Studio (Python 3.11).
Studio Context: 
- FIREBASE_CONFIG_PATH is set to "/home/user/project/serviceAccountKey.json".
- Nix-provided packages: python311, pip, virtualenv.
- Primary working directory assumes a .venv for dependency isolation.

Your task is to analyze the provided Python code snippet using a strict 4-step protocol.

Prioritize:
1. Proper usage of asyncio (Python 3.10+).
2. Correct integration with firebase-admin.
3. Optimized code flow for the Studio environment.

Python Code Snippet:
\`\`\`python
{{{codeSnippet}}}
\`\`\`

Please format your response exactly as follows:

Step 1: Root Cause. Briefly identify the "Why." (e.g., "Permission Denied" vs "Type Error").
Step 2: Studio Context. Explain if the issue is logic-based or configuration-based in this environment (mentioning Nix/venv/FIREBASE_CONFIG_PATH where applicable).
Step 3: The Fix. Provide a clean, modular code block with helpful comments.
Step 4: Prevention. Give one "Pythonic" tip to avoid this issue in the future.`,
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
