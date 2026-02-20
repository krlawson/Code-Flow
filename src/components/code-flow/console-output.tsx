
"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, ChevronRight, Loader2, Copy, AlertCircle } from 'lucide-react';
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
      description: "Paste these commands into your ACTUAL Firebase Studio terminal.",
    });
  };

  return (
    <div className="h-full flex flex-col font-code text-sm border-t border-border shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-sidebar/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest font-body">Terminal Simulator</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full">
            <AlertCircle className="w-3 h-3 text-accent" />
            <span className="text-[9px] text-accent uppercase font-bold tracking-tighter">Copy commands to real shell</span>
          </div>
          {isRunning && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyAll}
            disabled={output.length === 0}
            className="h-7 px-3 text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <Copy className="w-3.5 h-3.5 mr-2" />
            Copy Commands
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            disabled={isRunning || output.length === 0}
            className="h-7 px-3 text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Clear
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto bg-[#0d1117] space-y-2 selection:bg-primary/30 scroll-smooth"
      >
        {output.length === 0 && !isRunning && (
          <div className="h-full flex flex-col items-center justify-center space-y-2 opacity-30 select-none">
            <Terminal className="w-8 h-8 text-muted-foreground" />
            <div className="flex items-center text-muted-foreground text-xs italic">
              <ChevronRight className="w-4 h-4 mr-1 shrink-0" />
              <span>Ready for execution simulation...</span>
            </div>
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
            <span className="text-muted-foreground/50 shrink-0 select-none w-8 text-right font-mono text-[11px] leading-5">[{idx + 1}]</span>
            <span className="whitespace-pre-wrap flex-1 leading-5">{line.text}</span>
          </div>
        ))}
        
        {isRunning && (
          <div className="flex items-center text-primary/60 italic animate-pulse py-1">
            <ChevronRight className="w-4 h-4 mr-2 shrink-0" />
            <span className="text-xs">Processing environment variables...</span>
          </div>
        )}
      </div>
    </div>
  );
}
