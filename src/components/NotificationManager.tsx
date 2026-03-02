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
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      if (currentTime === lastCheckedMinute.current) return;
      lastCheckedMinute.current = currentTime;

      // Check for meals specifically for today
      const dueMeal = schedule.find(meal => 
        meal.day === currentDay && meal.time === currentTime
      );

      if (dueMeal) {
        sendNotification(`${dueMeal.title} Time`, {
          body: dueMeal.description.length > 60 
            ? `${dueMeal.description.substring(0, 57)}...` 
            : dueMeal.description,
          onClick: () => {
            window.focus();
            router.push(`/meals/${dueMeal.id}`);
          }
        });
      }
    };

    const interval = setInterval(checkSchedule, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [schedule, router]);

  return null;
}