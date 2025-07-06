'use server';

/**
 * @fileOverview Generates a poster for a fused product idea.
 *
 * - generateProductPoster - A function that generates a poster for a fused product idea.
 * - GenerateProductPosterInput - The input type for the generateProductPoster function.
 * - GenerateProductPosterOutput - The return type for the generateProductPoster function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductPosterInputSchema = z.object({
  productName: z.string().describe('The name of the fused product.'),
  slogan: z.string().optional().describe('An optional marketing slogan for the fused product.'),
});
export type GenerateProductPosterInput = z.infer<typeof GenerateProductPosterInputSchema>;

const GenerateProductPosterOutputSchema = z.object({
  posterDataUri: z
    .string()    
    .describe(
      "A data URI of the generated poster image, must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProductPosterOutput = z.infer<typeof GenerateProductPosterOutputSchema>;

export async function generateProductPoster(input: GenerateProductPosterInput): Promise<GenerateProductPosterOutput> {
  return generateProductPosterFlow(input);
}

const generateProductPosterFlow = ai.defineFlow(
  {
    name: 'generateProductPosterFlow',
    inputSchema: GenerateProductPosterInputSchema,
    outputSchema: GenerateProductPosterOutputSchema,
  },
  async input => {
    // Construct the prompt, including the slogan only if it's provided.
    const prompt = `Generate a fun, eye-catching product poster in a playful 'Candy Pop' UI style for a product called "${input.productName}"${input.slogan ? ` with the slogan: "${input.slogan}"` : ''}.`;
    
    // Generate the image
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media?.url) {
      throw new Error('no media returned');
    }

    return {
      posterDataUri: media.url,
    };
  }
);
