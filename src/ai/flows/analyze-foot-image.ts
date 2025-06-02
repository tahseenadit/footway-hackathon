
'use server';

/**
 * @fileOverview Analyzes an image of a foot or shoe to determine its dimensions.
 *
 * - analyzeFootImage - A function that handles the image analysis process.
 */

import {ai} from '@/ai/genkit';
import type { AnalyzeFootImageInput, AnalyzeFootImageOutput } from './analyze-foot-image.types';
import { AnalyzeFootImageInputSchema, AnalyzeFootImageOutputSchema } from './analyze-foot-image.types';

export async function analyzeFootImage(input: AnalyzeFootImageInput): Promise<AnalyzeFootImageOutput> {
  return analyzeFootImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFootImagePrompt',
  input: {schema: AnalyzeFootImageInputSchema},
  output: {schema: AnalyzeFootImageOutputSchema},
  prompt: `You are an expert in analyzing images of feet and shoes to determine their dimensions.

  Analyze the provided image to determine the length, width, and height of the foot or shoe. Provide the dimensions in centimeters.

  Image: {{media url=photoDataUri}}
  `,
});

const analyzeFootImageFlow = ai.defineFlow(
  {
    name: 'analyzeFootImageFlow',
    inputSchema: AnalyzeFootImageInputSchema,
    outputSchema: AnalyzeFootImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
