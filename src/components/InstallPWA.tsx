"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Share } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Automatically show our custom install dialog when the browser is ready
      setShowDialog(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setShowDialog(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the native install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowDialog(false);
      }
    }
  };

  if (!isMounted || isInstalled) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <div className="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <Download className="text-primary-foreground w-6 h-6" />
          </div>
          <DialogTitle className="font-headline font-bold text-center text-xl">Install ScheduleSync?</DialogTitle>
          <DialogDescription className="text-center">
            Install the app on your device for reliable offline notifications and a faster experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Button 
            onClick={handleInstallClick}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Install Now
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setShowDialog(false)} 
            className="w-full text-muted-foreground"
          >
            Maybe Later
          </Button>

          <div className="pt-4 border-t border-border space-y-4">
            <p className="text-[10px] text-center uppercase tracking-widest font-bold text-muted-foreground">Manual Steps if prompt fails</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-1 font-bold text-xs">
                  <Smartphone className="w-3 h-3 text-primary" /> Android
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">Menu (⋮) → Install app</p>
              </div>
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-1 font-bold text-xs">
                  <Share className="w-3 h-3 text-primary" /> iOS
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">Share → Add to Home</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
