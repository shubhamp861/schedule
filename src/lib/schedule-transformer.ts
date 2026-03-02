import rawData from './diet-plan.json';
import { Meal, MealSchedule } from '@/types/schedule';

export function getInitialSchedule(): MealSchedule {
  const schedule: Meal[] = [];
  
  // Updated times to match user request: 9am, 1pm, 7pm, 11pm
  const times = {
    morning_preparing: '07:00', // Kept for completeness but not in requested notification list
    breakfast: '09:00',       // 9 AM
    mid_day_meal: '13:00',     // 1 PM
    dinner: '19:00',           // 7 PM
    "11pm_reminder": '23:00'   // 11 PM
  };

  const titles = {
    morning_preparing: 'Morning Routine',
    breakfast: 'Breakfast',
    mid_day_meal: 'Main Meal',
    dinner: 'Dinner',
    "11pm_reminder": 'Nightly Prep'
  };

  const types = {
    morning_preparing: 'breakfast' as const,
    breakfast: 'breakfast' as const,
    mid_day_meal: 'midday' as const,
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
