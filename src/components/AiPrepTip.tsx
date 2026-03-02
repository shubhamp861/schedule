"use client";

import { useState, useEffect } from 'react';
import { getAiBreakfastPrepTip, type AiBreakfastPrepTipOutput } from '@/ai/flows/ai-breakfast-prep-tip';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { Meal } from '@/types/schedule';

export function AiPrepTip({ breakfastMeal }: { breakfastMeal?: Meal }) {
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTip() {
      if (!breakfastMeal) return;
      setLoading(true);
      try {
        const details = `${breakfastMeal.title}: ${breakfastMeal.description} ${breakfastMeal.ingredients?.join(', ') || ''}`;
        const response = await getAiBreakfastPrepTip({ breakfastDetails: details });
        setTip(response.tip);
      } catch (err) {
        console.error("Failed to fetch AI tip", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTip();
  }, [breakfastMeal]);

  if (!breakfastMeal && !loading) return null;

  return (
    <Card className="bg-accent/10 border-accent/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center text-accent-foreground font-headline uppercase tracking-wider">
          <Sparkles className="w-4 h-4 mr-2 text-accent" />
          AI Breakfast Prep Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating your personalized prep tip...
          </div>
        ) : (
          <p className="text-sm leading-relaxed italic text-foreground/80">
            "{tip || "Get ready for a great morning tomorrow! Check your ingredients tonight."}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}