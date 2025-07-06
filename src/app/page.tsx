
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Wand2, ArrowRight, Mix, Sparkles, Share2, Rocket } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const InspiringFusions = [
  { item1: 'Dragon', item2: 'Ice Cream', description: 'Fire and ice in a cone. What could go wrong?' },
  { item1: 'Robot', item2: 'Sushi', description: 'Precision-rolled sushi by a slightly clumsy robot.' },
  { item1: 'Cloud', item2: 'Keyboard', description: 'Type on literal clouds. Backspace is a small thunderclap.' },
  { item1: 'Submarine', item2: 'Pineapple', description: 'A tropical underwater adventure vehicle.' },
  { item1: 'Cat', item2: 'Laptop', description: 'The ultimate productivity (or distraction) machine.' },
  { item1: 'Moon', item2: 'Bicycle', description: 'Cycle in low gravity with cheese-scented tires.' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Wand2 className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold">Fusician!</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-12 md:pt-24 lg:pt-32">
          {/* Animated background */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-background">
              <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/20 opacity-50 blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 right-auto top-auto h-[500px] w-[500px] -translate-x-[20%] -translate-y-[20%] rounded-full bg-secondary/20 opacity-50 blur-[80px]"></div>
          </div>
          <div className="container px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
                Unleash Your Inner Inventor
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                Fuse everyday items into extraordinary, hilarious product concepts with the power of AI.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <Link href="/fuse" passHref>
                <Button size="lg" className="rounded-full px-12 py-8 text-2xl font-bold shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95">
                  Start Your First Fusion
                  <Rocket className="ml-3 h-7 w-7" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Inspiring Fusions Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Inspiring Fusions</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get Your Creativity Flowing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't know where to start? Try one of these pre-made fusions to see the magic happen.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
              {InspiringFusions.map((fusion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full flex flex-col hover:border-primary transition-colors duration-300">
                    <CardHeader>
                      <CardTitle>{fusion.item1} + {fusion.item2}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground">{fusion.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/fuse?ingredient1=${encodeURIComponent(fusion.item1)}&ingredient2=${encodeURIComponent(fusion.item2)}`} passHref className="w-full">
                        <Button className="w-full">
                          Fuse These!
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Creating your next absurd invention is as easy as 1-2-3.
              </p>
            </div>
            <div className="mx-auto grid w-full max-w-5xl items-start gap-8 sm:grid-cols-3 md:gap-12">
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className="grid gap-2"
                >
                  <div className="flex justify-center"><Mix className="h-12 w-12 text-primary" /></div>
                  <h3 className="text-lg font-bold">1. Pick Ingredients</h3>
                  <p className="text-sm text-muted-foreground">Choose two or more items you want to fuse. The weirder, the better!</p>
              </motion.div>
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className="grid gap-2"
                >
                  <div className="flex justify-center"><Sparkles className="h-12 w-12 text-primary" /></div>
                  <h3 className="text-lg font-bold">2. Let AI Work Its Magic</h3>
                  <p className="text-sm text-muted-foreground">Our AI will brainstorm a product name, features, and marketing slogans.</p>
              </motion.div>
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className="grid gap-2"
                >
                  <div className="flex justify-center"><Share2 className="h-12 w-12 text-primary" /></div>
                  <h3 className="text-lg font-bold">3. Share Your Creation</h3>
                  <p className="text-sm text-muted-foreground">Download a poster and share your hilarious invention with the world.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Fuse?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Your next brilliant (or brilliantly bad) idea is just a click away.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Link href="/fuse" passHref>
                <Button type="submit" size="lg" className="w-full">
                  Start Fusing Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Fusician. All rights reserved.</p>
      </footer>
    </div>
  );
}
