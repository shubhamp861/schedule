"use client";

import { useSchedule } from '@/hooks/use-schedule';
import { ScheduleImport } from '@/components/ScheduleImport';
import { MealCard } from '@/components/MealCard';
import { AiPrepTip } from '@/components/AiPrepTip';
import { NotificationManager } from '@/components/NotificationManager';
import { CalendarDays, PlusCircle, Settings, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { schedule, isLoading } = useSchedule();
  
  const breakfast = schedule.find(m => m.type === 'breakfast');

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <NotificationManager />
      
      <header className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary p-4 rounded-2xl shadow-lg">
            <BellRing className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold font-headline mb-3 text-foreground tracking-tight">ScheduleSync</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Your intelligent meal companion. Import your plan and never miss a healthy habit.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse text-muted-foreground">Syncing your schedule...</div>
        </div>
      ) : schedule.length === 0 ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ScheduleImport />
          <div className="text-center p-8 bg-muted/20 rounded-xl border border-dashed border-muted">
            <p className="text-muted-foreground">No schedule found. Upload your JSON to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold font-headline flex items-center">
                <CalendarDays className="w-6 h-6 mr-2 text-primary" />
                Today's Timeline
              </h2>
              <Button variant="ghost" size="sm" onClick={() => localStorage.removeItem('schedulesync_data')}>
                Reset Plan
              </Button>
            </div>
            
            <div className="space-y-4">
              {schedule
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold font-headline">Daily Assistant</h3>
            <AiPrepTip breakfastMeal={breakfast} />
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-2 flex items-center text-primary">
                  <BellRing className="w-4 h-4 mr-2" />
                  Notifications Active
                </h4>
                <p className="text-xs text-muted-foreground">
                  Keep this tab open to receive real-time notifications for your scheduled meals and the 11:00 PM prep reminder.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <footer className="mt-20 pt-8 border-t border-muted flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
        <p>© 2024 ScheduleSync App. Eat healthy, stay synchronized.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Help</Link>
        </div>
      </footer>
    </main>
  );
}

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
