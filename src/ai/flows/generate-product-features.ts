'use server';

/**
 * @fileOverview Generates 3-5 outrageously funny and imaginative features for the fused product from a list of items.
 *
 * - generateProductFeatures - A function that handles the generation of product features.
 * - GenerateProductFeaturesInput - The input type for the generateProductFeatures function.
 * - GenerateProductFeaturesOutput - The return type for the generateProductFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductFeaturesInputSchema = z.object({
  items: z.array(z.string()).describe('The list of ingredients to be fused.'),
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
  prompt: `You are a slightly unhinged and wildly imaginative product inventor. Your job is to come up with 3-5 outrageously funny and unexpected features for the product. The features should be surprising and make people laugh, but still vaguely related to the ingredients.

Ingredients:
{{#each items}}
- {{{this}}}
{{/each}}
Product Name: {{{productName}}}

Features:`,
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
