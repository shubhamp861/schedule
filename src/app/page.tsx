"use client";

import { useSchedule } from '@/hooks/use-schedule';
import { ScheduleImport } from '@/components/ScheduleImport';
import { MealCard } from '@/components/MealCard';
import { NotificationManager } from '@/components/NotificationManager';
import { CalendarDays, BellRing, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export default function Home() {
  const { schedule, isLoading } = useSchedule();
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    setCurrentDay(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  }, []);

  const todayMeals = schedule
    .filter(meal => meal.day === currentDay)
    .sort((a, b) => a.time.localeCompare(b.time));
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <NotificationManager />
      
      <header className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary p-4 rounded-2xl shadow-lg">
            <BellRing className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold font-headline mb-2 text-foreground tracking-tight">ScheduleSync</h1>
        <p className="text-muted-foreground text-lg mb-4">
          Diet plan for <span className="text-primary font-bold">{currentDay}</span>
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
                Timeline
              </h2>
              <Button variant="ghost" size="sm" onClick={() => {
                localStorage.removeItem('schedulesync_data');
                window.location.reload();
              }}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Plan
              </Button>
            </div>
            
            <div className="space-y-4">
              {todayMeals.length > 0 ? (
                todayMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))
              ) : (
                <div className="text-center p-12 bg-muted/10 rounded-xl border border-dashed border-muted/50">
                  <p className="text-muted-foreground">No meals found for {currentDay}.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold font-headline">Sync Status</h3>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-2 flex items-center text-primary">
                  <BellRing className="w-4 h-4 mr-2" />
                  Notifications Active
                </h4>
                <p className="text-xs text-muted-foreground">
                  The app is now tracking your {currentDay} schedule. Keep this tab open to receive timely alerts.
                </p>
              </CardContent>
            </Card>

            <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-xs text-accent-foreground font-medium">
                Tip: Your daily 11 PM prep reminders are automatically updated based on tomorrow's needs.
              </p>
            </div>
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