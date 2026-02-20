"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConsoleOutputProps {
  output: { type: 'log' | 'error', text: string }[];
  onClear: () => void;
  isRunning: boolean;
}

export default function ConsoleOutput({ output, onClear, isRunning }: ConsoleOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="h-full flex flex-col font-code text-sm">
      <div className="flex items-center justify-between px-4 py-1.5 border-b bg-sidebar/40 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest font-body">Console</span>
          {isRunning && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-6 px-2 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Clear
        </Button>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto bg-[#0d1117] space-y-1.5"
      >
        {output.length === 0 && !isRunning && (
          <div className="flex items-center text-muted-foreground/40 italic">
            <ChevronRight className="w-4 h-4 mr-1 shrink-0" />
            <span>Ready for execution...</span>
          </div>
        )}
        
        {output.map((line, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-200",
              line.type === 'error' ? "text-destructive" : "text-foreground"
            )}
          >
            <span className="text-muted-foreground shrink-0 select-none">[{idx + 1}]</span>
            <span className="whitespace-pre-wrap">{line.text}</span>
          </div>
        ))}
        
        {isRunning && (
          <div className="flex items-center text-primary/60 italic animate-pulse">
            <ChevronRight className="w-4 h-4 mr-1 shrink-0" />
            <span>Executing process...</span>
          </div>
        )}
      </div>
    </div>
  );
}
