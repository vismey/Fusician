'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wand2, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const exampleIngredients = [
  ['A Pocket Watch', 'A Nebula'],
  ['A Bonsai Tree', 'A Thunderstorm'],
  ['An Old Library', 'A Spaceship'],
  ['A Hummingbird', 'A Sword'],
  ['A Secret Agent', 'A Croissant'],
  ['A Volcano', 'A Music Box'],
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % exampleIngredients.length);
    }, 3000); // Change example every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const [item1, item2] = exampleIngredients[index];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <Wand2 className="w-24 h-24 text-primary mb-4" />
        <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Welcome to Fuse It!
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-2xl">
          Unleash your imagination and fuse everyday items into extraordinary, hilarious product concepts.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12"
      >
        <p className="text-lg text-muted-foreground mb-4">Ever wondered what you'd get if you fused...</p>
        <div className="flex justify-center items-center gap-4 text-2xl font-semibold">
           <AnimatePresence mode="wait">
            <motion.div
              key={item1}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-secondary/20 border-secondary shadow-lg">
                <CardContent className="p-0">{item1}</CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
          <span className="text-primary font-bold text-4xl">+</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={item2}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
            >
                <Card className="p-6 bg-accent/20 border-accent shadow-lg">
                    <CardContent className="p-0">{item2}</CardContent>
                </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
        className="mt-16"
      >
        <Link href="/fuse" passHref>
          <Button size="lg" className="rounded-full px-12 py-8 text-2xl font-bold shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95">
            Start Fusing Now
            <ArrowRight className="ml-3 h-7 w-7" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
