'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating funny marketing slogans for a product.
 *
 * - generateMarketingSlogans - A function that generates marketing slogans for a given product name and features.
 * - GenerateMarketingSlogansInput - The input type for the generateMarketingSlogans function.
 * - GenerateMarketingSlogansOutput - The output type for the generateMarketingSlogans function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingSlogansInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productFeatures: z.array(z.string()).describe('A list of features for the product.'),
});
export type GenerateMarketingSlogansInput = z.infer<
  typeof GenerateMarketingSlogansInputSchema
>;

const GenerateMarketingSlogansOutputSchema = z.object({
  slogans: z.array(z.string()).describe('A list of funny marketing slogans.'),
});
export type GenerateMarketingSlogansOutput = z.infer<
  typeof GenerateMarketingSlogansOutputSchema
>;

export async function generateMarketingSlogans(
  input: GenerateMarketingSlogansInput
): Promise<GenerateMarketingSlogansOutput> {
  return generateMarketingSlogansFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingSlogansPrompt',
  input: {schema: GenerateMarketingSlogansInputSchema},
  output: {schema: GenerateMarketingSlogansOutputSchema},
  prompt: `You are a marketing expert who specializes in creating funny and engaging slogans.

  Generate a list of funny marketing slogans for the following product:

  Product Name: {{productName}}
  Product Features:
  {{#each productFeatures}}
  - {{this}}
  {{/each}}
  `,
});

const generateMarketingSlogansFlow = ai.defineFlow(
  {
    name: 'generateMarketingSlogansFlow',
    inputSchema: GenerateMarketingSlogansInputSchema,
    outputSchema: GenerateMarketingSlogansOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
