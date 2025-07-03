'use server';

/**
 * @fileOverview Generates a quirky product name based on a list of input items.
 *
 * - generateProductName - A function that generates a product name.
 * - GenerateProductNameInput - The input type for the generateProductName function.
 * - GenerateProductNameOutput - The return type for the generateProductName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductNameInputSchema = z.object({
  items: z.array(z.string()).describe('The list of ingredients to fuse.'),
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
  prompt: `You are a creative product naming expert. Given a list of ingredients, generate a quirky and funny product name that combines the essence of all items.\n\nIngredients:\n{{#each items}}- {{{this}}}\n{{/each}}\n\nProduct Name:`,
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
