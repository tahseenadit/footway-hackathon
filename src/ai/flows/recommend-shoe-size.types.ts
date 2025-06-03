
// This file is not marked with 'use server'
import {z} from 'genkit';

export const RecommendShoeSizeInputSchema = z.object({
  footPhotoDataUri: z
    .string()
    .describe(
      "A photo of the foot, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  knownShoeSize: z.string().optional().describe('Optional: The user\'s current shoe size.'),
  footLength: z.number().describe('The length of the foot in mm.'),
  footWidth: z.number().describe('The width of the foot in mm.'),
  footHeight: z.number().describe('The height of the foot in mm.'),
});
export type RecommendShoeSizeInput = z.infer<typeof RecommendShoeSizeInputSchema>;

export const RecommendShoeSizeOutputSchema = z.object({
  recommendedShoeSize: z.string().describe('The recommended shoe size for the user.'),
});
export type RecommendShoeSizeOutput = z.infer<typeof RecommendShoeSizeOutputSchema>;
