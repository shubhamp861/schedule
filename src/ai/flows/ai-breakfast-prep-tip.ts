'use server';
/**
 * @fileOverview This file implements a Genkit flow that generates a breakfast preparation tip
 * based on provided meal details for the next day.
 *
 * - getAiBreakfastPrepTip - A function that triggers the AI to generate a breakfast prep tip.
 * - AiBreakfastPrepTipInput - The input type for the getAiBreakfastPrepTip function.
 * - AiBreakfastPrepTipOutput - The return type for the getAiBreakfastPrepTip function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiBreakfastPrepTipInputSchema = z.object({
  breakfastDetails: z
    .string()
    .describe(
      "Details about the next day's breakfast, such as ingredients, recipe name, or dietary preferences."
    ),
});
export type AiBreakfastPrepTipInput = z.infer<
  typeof AiBreakfastPrepTipInputSchema
>;

const AiBreakfastPrepTipOutputSchema = z.object({
  tip: z.string().describe('A simple, actionable tip for breakfast preparation.'),
});
export type AiBreakfastPrepTipOutput = z.infer<
  typeof AiBreakfastPrepTipOutputSchema
>;

export async function getAiBreakfastPrepTip(
  input: AiBreakfastPrepTipInput
): Promise<AiBreakfastPrepTipOutput> {
  return aiBreakfastPrepTipFlow(input);
}

const aiBreakfastPrepTipPrompt = ai.definePrompt({
  name: 'aiBreakfastPrepTipPrompt',
  input: { schema: AiBreakfastPrepTipInputSchema },
  output: { schema: AiBreakfastPrepTipOutputSchema },
  prompt: `You are an AI assistant specialized in providing quick and practical breakfast preparation tips.
Based on the following details about tomorrow's breakfast, provide one simple, actionable tip or idea to make morning preparation easier. The tip should be concise, focused on preparing tonight for tomorrow's breakfast, and helpful.

Breakfast details: {{{breakfastDetails}}}`,
});

const aiBreakfastPrepTipFlow = ai.defineFlow(
  {
    name: 'aiBreakfastPrepTipFlow',
    inputSchema: AiBreakfastPrepTipInputSchema,
    outputSchema: AiBreakfastPrepTipOutputSchema,
  },
  async (input) => {
    const { output } = await aiBreakfastPrepTipPrompt(input);
    return output!;
  }
);
