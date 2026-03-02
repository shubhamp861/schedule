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
  DialogTrigger,
} from "@/components/ui/dialog";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isMounted) return null;

  return (
    <div className="mt-16 p-8 bg-primary/5 rounded-3xl border border-primary/20 text-center animate-in fade-in zoom-in duration-700">
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-6">
          <Download className="text-primary-foreground w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold font-headline text-foreground">Download ScheduleSync</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Install this app on your device to receive meal notifications reliably and access your plan offline.
        </p>

        {isInstallable ? (
          <Button 
            onClick={handleInstallClick}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Download className="w-5 h-5" />
            Download Application
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="w-full border-2 border-primary/30 text-primary font-bold h-14 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary/5"
              >
                <Download className="w-5 h-5" />
                Download Application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl">
              <DialogHeader>
                <DialogTitle className="font-headline font-bold text-xl">Download Guide</DialogTitle>
                <DialogDescription>
                  Follow these steps to download ScheduleSync to your home screen:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <h4 className="font-bold flex items-center gap-2 text-primary">
                    <Smartphone className="w-4 h-4" /> Android (Chrome)
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    Tap the <strong>three dots</strong> (menu) in the top right and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold flex items-center gap-2 text-primary">
                    <Share className="w-4 h-4" /> iOS (Safari)
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    Tap the <strong>Share</strong> button at the bottom and select <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}