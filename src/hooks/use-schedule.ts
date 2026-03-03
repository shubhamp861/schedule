"use client";

import { useState, useEffect } from 'react';
import { MealSchedule, Meal, RoutineType } from '@/types/schedule';
import { getDietSchedule, getSkinSchedule } from '@/lib/schedule-transformer';

const STORAGE_KEY_HEALTH = 'schedulesync_data_health';
const STORAGE_KEY_SKIN = 'schedulesync_data_skin';
const STORAGE_KEY_MODE = 'schedulesync_mode';

export function useSchedule() {
  const [routineMode, setRoutineMode] = useState<RoutineType>('health');
  const [schedule, setSchedule] = useState<MealSchedule>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE) as RoutineType || 'health';
    setRoutineMode(savedMode);
    loadSchedule(savedMode);
    setIsLoading(false);
  }, []);

  const loadSchedule = (mode: RoutineType) => {
    const key = mode === 'health' ? STORAGE_KEY_HEALTH : STORAGE_KEY_SKIN;
    const initial = mode === 'health' ? getDietSchedule() : getSkinSchedule();
    const saved = localStorage.getItem(key);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length !== initial.length) {
          setSchedule(initial);
          localStorage.setItem(key, JSON.stringify(initial));
        } else {
          setSchedule(parsed);
        }
      } catch (e) {
        setSchedule(initial);
        localStorage.setItem(key, JSON.stringify(initial));
      }
    } else {
      setSchedule(initial);
      localStorage.setItem(key, JSON.stringify(initial));
    }
  };

  const toggleMode = () => {
    const newMode = routineMode === 'health' ? 'skin' : 'health';
    setRoutineMode(newMode);
    localStorage.setItem(STORAGE_KEY_MODE, newMode);
    loadSchedule(newMode);
  };

  const updateSchedule = (newSchedule: MealSchedule) => {
    setSchedule(newSchedule);
    const key = routineMode === 'health' ? STORAGE_KEY_HEALTH : STORAGE_KEY_SKIN;
    localStorage.setItem(key, JSON.stringify(newSchedule));
  };

  const getMealById = (id: string): Meal | undefined => {
    return schedule.find((m) => m.id === id);
  };

  return { schedule, updateSchedule, isLoading, getMealById, routineMode, toggleMode };
}
