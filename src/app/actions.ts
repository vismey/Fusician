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
  posterDataUri: z.string(),
});

export type FuseResult = z.infer<typeof FuseResultSchema>;

export async function fuseItems(items: string[]): Promise<Partial<FuseResult> & { error?: string }> {
  try {
    const nonEmptyItems = items.filter(item => item && item.trim() !== '');
    if (nonEmptyItems.length < 2) {
      return { error: 'Please provide at least two ingredients to fuse.' };
    }

    const nameResult = await generateProductName({ items: nonEmptyItems });
    if (!nameResult.productName) {
        return { error: 'Could not generate a product name.' };
    }
    const productName = nameResult.productName;

    // Run features and slogans generation in parallel to speed things up
    const [featuresResult, slogansResult] = await Promise.all([
      generateProductFeatures({ items: nonEmptyItems, productName }),
      generateMarketingSlogans({ productName }),
    ]);


    if (!featuresResult.features || featuresResult.features.length === 0) {
        return { error: 'Could not generate product features.' };
    }
    const featureStrings = featuresResult.features;

    // Feature images are disabled to prevent timeouts on Vercel.
    const features = featureStrings.map((text) => ({
        text,
        image: ''
    }));

    if (!slogansResult.slogans || slogansResult.slogans.length === 0) {
        return { error: 'Could not generate marketing slogans.' };
    }
    const slogans = slogansResult.slogans;
    
    // Use the first slogan for the poster, this runs after slogans are generated.
    const posterResult = await generateProductPoster({ productName, slogan: slogans[0] });
    if (!posterResult.posterDataUri) {
        return { error: 'Could not generate a product poster.' };
    }
    const posterDataUri = posterResult.posterDataUri;

    const validation = FuseResultSchema.safeParse({
        productName,
        features,
        slogans,
        posterDataUri,
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
