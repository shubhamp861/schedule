"use client";

import { Meal } from '@/types/schedule';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Coffee, Sun, Utensils, Info, CheckCircle2, ShoppingCart, Sparkles, Droplets } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const typeIcons = {
  breakfast: Coffee,
  midday: Sun,
  dinner: Utensils,
  shopping: ShoppingCart,
  prep: Sparkles,
  skincare: Droplets,
};

const typeColors = {
  breakfast: "bg-blue-500/10 text-blue-500",
  midday: "bg-orange-500/10 text-orange-500",
  dinner: "bg-purple-500/10 text-purple-500",
  shopping: "bg-green-500/10 text-green-500",
  prep: "bg-pink-500/10 text-pink-500",
  skincare: "bg-cyan-500/10 text-cyan-500",
};

export function MealCard({ meal }: { meal: Meal }) {
  const Icon = typeIcons[meal.type] || ChefHat;
  const colorClass = typeColors[meal.type] || "bg-primary/20 text-primary";

  return (
    <AccordionItem value={meal.id} className="border-none mb-4">
      <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
        <div className="w-full text-left transition-transform hover:scale-[1.01]">
          <div className="overflow-hidden rounded-xl border-none shadow-sm bg-card group">
            <div className="flex items-center p-4 gap-4">
              <div className={`${colorClass} p-3 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="secondary" className="capitalize font-medium">
                    {meal.type === 'shopping' ? 'Market Buy' : meal.type === 'skincare' ? 'Routine' : meal.type}
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
                Details
              </h5>
              <p className="text-base text-foreground/80 leading-relaxed">
                {meal.description}
              </p>
            </section>

            {meal.ingredients && meal.ingredients.length > 0 && (
              <section className="pt-2">
                <h5 className="text-sm font-bold font-headline mb-2 flex items-center text-primary uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {meal.type === 'skincare' ? 'Steps & Products' : 'Notes / Ingredients'}
                </h5>
                <ul className="space-y-3">
                  {meal.ingredients.map((ing, idx) => {
                    const [product, instruction] = ing.includes(':') ? ing.split(':') : [ing, null];
                    return (
                      <li key={idx} className="flex items-start text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/40">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground leading-tight mb-1">{product}</p>
                          {instruction && <p className="text-xs opacity-80">{instruction.trim()}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
