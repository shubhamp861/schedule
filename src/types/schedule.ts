export type MealType = 'breakfast' | 'midday' | 'dinner';

export interface Meal {
  id: string;
  type: MealType;
  time: string; // HH:mm format
  title: string;
  description: string;
  ingredients?: string[];
}

export type MealSchedule = Meal[];