
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { fuseItems, FuseResult } from '@/app/actions';
import { ThemeToggle } from '@/components/theme-toggle';

import { Sparkles, Lightbulb, Download, Share2, Loader2, Wand2, History as HistoryIcon, ArrowLeft, PlusCircle } from 'lucide-react';

type GeneratedData = FuseResult & { id: string; items: string[]; };

const formSchema = z.object({
  ingredient1: z.string().min(2, { message: 'Must be at least 2 characters.' }),
  ingredient2: z.string().min(2, { message: 'Must be at least 2 characters.' }),
  ingredient3: z.string().optional(),
  ingredient4: z.string().optional(),
});

function Header() {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <Link href="/" className="flex items-center gap-2">
              <Wand2 className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold">Fusician!</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
              <nav className="flex items-center space-x-1">
                  <ThemeToggle />
              </nav>
          </div>
        </div>
      </header>
    );
}

function HistoryView({ history, onSelect, onClear }: { history: GeneratedData[], onSelect: (item: GeneratedData) => void, onClear: () => void }) {
    return (
      <div className="sticky top-24">
        <Card className="shadow-md h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-xl">
                <HistoryIcon className="w-5 h-5" />
                History
              </CardTitle>
              {history.length > 0 && (
                 <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)] pr-3 -mr-3">
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground py-16">
                  <p>Your fused products will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="cursor-pointer group" onClick={() => onSelect(item)}>
                      <Card className="hover:border-primary transition-colors duration-200 hover:bg-muted/50">
                        <CardContent className="p-3">
                          <p className="font-semibold text-sm group-hover:text-primary truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground truncate">{Array.isArray(item.items) ? item.items.join(' + ') : ''}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
}

function FuseForm({ onSubmit, isLoading }: { 
  onSubmit: (values: z.infer<typeof formSchema>) => void, 
  isLoading: boolean
}) {
  const searchParams = useSearchParams();
  const ingredient1 = searchParams.get('ingredient1') ?? '';
  const ingredient2 = searchParams.get('ingredient2') ?? '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      ingredient1, 
      ingredient2, 
      ingredient3: '', 
      ingredient4: '' 
    },
  });
  
  const [itemCount, setItemCount] = useState(2);

  return (
    <Card className="shadow-lg border-2 border-transparent focus-within:border-primary transition-all duration-300">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="text-2xl">Create a New Fusion</CardTitle>
                    <CardDescription>Combine up to four items to invent something new.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="ingredient1"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ingredient 1</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Apple" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ingredient2"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ingredient 2</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Car" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {itemCount >= 3 && (
                        <FormField
                        control={form.control}
                        name="ingredient3"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Ingredient 3</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Sunglasses" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    )}
                    {itemCount >= 4 && (
                        <FormField
                        control={form.control}
                        name="ingredient4"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Ingredient 4</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Book" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    )}
                    </div>
                    {itemCount < 4 && (
                    <div className="flex justify-start">
                        <Button type="button" variant="ghost" className="text-muted-foreground" onClick={() => setItemCount(prev => prev + 1)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add another ingredient
                        </Button>
                    </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isLoading} className="font-bold shadow-lg">
                        {isLoading ? (
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        ) : (
                        <Wand2 className="mr-2 h-6 w-6" />
                        )}
                        Fuse Ingredients
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

function ResultView({ result, onBack }: { result: GeneratedData, onBack: () => void }) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share && result.posterDataUri) {
      try {
        const response = await fetch(result.posterDataUri);
        const blob = await response.blob();
        const file = new File([blob], `${result.productName}-poster.png`, { type: blob.type });

        await navigator.share({
          title: `Check out my creation: ${result.productName}!`,
          text: `Generated with Fusician!`,
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
          variant: "destructive",
          title: "Share failed",
          description: "Could not share the poster.",
        })
      }
    } else {
       toast({
          title: "Share not available",
          description: "Your browser does not support the Web Share API.",
        })
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Button variant="outline" onClick={onBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Create another fusion
        </Button>
        <div className="space-y-8">
            <Card className="shadow-xl rounded-2xl w-full text-center p-8 bg-muted/20">
                <p className="text-sm font-medium text-primary uppercase tracking-wider">Your Fusion</p>
                <h2 className="text-5xl font-bold mt-2">{result.productName}</h2>
                <p className="text-muted-foreground mt-3 text-lg">
                    A fusion of {Array.isArray(result.items) ? result.items.map(item => `'${item}'`).join(', ') : ''}
                </p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card className="shadow-lg rounded-2xl h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lightbulb /> Key Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-6">
                                {result.features.map((feature, i) => {
                                    const isNewFormat = typeof feature === 'object' && feature !== null && 'text' in feature;
                                    const featureText = isNewFormat ? (feature as {text: string}).text : feature as string;
                                    const featureImage = isNewFormat ? (feature as {image: string}).image : null;

                                    return (
                                        <li key={i} className="flex items-start gap-4">
                                            {featureImage ? (
                                                <Image
                                                    src={featureImage}
                                                    alt={featureText}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-lg border-2 border-secondary shadow-md shrink-0"
                                                    data-ai-hint="product feature"
                                                />
                                            ): <div className="w-20 h-20 bg-muted rounded-lg shrink-0 flex items-center justify-center"><Lightbulb className="w-8 h-8 text-muted-foreground"/></div>}
                                            <div>
                                                <p className="font-semibold">{featureText}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card className="shadow-lg rounded-2xl h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sparkles /> Marketing Slogans</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-4">
                            {result.slogans.map((slogan, i) => (
                                <li key={i}>
                                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                      "{slogan}"
                                  </blockquote>
                                </li>
                            ))}
                          </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            {result.posterDataUri ? (
                <Card className="shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle>Your Product Poster</CardTitle>
                        <CardDescription>Ready to be shared with the world!</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <Image src={result.posterDataUri} alt={`${result.productName} poster`} width={512} height={512} className="rounded-lg border-4 border-accent shadow-lg" data-ai-hint="product poster" />
                        <div className="flex gap-4">
                            <a href={result.posterDataUri} download={`${result.productName}-poster.png`}>
                                <Button size="lg"><Download className="mr-2 h-5 w-5" /> Download Poster</Button>
                            </a>
                            <Button size="lg" variant="outline" onClick={handleShare}><Share2 className="mr-2 h-5 w-5" /> Share</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                !result.id.includes('MANUAL') && // Don't show this card for old history items
                <Card className="shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle>Poster</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-64">
                          <p className="text-muted-foreground">Poster generation is not available for this item.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    </motion.div>
  );
}

function FusePageContent() {
  const [result, setResult] = useState<GeneratedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useLocalStorage<GeneratedData[]>('fusician-history', []);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleFuseSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    const items = [values.ingredient1, values.ingredient2, values.ingredient3, values.ingredient4].filter((v): v is string => !!v && v.trim().length > 0);

    if (items.length < 2) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Not enough ingredients',
        description: 'Please provide at least two ingredients to fuse.',
      });
      return;
    }

    const response = await fuseItems(items);

    setIsLoading(false);

    if (response.error || !response.productName) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: response.error || 'There was a problem with the AI. Please try again.',
      });
    } else {
      const newResult: GeneratedData = {
        id: new Date().toISOString(),
        items: items,
        productName: response.productName,
        features: response.features || [],
        slogans: response.slogans || [],
        posterDataUri: response.posterDataUri || '',
      };
      setResult(newResult);

      const historyEntry: GeneratedData = {
        ...newResult,
        posterDataUri: '',
        features: newResult.features.map(feature => 
            (typeof feature === 'object' && feature !== null) 
                ? { text: feature.text, image: '' } 
                : feature
        ),
      };
      setHistory([historyEntry, ...history].slice(0, 10));
    }
  };

  const handleSelectHistory = (item: GeneratedData) => {
    // Re-constitute a result object from history
    const fullResult: GeneratedData = {
        ...item,
        // Since we don't store images in history, we can't show them here.
        // We also mark poster as empty.
        posterDataUri: '',
        features: item.features.map(feature => 
            (typeof feature === 'object' && feature !== null) 
                ? { text: feature.text, image: '' } // no image from history
                : { text: feature, image: ''}
        )
    };
    setResult(fullResult);
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Your past creations have been removed."
    })
  }

  const handleClearResult = () => {
    setResult(null);
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <main className="grid lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8 xl:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={result ? 'result' : 'form'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {isClient ? (
                  result ? (
                    <ResultView result={result} onBack={handleClearResult} />
                  ) : (
                    <>
                      <div className="mb-6">
                        <h1 className="text-4xl font-bold tracking-tight">Let's Get Fusing!</h1>
                        <p className="text-muted-foreground mt-1">What wacky combination will you create today?</p>
                      </div>
                      <FuseForm onSubmit={handleFuseSubmit} isLoading={isLoading} />
                    </>
                  )
                ) : (
                  <Card className="shadow-2xl rounded-2xl flex items-center justify-center h-[500px]">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
          <aside className="lg:col-span-4 xl:col-span-3 hidden lg:block">
            {isClient && <HistoryView history={history} onSelect={handleSelectHistory} onClear={handleClearHistory} />}
          </aside>
        </main>
      </div>
    </div>
  );
}

export default function FusePage() {
    return <FusePageContent />;
}
