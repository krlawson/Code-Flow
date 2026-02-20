'use server';
/**
 * @fileOverview This file defines a Genkit flow for explaining Python code snippets.
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
  explanation: z.string().describe('A natural language explanation of the Python code snippet.'),
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
  prompt: `You are an expert Python programmer and educator. Your task is to explain the provided Python code snippet in clear, concise natural language.

Python Code Snippet:
\x60\x60\x60python
{{{codeSnippet}}}
\x60\x60\x60

Explanation:`,
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
