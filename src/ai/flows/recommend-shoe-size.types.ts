
// This file is not marked with 'use server'
import {z} from 'genkit';

export const RecommendShoeSizeInputSchema = z.object({
  footPhotoDataUri: z
    .string()
    .describe(
      "A photo of the foot, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  knownShoeSize: z.string().optional().describe('Optional: The user\'s current shoe size.'),
  footLength: z.number().describe('The length of the foot in cm.'),
  footWidth: z.number().describe('The width of the foot in cm.'),
  footHeight: z.number().describe('The height of the foot in cm.'),
});
export type RecommendShoeSizeInput = z.infer<typeof RecommendShoeSizeInputSchema>;

export const RecommendShoeSizeOutputSchema = z.object({
  recommendedShoeSize: z.string().describe('The recommended shoe size for the user.'),
  availability: z.string().describe('The availability status of the recommended shoe size based on the product dataset.'),
});
export type RecommendShoeSizeOutput = z.infer<typeof RecommendShoeSizeOutputSchema>;
