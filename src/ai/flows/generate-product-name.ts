'use server';

/**
 * @fileOverview Generates a quirky product name based on two input items.
 *
 * - generateProductName - A function that generates a product name.
 * - GenerateProductNameInput - The input type for the generateProductName function.
 * - GenerateProductNameOutput - The return type for the generateProductName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductNameInputSchema = z.object({
  item1: z.string().describe('The first item to fuse.'),
  item2: z.string().describe('The second item to fuse.'),
});
export type GenerateProductNameInput = z.infer<typeof GenerateProductNameInputSchema>;

const GenerateProductNameOutputSchema = z.object({
  productName: z.string().describe('The generated quirky product name.'),
});
export type GenerateProductNameOutput = z.infer<typeof GenerateProductNameOutputSchema>;

export async function generateProductName(input: GenerateProductNameInput): Promise<GenerateProductNameOutput> {
  return generateProductNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductNamePrompt',
  input: {schema: GenerateProductNameInputSchema},
  output: {schema: GenerateProductNameOutputSchema},
  prompt: `You are a creative product naming expert. Given two items, generate a quirky and funny product name that combines the essence of both items.\n\nItem 1: {{{item1}}}\nItem 2: {{{item2}}}\n\nProduct Name:`,
});

const generateProductNameFlow = ai.defineFlow(
  {
    name: 'generateProductNameFlow',
    inputSchema: GenerateProductNameInputSchema,
    outputSchema: GenerateProductNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
