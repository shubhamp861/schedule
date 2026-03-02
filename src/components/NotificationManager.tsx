"use client";

import { useEffect, useRef, useState } from 'react';
import { useSchedule } from '@/hooks/use-schedule';
import { sendNotification, requestNotificationPermission } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { Bell, Clock, AlertCircle, Timer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Meal } from '@/types/schedule';

export function NotificationManager() {
  const { schedule } = useSchedule();
  const lastCheckedMinute = useRef<string>('');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [nextMeal, setNextMeal] = useState<Meal | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermissionStatus('unsupported');
    } else {
      setPermissionStatus(Notification.permission);
    }

    const updateStatus = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;

      // 1. Check for notifications to trigger
      if (currentTimeStr !== lastCheckedMinute.current) {
        const dueMeal = schedule.find(meal => 
          meal.day === currentDay && meal.time === currentTimeStr
        );

        if (dueMeal) {
          lastCheckedMinute.current = currentTimeStr;
          sendNotification(`${dueMeal.title}`, {
            body: dueMeal.description,
          });
        }
      }

      // 2. Calculate next meal and countdown
      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const currentDayIdx = dayOrder.indexOf(currentDay);

      // Get all upcoming meals (today after now, or following days)
      const allUpcoming = [...schedule].sort((a, b) => {
        const dayA = dayOrder.indexOf(a.day);
        const dayB = dayOrder.indexOf(b.day);
        if (dayA !== dayB) return dayA - dayB;
        return a.time.localeCompare(b.time);
      });

      // Find first meal that is after 'now'
      let next = allUpcoming.find(m => {
        const mDayIdx = dayOrder.indexOf(m.day);
        if (mDayIdx > currentDayIdx) return true;
        if (mDayIdx === currentDayIdx) return m.time > currentTimeStr;
        return false;
      });

      // If none found for the rest of the week, take the first meal of the week (next Monday)
      if (!next && allUpcoming.length > 0) {
        next = allUpcoming[0];
      }

      if (next) {
        setNextMeal(next);
        
        // Calculate diff
        const [targetH, targetM] = next.time.split(':').map(Number);
        const targetDate = new Date(now);
        targetDate.setHours(targetH, targetM, 0, 0);
        
        const nextDayIdx = dayOrder.indexOf(next.day);
        let daysDiff = nextDayIdx - currentDayIdx;
        if (daysDiff < 0 || (daysDiff === 0 && next.time <= currentTimeStr)) {
          daysDiff += 7;
        }
        
        targetDate.setDate(targetDate.getDate() + daysDiff);
        
        const diffMs = targetDate.getTime() - now.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHrs > 0) {
          setTimeLeft(`${diffHrs}h ${diffMins}m`);
        } else {
          setTimeLeft(`${diffMins}m`);
        }
      }
    };

    const interval = setInterval(updateStatus, 1000);
    updateStatus(); // Initial call
    return () => clearInterval(interval);
  }, [schedule]);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermissionStatus('granted');
      sendNotification("Notifications Enabled!", {
        body: "You will now receive alerts for your diet plan."
      });
    } else {
      setPermissionStatus(Notification.permission);
    }
  };

  return (
    <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Permission Request Alert */}
      {permissionStatus !== 'granted' && (
        <Alert variant={permissionStatus === 'denied' ? "destructive" : "default"} className="bg-primary/5 border-primary/20">
          <Bell className="h-4 w-4" />
          <AlertTitle className="font-headline font-bold">
            {permissionStatus === 'denied' ? "Notifications Blocked" : "Enable Alerts"}
          </AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <p className="text-sm opacity-90">
              {permissionStatus === 'denied' 
                ? "Please allow notifications in browser settings to stay synced." 
                : "Grant permission to receive push alerts for your meals."}
            </p>
            {permissionStatus !== 'denied' && permissionStatus !== 'unsupported' && (
              <Button size="sm" onClick={handleRequestPermission} className="whitespace-nowrap font-bold shadow-sm">
                Request Permission
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Countdown Timer */}
      {nextMeal && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-lg">
              <Timer className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next Notification</p>
              <h4 className="font-bold text-foreground">
                {nextMeal.title} ({nextMeal.time})
              </h4>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Starts In</p>
            <p className="text-2xl font-bold font-headline text-accent tabular-nums">
              {timeLeft}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
