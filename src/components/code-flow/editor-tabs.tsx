"use client";

import React from 'react';
import { PythonScript } from '@/lib/storage';
import { X, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorTabsProps {
  scripts: PythonScript[];
  activeScriptId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export default function EditorTabs({ scripts, activeScriptId, onSelect, onClose }: EditorTabsProps) {
  return (
    <div className="flex items-end h-full w-full overflow-x-auto no-scrollbar">
      {scripts.map((script) => (
        <div
          key={script.id}
          onClick={() => onSelect(script.id)}
          className={cn(
            "group flex items-center h-full px-4 min-w-[120px] max-w-[200px] border-r border-border cursor-pointer transition-colors relative",
            activeScriptId === script.id 
              ? "bg-background text-primary" 
              : "bg-sidebar/50 text-muted-foreground hover:bg-sidebar"
          )}
        >
          {activeScriptId === script.id && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
          )}
          <FileCode className={cn("w-4 h-4 mr-2 shrink-0", activeScriptId === script.id ? "text-primary" : "text-muted-foreground")} />
          <span className="text-xs truncate font-medium flex-1">{script.name}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose(script.id);
            }}
            className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-muted rounded p-0.5 transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
