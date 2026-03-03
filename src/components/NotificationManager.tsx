
"use client";

import { useEffect, useRef, useState } from 'react';
import { useSchedule } from '@/hooks/use-schedule';
import { sendNotification, requestNotificationPermission } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { Bell, Clock, AlertCircle, Timer, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Meal } from '@/types/schedule';
import { useToast } from '@/hooks/use-toast';

export function NotificationManager() {
  const { schedule } = useSchedule();
  const { toast } = useToast();
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
            onClick: `/meals/${dueMeal.id}`
          });
        }
      }

      // 2. Calculate next meal and countdown
      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const currentDayIdx = dayOrder.indexOf(currentDay);

      const allUpcoming = [...schedule].sort((a, b) => {
        const dayA = dayOrder.indexOf(a.day);
        const dayB = dayOrder.indexOf(b.day);
        if (dayA !== dayB) return dayA - dayB;
        return a.time.localeCompare(b.time);
      });

      let next = allUpcoming.find(m => {
        const mDayIdx = dayOrder.indexOf(m.day);
        if (mDayIdx > currentDayIdx) return true;
        if (mDayIdx === currentDayIdx) return m.time > currentTimeStr;
        return false;
      });

      if (!next && allUpcoming.length > 0) {
        next = allUpcoming[0];
      }

      if (next) {
        setNextMeal(next);
        
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
    updateStatus(); 
    return () => clearInterval(interval);
  }, [schedule]);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermissionStatus('granted');
      await sendNotification("Notifications Enabled!", {
        body: "You will now receive alerts for your diet plan."
      });
      toast({
        title: "Success",
        description: "Notifications have been enabled.",
      });
    } else {
      setPermissionStatus(Notification.permission);
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings.",
      });
    }
  };

  const handleTestNotification = async () => {
    if (permissionStatus !== 'granted') {
      await handleRequestPermission();
    } else {
      await sendNotification("Test Alert Successful!", {
        body: "Your ScheduleSync notifications are properly configured and working.",
      });
      toast({
        title: "Test Sent",
        description: "A test notification has been sent to your device.",
      });
    }
  };

  return (
    <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Permission Request Alert */}
      {permissionStatus !== 'granted' ? (
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
                Enable Notifications
              </Button>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleTestNotification} className="text-xs flex items-center gap-2">
            <Send className="w-3 h-3" />
            Send Test Alert
          </Button>
        </div>
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
