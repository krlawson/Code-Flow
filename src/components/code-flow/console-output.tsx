"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, ChevronRight, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ConsoleOutputProps {
  output: { type: 'log' | 'error', text: string }[];
  onClear: () => void;
  isRunning: boolean;
}

export default function ConsoleOutput({ output, onClear, isRunning }: ConsoleOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [output, isRunning]);

  const handleCopyAll = () => {
    const text = output.map(o => o.text).join('\n');
    navigator.clipboard.writeText(text);
    toast({
      title: "Console Copied",
      description: "Paste these commands into your real terminal.",
    });
  };

  return (
    <div className="h-full flex flex-col font-code text-sm">
      <div className="flex items-center justify-between px-4 py-1.5 border-b bg-sidebar/40 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest font-body">Simulated Terminal</span>
          {isRunning && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyAll}
            disabled={output.length === 0}
            className="h-6 px-2 text-muted-foreground hover:text-foreground"
          >
            <Copy className="w-3.5 h-3.5 mr-1" />
            Copy All
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            disabled={isRunning || output.length === 0}
            className="h-6 px-2 text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto bg-[#0d1117] space-y-1.5 selection:bg-primary/30"
      >
        {output.length === 0 && !isRunning && (
          <div className="flex items-center text-muted-foreground/40 italic">
            <ChevronRight className="w-4 h-4 mr-1 shrink-0" />
            <span>Ready for execution simulation...</span>
          </div>
        )}
        
        {output.map((line, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-200",
              line.type === 'error' ? "text-red-400 font-bold" : "text-emerald-400"
            )}
          >
            <span className="text-muted-foreground/50 shrink-0 select-none w-6 text-right">[{idx + 1}]</span>
            <span className="whitespace-pre-wrap flex-1">{line.text}</span>
          </div>
        ))}
        
        {isRunning && (
          <div className="flex items-center text-primary/60 italic animate-pulse">
            <ChevronRight className="w-4 h-4 mr-1 shrink-0" />
            <span>Processing simulation...</span>
          </div>
        )}
      </div>
    </div>
  );
}
