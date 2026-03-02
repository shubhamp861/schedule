
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Share, CheckCircle2 } from 'lucide-react';
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
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('Capture install prompt');
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      console.log('App installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleDownloadClick = async () => {
    if (deferredPrompt) {
      // Trigger the native browser install prompt immediately
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Only show guide if the browser doesn't support the direct prompt (e.g., iOS)
      setShowGuide(true);
    }
  };

  if (!isMounted || isInstalled) return null;

  return (
    <div className="mt-16 p-8 bg-primary/5 rounded-3xl border border-primary/20 text-center animate-in fade-in zoom-in duration-700">
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-6">
          <Download className="text-primary-foreground w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold font-headline text-foreground">Get ScheduleSync App</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Install on your device for reliable offline notifications and a better experience.
        </p>

        <Button 
          onClick={handleDownloadClick}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <Download className="w-5 h-5" />
          Download Application
        </Button>

        <Dialog open={showGuide} onOpenChange={setShowGuide}>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="font-headline font-bold text-xl">Quick Install</DialogTitle>
              <DialogDescription>
                Follow these simple steps to download the app to your device:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <h4 className="font-bold flex items-center gap-2 text-primary">
                  <Smartphone className="w-4 h-4" /> Android (Chrome)
                </h4>
                <p className="text-sm text-muted-foreground pl-6">
                  Tap the <span className="font-bold">three dots</span> (menu) and select <span className="font-bold text-foreground">"Install app"</span>.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold flex items-center gap-2 text-primary">
                  <Share className="w-4 h-4" /> iOS (Safari)
                </h4>
                <p className="text-sm text-muted-foreground pl-6">
                  Tap the <span className="font-bold">Share</span> button and select <span className="font-bold text-foreground">"Add to Home Screen"</span>.
                </p>
              </div>
            </div>
            <Button onClick={() => setShowGuide(false)} className="w-full mt-4">Got it</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
