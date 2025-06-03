
'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending shoe sizes based on user-uploaded foot images and dimensions.
 *
 * - recommendShoeSize - A function that orchestrates the shoe size recommendation process.
 */

import {ai} from '@/ai/genkit';
import type { RecommendShoeSizeInput, RecommendShoeSizeOutput } from './recommend-shoe-size.types';
import { RecommendShoeSizeInputSchema, RecommendShoeSizeOutputSchema } from './recommend-shoe-size.types';

export async function recommendShoeSize(input: RecommendShoeSizeInput): Promise<RecommendShoeSizeOutput> {
  return recommendShoeSizeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendShoeSizePrompt',
  input: {schema: RecommendShoeSizeInputSchema},
  output: {schema: RecommendShoeSizeOutputSchema},
  prompt: `You are an AI assistant specializing in shoe size recommendations.

  Analyze the provided foot dimensions and, if available, the user's current shoe size to recommend the ideal shoe size.
  Also, check the availability of the recommended shoe size based on the knowledge you have.

  Foot Photo: {{media url=footPhotoDataUri}}
  Foot Length: {{{footLength}}} mm
  Foot Width: {{{footWidth}}} mm
  Foot Height: {{{footHeight}}} mm

  Provide the size recommendation in the output.
  `,
});

const recommendShoeSizeFlow = ai.defineFlow(
  {
    name: 'recommendShoeSizeFlow',
    inputSchema: RecommendShoeSizeInputSchema,
    outputSchema: RecommendShoeSizeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
