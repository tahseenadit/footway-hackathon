
// This file is not marked with 'use server'
import {z} from 'genkit';

export const CheckShoeAvailabilityInputSchema = z.object({
  shoeSize: z.string().describe('The shoe size to check for availability.'),
});
export type CheckShoeAvailabilityInput = z.infer<typeof CheckShoeAvailabilityInputSchema>;

export const CheckShoeAvailabilityOutputSchema = z.object({
  isAvailable: z.boolean().describe('Whether the shoe size is available or not.'),
  availabilityDetails: z
    .string()
    .describe('Details about the availability of the shoe size.'),
});
export type CheckShoeAvailabilityOutput = z.infer<typeof CheckShoeAvailabilityOutputSchema>;
