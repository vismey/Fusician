'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating an image for a product feature.
 *
 * - generateFeatureImage - A function that generates an image for a given product feature.
 * - GenerateFeatureImageInput - The input type for the generateFeatureImage function.
 * - GenerateFeatureImageOutput - The output type for the generateFeatureImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFeatureImageInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  feature: z.string().describe('The specific feature to visualize.'),
});
export type GenerateFeatureImageInput = z.infer<
  typeof GenerateFeatureImageInputSchema
>;

const GenerateFeatureImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A data URI of the generated image, must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateFeatureImageOutput = z.infer<
  typeof GenerateFeatureImageOutputSchema
>;

export async function generateFeatureImage(
  input: GenerateFeatureImageInput
): Promise<GenerateFeatureImageOutput> {
  return generateFeatureImageFlow(input);
}

const generateFeatureImageFlow = ai.defineFlow(
  {
    name: 'generateFeatureImageFlow',
    inputSchema: GenerateFeatureImageInputSchema,
    outputSchema: GenerateFeatureImageOutputSchema,
  },
  async input => {
    // Generate the image
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a fun, slightly absurd, visual representation of a product feature. The product is called "${input.productName}". The feature is: "${input.feature}". The image should be vibrant and eye-catching, in a playful, 'Candy Pop' UI style.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed for feature.');
    }

    return {
      imageDataUri: media.url,
    };
  }
);
