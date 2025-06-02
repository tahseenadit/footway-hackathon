
// This file is not marked with 'use server'
import {z} from 'genkit';

export const AnalyzeFootImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a foot or shoe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type AnalyzeFootImageInput = z.infer<typeof AnalyzeFootImageInputSchema>;

export const AnalyzeFootImageOutputSchema = z.object({
  length: z.number().describe('The length of the foot or shoe in centimeters.'),
  width: z.number().describe('The width of the foot or shoe in centimeters.'),
  height: z.number().describe('The height of the foot or shoe in centimeters.'),
});
export type AnalyzeFootImageOutput = z.infer<typeof AnalyzeFootImageOutputSchema>;
