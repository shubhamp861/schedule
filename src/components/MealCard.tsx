"use client";

import { Meal } from '@/types/schedule';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Coffee, Sun, Utensils, Info, CheckCircle2 } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const typeIcons = {
  breakfast: Coffee,
  midday: Sun,
  dinner: Utensils,
};

export function MealCard({ meal }: { meal: Meal }) {
  const Icon = typeIcons[meal.type] || ChefHat;

  return (
    <AccordionItem value={meal.id} className="border-none mb-4">
      <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
        <div className="w-full text-left transition-transform hover:scale-[1.01]">
          <div className="overflow-hidden rounded-xl border-none shadow-sm bg-card group">
            <div className="flex items-center p-4 gap-4">
              <div className="bg-primary/20 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="secondary" className="capitalize font-medium">
                    {meal.type}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground font-medium">
                    <Clock className="w-4 h-4 mr-1" />
                    {meal.time}
                  </div>
                </div>
                <h4 className="font-headline font-bold text-lg text-foreground">
                  {meal.title}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="bg-muted/30 rounded-xl p-6 border border-border/50 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-4">
            <section>
              <h5 className="text-sm font-bold font-headline mb-2 flex items-center text-primary uppercase tracking-wider">
                <Info className="w-4 h-4 mr-2" />
                About this Meal
              </h5>
              <p className="text-base text-foreground/80 leading-relaxed">
                {meal.description}
              </p>
            </section>

            {meal.ingredients && meal.ingredients.length > 0 && (
              <section className="pt-2">
                <h5 className="text-sm font-bold font-headline mb-2 flex items-center text-primary uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Ingredients
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {meal.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
