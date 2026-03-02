"use client";

import { useParams, useRouter } from 'next/navigation';
import { useSchedule } from '@/hooks/use-schedule';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Info, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { Meal } from '@/types/schedule';

export default function MealDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getMealById, isLoading } = useSchedule();
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    if (!isLoading) {
      const found = getMealById(id as string);
      setMeal(found || null);
    }
  }, [id, isLoading, getMealById]);

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Loading details...</div>;
  if (!meal) return <div className="p-12 text-center text-muted-foreground">Meal not found.</div>;

  // Added defensive check and fallback for bgImage
  const bgImage = PlaceHolderImages.find(img => img.id === `${meal.type}-bg`) || 
                  PlaceHolderImages[0] || 
                  { 
                    imageUrl: 'https://picsum.photos/seed/fallback/800/600', 
                    description: 'Meal image', 
                    imageHint: 'healthy meal' 
                  };

  return (
    <main className="min-h-screen animate-in fade-in duration-500">
      <div className="relative h-[300px] w-full md:h-[400px]">
        <Image 
          src={bgImage.imageUrl} 
          alt={bgImage.description} 
          fill 
          className="object-cover" 
          priority
          data-ai-hint={bgImage.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute top-6 left-6">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full shadow-lg"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:px-12 max-w-4xl mx-auto">
          <Badge className="mb-4 text-sm font-medium uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90 border-none px-3 py-1">
            {meal.type}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground leading-tight tracking-tight">
            {meal.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold font-headline mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-primary" />
              About this Meal
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {meal.description}
            </p>
          </section>

          {meal.ingredients && meal.ingredients.length > 0 && (
            <section>
              <h2 className="text-xl font-bold font-headline mb-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
                Ingredients
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meal.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center text-muted-foreground bg-secondary/20 p-3 rounded-lg border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                    {ing}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Scheduled Time</label>
                <div className="flex items-center text-2xl font-bold text-foreground font-headline">
                  <Clock className="w-6 h-6 mr-3 text-primary" />
                  {meal.time}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-12 shadow-md">
                  Mark as Completed
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20">
            <h4 className="font-bold font-headline text-primary mb-2">Daily Tip</h4>
            <p className="text-sm text-foreground/70 leading-relaxed italic">
              "Remember to hydrate at least 15 minutes before your {meal.type} to improve digestion and metabolism."
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}