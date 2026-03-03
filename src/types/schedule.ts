export type MealType = 'breakfast' | 'midday' | 'dinner' | 'shopping' | 'prep' | 'skincare';

export interface Meal {
  id: string;
  day: string; // "Monday", "Tuesday", etc.
  type: MealType;
  time: string; // HH:mm format
  title: string;
  description: string;
  ingredients?: string[];
}

export type MealSchedule = Meal[];
export type RoutineType = 'health' | 'skin';
