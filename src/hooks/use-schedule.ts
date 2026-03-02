"use client";

import { useState, useEffect } from 'react';
import { MealSchedule, Meal } from '@/types/schedule';
import { getInitialSchedule } from '@/lib/schedule-transformer';

const STORAGE_KEY = 'schedulesync_data';

export function useSchedule() {
  const [schedule, setSchedule] = useState<MealSchedule>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSchedule(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse schedule", e);
        setSchedule(getInitialSchedule());
      }
    } else {
      const initial = getInitialSchedule();
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