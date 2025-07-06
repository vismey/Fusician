'use server';

import { generateProductName } from '@/ai/flows/generate-product-name';
import { generateProductFeatures } from '@/ai/flows/generate-product-features';
import { generateMarketingSlogans } from '@/ai/flows/generate-marketing-slogans';
import { generateProductPoster } from '@/ai/flows/generate-product-poster';
import { z } from 'zod';

const FeatureSchema = z.object({
  text: z.string(),
  image: z.string(),
});

const FuseResultSchema = z.object({
  productName: z.string(),
  features: z.array(z.union([FeatureSchema, z.string()])),
  slogans: z.array(z.string()),
  posterDataUri: z.string().optional(),
});

export type FuseResult = z.infer<typeof FuseResultSchema>;

export async function fuseItems(items: string[]): Promise<Partial<Omit<FuseResult, 'posterDataUri'>> & { error?: string }> {
  try {
    const nonEmptyItems = items.filter(item => item && item.trim() !== '');
    if (nonEmptyItems.length < 2) {
      return { error: 'Please provide at least two ingredients to fuse.' };
    }

    // Step 1: Generate name, which is needed by all subsequent steps.
    const nameResult = await generateProductName({ items: nonEmptyItems });
    if (!nameResult.productName) {
        return { error: 'Could not generate a product name.' };
    }
    const productName = nameResult.productName;

    // Step 2: Run features and slogans generation in parallel. This is fast.
    const [featuresResult, slogansResult] = await Promise.all([
      generateProductFeatures({ items: nonEmptyItems, productName }),
      generateMarketingSlogans({ productName }),
    ]);

    // Process results
    if (!featuresResult.features || featuresResult.features.length === 0) {
        return { error: 'Could not generate product features.' };
    }
    const features = featuresResult.features.map((text) => ({ text, image: '' }));

    if (!slogansResult.slogans || slogansResult.slogans.length === 0) {
        return { error: 'Could not generate marketing slogans.' };
    }
    const slogans = slogansResult.slogans;
    
    const validation = FuseResultSchema.pick({ productName: true, features: true, slogans: true }).safeParse({
        productName,
        features,
        slogans,
    });
    
    if (!validation.success) {
        console.error("AI output validation error:", validation.error);
        return { error: 'Received invalid data from AI. Please try again.' };
    }

    return validation.data;

  } catch (error) {
    console.error("Error in fuseItems action:", error);
    return { error: 'An unexpected error occurred while generating the product. Please try again later.' };
  }
}

// This new action is called from the client-side to generate the poster asynchronously.
export async function generatePosterForProduct(productName: string, slogan: string): Promise<{ posterDataUri?: string; error?: string }> {
    try {
        if (!productName) {
            return { error: 'Product name is required to generate a poster.' };
        }
        const posterResult = await generateProductPoster({ productName, slogan });

        if (!posterResult.posterDataUri) {
            return { error: 'Could not generate a product poster.' };
        }
        return { posterDataUri: posterResult.posterDataUri };

    } catch(error) {
        console.error("Error in generatePosterForProduct action:", error);
        return { error: 'An unexpected error occurred while generating the poster.' };
    }
}
