import dietData from './diet-plan.json';
import skinData from './skin-routine.json';
import { Meal, MealSchedule } from '@/types/schedule';

export function getInitialSchedule(): MealSchedule {
  return getDietSchedule();
}

export function getDietSchedule(): MealSchedule {
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
    "5pm_reminder": 'Market Buy (Shopping)',
    dinner: 'Dinner',
    "11pm_reminder": 'Nightly Prep'
  };

  const types = {
    morning_preparing: 'prep' as const,
    breakfast: 'breakfast' as const,
    mid_day_meal: 'midday' as const,
    "5pm_reminder": 'shopping' as const,
    dinner: 'dinner' as const,
    "11pm_reminder": 'prep' as const
  };

  Object.entries(dietData).forEach(([day, meals]) => {
    Object.entries(meals).forEach(([key, desc]) => {
      const description = desc as string;
      const ingredients = description.includes(',') 
        ? description.split(',').map(s => s.trim())
        : [description];

      schedule.push({
        id: `health-${day.toLowerCase()}-${key.replace(/_/g, '-')}`,
        day,
        type: types[key as keyof typeof types] || 'breakfast',
        time: times[key as keyof typeof types] || '08:00',
        title: titles[key as keyof typeof titles] || 'Meal',
        description,
        ingredients
      });
    });
  });

  return schedule;
}

export function getSkinSchedule(): MealSchedule {
  const schedule: Meal[] = [];
  const rawSkinData = skinData as any;

  const resolveRoutine = (day: string, period: 'day' | 'night') => {
    let routine = rawSkinData[day][period];
    if (typeof routine === 'string') {
      const parts = routine.split(' ');
      const targetDay = parts[2]; // e.g. "Monday"
      const targetPeriod = parts[3].toLowerCase().includes('morning') ? 'day' : 'night';
      return rawSkinData[targetDay][targetPeriod];
    }
    return routine;
  };

  Object.keys(rawSkinData).forEach((day) => {
    ['day', 'night'].forEach((period) => {
      const routine = resolveRoutine(day, period as 'day' | 'night');
      if (!routine) return;

      const timeStr = routine.time;
      // Extract first HH:mm from "Morning (7:00 - 8:00 AM)" or "Night (9:30 - 10:30 PM)"
      const timeMatch = timeStr.match(/(\d+):(\d+)/);
      let time = "08:00";
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        if (timeStr.toLowerCase().includes('pm') && hours < 12) hours += 12;
        if (timeStr.toLowerCase().includes('am') && hours === 12) hours = 0;
        time = `${String(hours).padStart(2, '0')}:${minutes}`;
      }

      const steps = routine.steps.map((s: any) => `${s.product}: ${s.instruction}`);

      schedule.push({
        id: `skin-${day.toLowerCase()}-${period}`,
        day,
        type: 'skincare',
        time,
        title: `${period === 'day' ? 'Morning' : 'Night'} Skin Routine`,
        description: `Scheduled skincare maintenance for ${period}.`,
        ingredients: steps
      });
    });
  });

  return schedule;
}
