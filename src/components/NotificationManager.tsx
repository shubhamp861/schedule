"use client";

import { useEffect, useRef } from 'react';
import { useSchedule } from '@/hooks/use-schedule';
import { sendNotification, requestNotificationPermission } from '@/lib/notifications';
import { useRouter } from 'next/navigation';

export function NotificationManager() {
  const { schedule } = useSchedule();
  const router = useRouter();
  const lastCheckedMinute = useRef<string>('');

  useEffect(() => {
    requestNotificationPermission();
    
    const checkSchedule = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      if (currentTime === lastCheckedMinute.current) return;
      lastCheckedMinute.current = currentTime;

      // Check for meals
      const dueMeal = schedule.find(meal => meal.time === currentTime);
      if (dueMeal) {
        sendNotification(`Time for ${dueMeal.type}: ${dueMeal.title}`, {
          body: `Click to view details for your ${dueMeal.type} meal.`,
          onClick: () => {
            window.focus();
            router.push(`/meals/${dueMeal.id}`);
          }
        });
      }

      // Nightly prep notification at 11:00 PM (23:00)
      if (currentTime === '23:00') {
        const breakfast = schedule.find(m => m.type === 'breakfast');
        sendNotification(`Breakfast Prep Reminder`, {
          body: breakfast 
            ? `It's 11 PM! Time to prepare for tomorrow's breakfast: ${breakfast.title}.` 
            : `It's 11 PM! Don't forget to prep your breakfast for tomorrow.`,
          onClick: () => {
            window.focus();
            if (breakfast) router.push(`/meals/${breakfast.id}`);
            else router.push('/');
          }
        });
      }
    };

    const interval = setInterval(checkSchedule, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [schedule, router]);

  return null;
}