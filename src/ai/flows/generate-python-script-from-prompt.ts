'use server';
/**
 * @fileOverview A Genkit flow that generates a basic Python script structure from a natural language prompt.
 *
 * - generatePythonScriptFromPrompt - A function that generates a Python script.
 * - GeneratePythonScriptFromPromptInput - The input type for the generatePythonScriptFromPrompt function.
 * - GeneratePythonScriptFromPromptOutput - The return type for the generatePythonScriptFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePythonScriptFromPromptInputSchema = z.object({
  prompt: z.string().describe('A natural language description of the Python script to generate.'),
});
export type GeneratePythonScriptFromPromptInput = z.infer<typeof GeneratePythonScriptFromPromptInputSchema>;

const GeneratePythonScriptFromPromptOutputSchema = z.object({
  script: z.string().describe('The generated Python script code.'),
});
export type GeneratePythonScriptFromPromptOutput = z.infer<typeof GeneratePythonScriptFromPromptOutputSchema>;

export async function generatePythonScriptFromPrompt(
  input: GeneratePythonScriptFromPromptInput
): Promise<GeneratePythonScriptFromPromptOutput> {
  return generatePythonScriptFromPromptFlow(input);
}

const generatePythonScriptPrompt = ai.definePrompt({
  name: 'generatePythonScriptPrompt',
  input: {schema: GeneratePythonScriptFromPromptInputSchema},
  output: {schema: GeneratePythonScriptFromPromptOutputSchema},
  prompt: `You are an Expert Python Programmer specializing in Firebase Admin SDK and Cloud Functions.

Generate a Python script based on the following description. 

Requirements:
- Use asyncio for asynchronous operations where applicable.
- Use the firebase-admin SDK for database/auth operations if requested.
- Follow Python 3.10+ best practices.
- Include concise, helpful comments.

Python Script Description: {{{prompt}}}`,
});

const generatePythonScriptFromPromptFlow = ai.defineFlow(
  {
    name: 'generatePythonScriptFromPromptFlow',
    inputSchema: GeneratePythonScriptFromPromptInputSchema,
    outputSchema: GeneratePythonScriptFromPromptOutputSchema,
  },
  async input => {
    const {output} = await generatePythonScriptPrompt(input);
    return output!;
  }
);
