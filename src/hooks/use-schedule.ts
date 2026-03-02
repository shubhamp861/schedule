"use client";

import { useState, useEffect } from 'react';
import { MealSchedule, Meal } from '@/types/schedule';
import { getInitialSchedule } from '@/lib/schedule-transformer';

const STORAGE_KEY = 'schedulesync_data';

export function useSchedule() {
  const [schedule, setSchedule] = useState<MealSchedule>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initial = getInitialSchedule();
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If the number of items differs, the underlying JSON likely updated (e.g., added 5pm reminder)
        // We auto-refresh to ensure the user has the latest plan.
        if (parsed.length !== initial.length) {
          setSchedule(initial);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        } else {
          setSchedule(parsed);
        }
      } catch (e) {
        console.error("Failed to parse schedule", e);
        setSchedule(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } else {
      setSchedule(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
    setIsLoading(false);
  }, []);

  const updateSchedule = (newSchedule: MealSchedule) => {
    setSchedule(newSchedule);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedule));
  };

  const getMealById = (id: string): Meal | undefined => {
    return schedule.find((m) => m.id === id);
  };

  return { schedule, updateSchedule, isLoading, getMealById };
}