import rawData from './diet-plan.json';
import { Meal, MealSchedule } from '@/types/schedule';

export function getInitialSchedule(): MealSchedule {
  const schedule: Meal[] = [];
  const times = {
    morning_preparing: '07:00',
    breakfast: '09:00',
    mid_day_meal: '13:30',
    dinner: '20:30',
    "11pm_reminder": '23:00'
  };

  const titles = {
    morning_preparing: 'Morning Routine',
    breakfast: 'Breakfast',
    mid_day_meal: 'Main Meal',
    dinner: 'Dinner',
    "11pm_reminder": 'Nightly Prep'
  };

  const types = {
    morning_preparing: 'breakfast',
    breakfast: 'breakfast',
    mid_day_meal: 'midday',
    dinner: 'dinner',
    "11pm_reminder": 'dinner'
  };

  Object.entries(rawData).forEach(([day, meals]) => {
    Object.entries(meals).forEach(([key, desc]) => {
      schedule.push({
        id: `${day.toLowerCase()}-${key.replace(/_/g, '-')}`,
        day,
        type: types[key as keyof typeof types] as any,
        time: times[key as keyof typeof times],
        title: titles[key as keyof typeof titles],
        description: desc as string
      });
    });
  });

  return schedule;
}