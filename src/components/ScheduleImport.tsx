"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Upload, FileJson, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSchedule } from '@/hooks/use-schedule';
import { useToast } from '@/hooks/use-toast';
import { MealSchedule } from '@/types/schedule';

export function ScheduleImport() {
  const { updateSchedule } = useSchedule();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as MealSchedule;
        if (Array.isArray(json)) {
          updateSchedule(json);
          toast({
            title: "Schedule Imported",
            description: "Your meal schedule has been updated successfully.",
          });
        } else {
          throw new Error("Invalid format: Must be an array of meals.");
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "Please ensure the file is a valid JSON array of meals.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="border-dashed border-2 bg-secondary/30">
      <CardContent className="pt-6">
        <div 
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processFile(file);
          }}
        >
          <Upload className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2 font-headline">Drop your schedule JSON here</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Upload a JSON file containing your meal timings and descriptions.
          </p>
          <label>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>Select File</span>
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}