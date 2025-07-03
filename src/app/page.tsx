'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { fuseItems, FuseResult } from '@/app/actions';

import { Sparkles, Lightbulb, Download, Share2, Loader2, Wand2, History as HistoryIcon, ArrowLeft, PlusCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type GeneratedData = FuseResult & { id: string; items: string[]; };

const formSchema = z.object({
  item1: z.string().min(2, { message: 'Must be at least 2 characters.' }),
  item2: z.string().min(2, { message: 'Must be at least 2 characters.' }),
  item3: z.string().optional(),
  item4: z.string().optional(),
});

function Header() {
  return (
    <header className="py-6 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-center flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        <Wand2 className="w-12 h-12 text-primary" />
        Fuse It!
      </h1>
      <p className="text-muted-foreground mt-3 text-lg">
        Generate quirky product ideas from any two items!
      </p>
    </header>
  );
}

function HistoryView({ history, onSelect, onClear }: { history: GeneratedData[], onSelect: (item: GeneratedData) => void, onClear: () => void }) {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="w-6 h-6" />
            History
          </CardTitle>
          {history.length > 0 && (
             <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
          )}
        </div>
        <CardDescription>Your past creations.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p>Your fused products will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="cursor-pointer group" onClick={() => onSelect(item)}>
                  <Card className="hover:border-primary transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                    <CardContent className="p-3 flex items-center gap-4">
                      <Image
                        src={item.posterDataUri}
                        alt={`${item.productName} poster`}
                        width={64}
                        height={64}
                        className="rounded-md bg-muted"
                        data-ai-hint="product poster"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm group-hover:text-primary">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">{item.items.join(' + ')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function FuseForm({ onSubmit, isLoading }: { onSubmit: (values: z.infer<typeof formSchema>) => void, isLoading: boolean }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { item1: '', item2: '', item3: '', item4: '' },
  });
  
  const [itemCount, setItemCount] = useState(2);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);

  const handleAnimate = () => {
    setIsButtonAnimating(true);
    setTimeout(() => setIsButtonAnimating(false), 700);
  }

  return (
    <Card className="shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle>Create a new fusion</CardTitle>
        <CardDescription>What items should we fuse today?</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <FormField
                control={form.control}
                name="item1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Item 1</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Apple" {...field} className="py-6 text-lg rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="item2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Item 2</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Car" {...field} className="py-6 text-lg rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {itemCount >= 3 && (
                 <FormField
                  control={form.control}
                  name="item3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Item 3</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunglasses" {...field} className="py-6 text-lg rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
               {itemCount >= 4 && (
                 <FormField
                  control={form.control}
                  name="item4"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Item 4</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Book" {...field} className="py-6 text-lg rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
             {itemCount < 4 && (
              <div className="flex justify-center">
                <Button type="button" variant="outline" onClick={() => setItemCount(prev => prev + 1)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add another item
                </Button>
              </div>
            )}
            <div className="relative flex justify-center pt-4">
              <Button type="submit" size="lg" disabled={isLoading} className="rounded-full px-12 py-8 text-2xl font-bold shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95" onClick={handleAnimate}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                ) : (
                  <Wand2 className="mr-3 h-8 w-8" />
                )}
                Fuse!
              </Button>
               {isButtonAnimating && <Sparkles className="absolute w-10 h-10 text-accent animate-ping" />}
            </div>
          </form>
        </Form>
      </CardContent>
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
          text: `Generated with Fuse It!`,
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
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Fusion
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
                <Card className="shadow-2xl rounded-2xl w-full text-center">
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold">{result.productName}</CardTitle>
                        <CardDescription>A fusion of {result.items.map(item => `'${item}'`).join(' and ')}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
            
            <Card className="shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb /> Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {result.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card className="shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles /> Marketing Slogans</CardTitle>
                </CardHeader>
                <CardContent>
                    <Carousel className="w-full max-w-xs mx-auto">
                        <CarouselContent>
                            {result.slogans.map((slogan, i) => (
                                <CarouselItem key={i}>
                                    <div className="p-1">
                                        <p className="text-center font-semibold text-lg italic text-muted-foreground">"{slogan}"</p>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </CardContent>
            </Card>

            <div className="lg:col-span-2">
                 <Card className="shadow-2xl rounded-2xl">
                    <CardHeader>
                        <CardTitle>Poster</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                         <Image src={result.posterDataUri} alt={`${result.productName} poster`} width={512} height={512} className="rounded-lg border-4 border-accent shadow-lg" data-ai-hint="product poster" />
                         <div className="flex gap-4">
                             <a href={result.posterDataUri} download={`${result.productName}-poster.png`}>
                                 <Button size="lg"><Download className="mr-2 h-5 w-5" /> Save</Button>
                            </a>
                            <Button size="lg" variant="outline" onClick={handleShare}><Share2 className="mr-2 h-5 w-5" /> Share</Button>
                         </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
    </motion.div>
  );
}

export default function Home() {
  const [result, setResult] = useState<GeneratedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useLocalStorage<GeneratedData[]>('fuse-it-history', []);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleFuseSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    const items = [values.item1, values.item2, values.item3, values.item4].filter((v): v is string => !!v && v.trim().length > 0);

    if (items.length < 2) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Not enough items',
        description: 'Please provide at least two items to fuse.',
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
      setHistory([newResult, ...history].slice(0, 10)); // Keep history to 10 items
    }
  };

  const handleSelectHistory = (item: GeneratedData) => {
    setResult(item);
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
      <div className="container mx-auto px-4 py-2">
        <Header />
        <main className="grid lg:grid-cols-3 gap-8 mt-6">
          <aside className="lg:col-span-1 hidden lg:block">
            {isClient && <HistoryView history={history} onSelect={handleSelectHistory} onClear={handleClearHistory} />}
          </aside>
          <section className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={result ? 'result' : 'form'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {result ? (
                  <ResultView result={result} onBack={handleClearResult} />
                ) : (
                  <FuseForm onSubmit={handleFuseSubmit} isLoading={isLoading} />
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      </div>
    </div>
  );
}
