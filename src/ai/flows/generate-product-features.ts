'use server';

/**
 * @fileOverview Generates 3-5 funny and imaginative, yet plausible, features for the fused product.
 *
 * - generateProductFeatures - A function that handles the generation of product features.
 * - GenerateProductFeaturesInput - The input type for the generateProductFeatures function.
 * - GenerateProductFeaturesOutput - The return type for the generateProductFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductFeaturesInputSchema = z.object({
  item1: z.string().describe('The first item to be fused.'),
  item2: z.string().describe('The second item to be fused.'),
  productName: z.string().describe('The name of the fused product.'),
});
export type GenerateProductFeaturesInput = z.infer<
  typeof GenerateProductFeaturesInputSchema
>;

const GenerateProductFeaturesOutputSchema = z.object({
  features: z
    .array(z.string())
    .describe('An array of 3-5 funny and imaginative product features.'),
});
export type GenerateProductFeaturesOutput = z.infer<
  typeof GenerateProductFeaturesOutputSchema
>;

export async function generateProductFeatures(
  input: GenerateProductFeaturesInput
): Promise<GenerateProductFeaturesOutput> {
  return generateProductFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductFeaturesPrompt',
  input: {schema: GenerateProductFeaturesInputSchema},
  output: {schema: GenerateProductFeaturesOutputSchema},
  prompt: `You are a creative product feature generator. Given two items and the product name, generate 3-5 funny and imaginative, yet plausible, features for the fused product.

Item 1: {{{item1}}}
Item 2: {{{item2}}}
Product Name: {{{productName}}}

Features:`, // Changed prompt to ask for array
});

const generateProductFeaturesFlow = ai.defineFlow(
  {
    name: 'generateProductFeaturesFlow',
    inputSchema: GenerateProductFeaturesInputSchema,
    outputSchema: GenerateProductFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
