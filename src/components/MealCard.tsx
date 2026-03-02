"use client";

import { Meal } from '@/types/schedule';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Coffee, Sun, Utensils } from 'lucide-react';
import Link from 'next/link';

const typeIcons = {
  breakfast: Coffee,
  midday: Sun,
  dinner: Utensils,
};

export function MealCard({ meal }: { meal: Meal }) {
  const Icon = typeIcons[meal.type] || ChefHat;

  return (
    <Link href={`/meals/${meal.id}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="overflow-hidden border-none shadow-md bg-card group">
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
            <h4 className="font-headline font-bold text-lg text-foreground line-clamp-1">
              {meal.title}
            </h4>
          </div>
        </div>
      </Card>
    </Link>
  );
}