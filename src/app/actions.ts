'use server';

import { generateProductName } from '@/ai/flows/generate-product-name';
import { generateProductFeatures } from '@/ai/flows/generate-product-features';
import { generateMarketingSlogans } from '@/ai/flows/generate-marketing-slogans';
import { generateProductPoster } from '@/ai/flows/generate-product-poster';
import { generateFeatureImage } from '@/ai/flows/generate-feature-image';
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


    const featuresResult = await generateProductFeatures({ items: nonEmptyItems, productName });
    if (!featuresResult.features || featuresResult.features.length === 0) {
        return { error: 'Could not generate product features.' };
    }
    const featureStrings = featuresResult.features;

    // Generate images for features in parallel
    const featureImagePromises = featureStrings.map(featureText =>
      generateFeatureImage({ productName, feature: featureText })
    );

    const featureImageResults = await Promise.all(featureImagePromises);

    const features = featureStrings.map((text, index) => ({
        text,
        image: featureImageResults[index].imageDataUri
    }));

    const slogansResult = await generateMarketingSlogans({ productName, productFeatures: featureStrings });
    if (!slogansResult.slogans || slogansResult.slogans.length === 0) {
        return { error: 'Could not generate marketing slogans.' };
    }
    const slogans = slogansResult.slogans;
    
    // Use the first slogan for the poster
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
