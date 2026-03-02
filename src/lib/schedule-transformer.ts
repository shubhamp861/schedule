import rawData from './diet-plan.json';
import { Meal, MealSchedule } from '@/types/schedule';

export function getInitialSchedule(): MealSchedule {
  const schedule: Meal[] = [];
  
  const times = {
    morning_preparing: '08:00',
    breakfast: '09:00',
    mid_day_meal: '13:00',
    "5pm_reminder": '17:00',
    dinner: '19:00',
    "11pm_reminder": '23:00'
  };

  const titles = {
    morning_preparing: 'Morning Routine',
    breakfast: 'Breakfast',
    mid_day_meal: 'Main Meal',
    "5pm_reminder": 'Shopping List',
    dinner: 'Dinner',
    "11pm_reminder": 'Nightly Prep'
  };

  const types = {
    morning_preparing: 'breakfast' as const,
    breakfast: 'breakfast' as const,
    mid_day_meal: 'midday' as const,
    "5pm_reminder": 'midday' as const,
    dinner: 'dinner' as const,
    "11pm_reminder": 'dinner' as const
  };

  Object.entries(rawData).forEach(([day, meals]) => {
    Object.entries(meals).forEach(([key, desc]) => {
      schedule.push({
        id: `${day.toLowerCase()}-${key.replace(/_/g, '-')}`,
        day,
        type: types[key as keyof typeof types] || 'breakfast',
        time: times[key as keyof typeof times] || '08:00',
        title: titles[key as keyof typeof titles] || 'Meal',
        description: desc as string
      });
    });
  });

  return schedule;
}