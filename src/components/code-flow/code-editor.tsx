"use client";

import React, { useState, useEffect } from 'react';
import { PythonScript } from '@/lib/storage';
import { Play, Sparkles, Wand2, Info, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { generatePythonScriptFromPrompt } from '@/ai/flows/generate-python-script-from-prompt';
import { explainPythonCodeSnippet } from '@/ai/flows/explain-python-code-snippet-flow';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface CodeEditorProps {
  script: PythonScript | null;
  onChange: (content: string) => void;
  onRun: () => void;
  isRunning: boolean;
  onCreateDefault?: () => void;
}

export default function CodeEditor({ script, onChange, onRun, isRunning, onCreateDefault }: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  useEffect(() => {
    if (script) {
      setLineCount(script.content.split('\n').length || 1);
    }
  }, [script]);

  if (!script) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-background space-y-6">
        <div className="p-6 rounded-full bg-sidebar/10 border border-border/50">
          <CodeBracketIcon className="w-16 h-16 opacity-20" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">No script selected</h3>
          <p className="text-sm max-w-[280px]">Select a file from the sidebar or create a new one to start building.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={onCreateDefault}
          className="border-primary/20 hover:border-primary/50 text-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create First Script
        </Button>
      </div>
    );
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setLineCount(e.target.value.split('\n').length || 1);
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generatePythonScriptFromPrompt({ prompt: aiPrompt });
      onChange(result.script);
      setAiPrompt('');
      setIsAiDialogOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExplain = async () => {
    if (!script.content.trim()) return;
    setIsExplaining(true);
    try {
      const result = await explainPythonCodeSnippet({ codeSnippet: script.content });
      setExplanation(result.explanation);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleDownload = () => {
    if (!script) return;
    const blob = new Blob([script.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background font-code">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-sidebar/10">
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onRun} 
            disabled={isRunning}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Play className={cn("w-4 h-4 mr-2", isRunning && "animate-pulse")} />
            {isRunning ? 'Running...' : 'Run Script'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="border-border hover:border-primary/50"
            title="Export to .py"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAiDialogOpen(true)}
            className="border-primary/20 hover:border-primary/50 text-primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generator
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExplain}
            disabled={isExplaining}
            className="border-accent/20 hover:border-accent/50 text-accent"
          >
            <Info className="w-4 h-4 mr-2" />
            {isExplaining ? 'Thinking...' : 'Explain Code'}
          </Button>
        </div>
        <div className="text-[10px] text-muted-foreground font-body uppercase tracking-widest">
          Python 3.11 • UTF-8
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="w-12 bg-sidebar/10 border-r py-4 px-2 text-right text-xs text-muted-foreground select-none shrink-0 overflow-hidden">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-6 leading-6">{i + 1}</div>
          ))}
        </div>

        <textarea
          value={script.content}
          onChange={handleTextChange}
          spellCheck={false}
          className="flex-1 p-4 bg-transparent outline-none resize-none text-sm leading-6 h-full w-full font-code text-foreground focus:ring-0 placeholder:text-muted-foreground/30"
          placeholder="# Start coding your Python masterpiece..."
        />

        {explanation && (
          <div className="absolute top-4 right-4 w-1/3 max-h-[80%] bg-card/95 backdrop-blur-md border border-accent/30 rounded-lg shadow-2xl p-6 overflow-auto animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between mb-4 border-b border-accent/20 pb-2">
              <div className="flex items-center gap-2 text-accent font-bold text-sm font-body">
                <Wand2 className="w-4 h-4" />
                AI Assistant
              </div>
              <button 
                onClick={() => setExplanation(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-foreground leading-relaxed font-body whitespace-pre-wrap">
              {explanation}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent className="bg-background border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Generate with AI
            </DialogTitle>
            <DialogDescription className="font-body">
              Describe the Python script you want to build. CodeFlow will generate the logic and structure for you.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="e.g. A script that scrapes news headlines from a URL or a data processing script using pandas..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[120px] font-body"
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !aiPrompt.trim()}
              className="w-full bg-primary"
            >
              {isGenerating ? 'Generating...' : 'Generate Script'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CodeBracketIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
