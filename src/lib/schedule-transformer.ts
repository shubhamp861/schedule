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
  const rawSkinData = skinData as Record<string, any>;

  Object.keys(rawSkinData).forEach((day) => {
    ['day', 'night'].forEach((period) => {
      const routine = rawSkinData[day][period];
      if (!routine || typeof routine === 'string') return;

      const timeStr = routine.time;
      // Extract first HH:mm from "07:00-08:00 AM" or "09:30-10:30 PM"
      const timeMatch = timeStr.match(/(\d+):(\d+)/);
      let time = "08:00";
      
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const isPM = timeStr.toLowerCase().includes('pm');
        const isAM = timeStr.toLowerCase().includes('am');

        if (isPM && hours < 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
        
        time = `${String(hours).padStart(2, '0')}:${minutes}`;
      }

      const steps = routine.steps.map((s: any) => {
        const wait = s.wait_after && s.wait_after !== '0 minutes' ? ` (Wait ${s.wait_after})` : '';
        return `${s.product}: ${s.instruction}${wait}`;
      });

      schedule.push({
        id: `skin-${day.toLowerCase()}-${period}`,
        day,
        type: 'skincare',
        time,
        title: `${period === 'day' ? 'Morning' : 'Night'} Skin Routine`,
        description: `Scheduled skincare maintenance for ${day} ${period}.`,
        ingredients: steps
      });
    });
  });

  return schedule;
}
