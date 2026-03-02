
"use client";

import { useEffect, useRef, useState } from 'react';
import { useSchedule } from '@/hooks/use-schedule';
import { sendNotification, requestNotificationPermission } from '@/lib/notifications';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NotificationManager() {
  const { schedule } = useSchedule();
  const router = useRouter();
  const lastCheckedMinute = useRef<string>('');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermissionStatus('unsupported');
    } else {
      setPermissionStatus(Notification.permission);
    }

    const checkSchedule = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      if (currentTime === lastCheckedMinute.current) return;
      
      const dueMeal = schedule.find(meal => 
        meal.day === currentDay && meal.time === currentTime
      );

      if (dueMeal) {
        lastCheckedMinute.current = currentTime;
        sendNotification(`${dueMeal.title}`, {
          body: dueMeal.description,
          onClick: () => {
            window.focus();
            // Since we moved to accordions, we just ensure the main page is focused
            // In a more complex app, we might trigger the accordion to open via state
          }
        });
      }
    };

    const interval = setInterval(checkSchedule, 1000); // Check every second for better precision
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

  if (permissionStatus === 'granted') return null;

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <Alert variant={permissionStatus === 'denied' ? "destructive" : "default"} className="bg-primary/5 border-primary/20">
        <Bell className="h-4 w-4" />
        <AlertTitle className="font-headline font-bold">
          {permissionStatus === 'denied' ? "Notifications Blocked" : "Stay Synchronized"}
        </AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
          <p className="text-sm opacity-90">
            {permissionStatus === 'denied' 
              ? "Please enable notifications in your browser settings to receive meal alerts." 
              : "Enable browser notifications to receive alerts at 9 AM, 1 PM, 5 PM, 7 PM, and 11 PM."}
          </p>
          {permissionStatus !== 'denied' && permissionStatus !== 'unsupported' && (
            <Button size="sm" onClick={handleRequestPermission} className="whitespace-nowrap">
              Enable Alerts
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
