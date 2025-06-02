
'use server';

/**
 * @fileOverview A flow to check the availability of a shoe size in the product dataset.
 *
 * - checkShoeAvailability - A function that checks the availability of a shoe size.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit'; // z is used for the internal tool schema
import type { CheckShoeAvailabilityInput, CheckShoeAvailabilityOutput } from './check-shoe-availability.types';
import { CheckShoeAvailabilityInputSchema, CheckShoeAvailabilityOutputSchema } from './check-shoe-availability.types';

export async function checkShoeAvailability(
  input: CheckShoeAvailabilityInput
): Promise<CheckShoeAvailabilityOutput> {
  return checkShoeAvailabilityFlow(input);
}

const getProductDataset = ai.defineTool({
  name: 'getProductDataset',
  description: 'Retrieves product information for a specific shoe size from the product dataset.',
  inputSchema: z.object({
    shoeSize: z.string().describe('The shoe size to check for in the product dataset.'),
  }),
  outputSchema: z.string().describe('A JSON string of products matching the shoe size, or an empty array if none are found.'),
},
async (input) => {
  const response = await fetch('https://cdn.cillers.com/google-region-launch-datasets/fw_products_dataset.json');
  const products = await response.json() as any[];

  const availableProducts = products.filter(product => product.size === input.shoeSize);
  return JSON.stringify(availableProducts);
});

const checkShoeAvailabilityPrompt = ai.definePrompt({
  name: 'checkShoeAvailabilityPrompt',
  tools: [getProductDataset],
  input: {schema: CheckShoeAvailabilityInputSchema},
  output: {schema: CheckShoeAvailabilityOutputSchema},
  prompt: `You are an AI assistant specialized in checking shoe availability strictly based on a provided product dataset.
Your task is to determine if a given shoe size is available by using ONLY the information retrieved by the 'getProductDataset' tool. Do not use any external knowledge or make assumptions.

Input shoe size: {{{shoeSize}}}

Using ONLY the data returned by the 'getProductDataset' tool for the input shoe size:
1. Determine if any products of the given shoe size are found in the retrieved data.
2. Set 'isAvailable' to true if one or more products are found, and false otherwise.
3. For 'availabilityDetails':
    - If products are found, provide specific details about these available products based strictly on the retrieved data.
    - If no products are found (i.e., the retrieved data indicates no matches or is an empty set), set 'availabilityDetails' to 'No shoes of this size are currently available.'
  `,
});

const checkShoeAvailabilityFlow = ai.defineFlow(
  {
    name: 'checkShoeAvailabilityFlow',
    inputSchema: CheckShoeAvailabilityInputSchema,
    outputSchema: CheckShoeAvailabilityOutputSchema,
  },
  async input => {
    const {output} = await checkShoeAvailabilityPrompt(input);
    return output!;
  }
);
