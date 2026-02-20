
"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar';
import EditorTabs from './editor-tabs';
import CodeEditor from './code-editor';
import ConsoleOutput from './console-output';
import { PythonScript, getScripts, addScript, updateScriptContent, deleteScript } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function CodeFlowContainer() {
  const [scripts, setScripts] = useState<PythonScript[]>([]);
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<{ type: 'log' | 'error', text: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loaded = getScripts();
    setScripts(loaded);
    if (loaded.length > 0 && !activeScriptId) {
      setActiveScriptId(loaded[0].id);
    }
    setIsMounted(true);
  }, [activeScriptId]);

  const activeScript = scripts.find(s => s.id === activeScriptId) || null;

  const handleCreateScript = (name: string) => {
    const newScript = addScript(name);
    const updated = getScripts();
    setScripts(updated);
    setActiveScriptId(newScript.id);
  };

  const handleGenerateNew = (name: string, content: string) => {
    const newScript = addScript(name, content);
    setScripts(getScripts());
    setActiveScriptId(newScript.id);
    toast({
      title: "Script Generated",
      description: `Created ${newScript.name} using AI`,
    });
  };

  const handleUpdateContent = (content: string) => {
    if (!activeScriptId) return;
    updateScriptContent(activeScriptId, content);
    setScripts(getScripts());
  };

  const handleDeleteScript = (id: string) => {
    deleteScript(id);
    const updated = getScripts();
    setScripts(updated);
    if (activeScriptId === id) {
      setActiveScriptId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleRunScript = () => {
    if (!activeScript) return;
    
    setIsRunning(true);
    setConsoleOutput([{ type: 'log', text: `> python3 ${activeScript.name}` }]);
    
    const envLogs = [
      { type: 'log', text: '🔍 Scanning for virtual environment...' },
      { type: 'log', text: '✅ Found .venv (Python 3.11.5)' },
      { type: 'log', text: '🚀 Initializing Python Hub Engine...' },
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < envLogs.length) {
        setConsoleOutput(prev => [...prev, envLogs[step]]);
        step++;
      } else {
        clearInterval(interval);
        
        const scriptOutput: { type: 'log' | 'error', text: string }[] = [];
        
        // Advanced detection for terminal commands and logs
        const lines = activeScript.content.split('\n');
        lines.forEach(line => {
          const printMatch = line.match(/print\s*\(\s*(['"])(.*?)\1\s*\)/);
          const commandMatch = line.match(/COMMAND:\s*(.*)/);
          
          if (printMatch) {
            scriptOutput.push({ type: 'log', text: printMatch[2] });
          } else if (commandMatch) {
            scriptOutput.push({ type: 'log', text: `SHELL: ${commandMatch[1]}` });
          }
        });

        if (scriptOutput.length === 0) {
          scriptOutput.push({ type: 'log', text: 'Process finished with exit code 0.' });
        }

        // Mock error detection
        if (activeScript.content.includes('pirnt')) {
           scriptOutput.push({ 
             type: 'error', 
             text: 'Traceback (most recent call last):\n  File "' + activeScript.name + '", line 12, in <module>\n    pirnt("hello")\nNameError: name \'pirnt\' is not defined.' 
           });
        }

        setConsoleOutput(prev => [...prev, ...scriptOutput]);
        setIsRunning(false);
        toast({
          title: "Execution Simulation Finished",
          description: "Check the Terminal for instructions.",
        });
      }
    }, 200);
  };

  const clearConsole = () => setConsoleOutput([]);

  if (!isMounted) {
    return <div className="h-screen w-screen bg-background" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        scripts={scripts} 
        activeScriptId={activeScriptId} 
        onSelect={setActiveScriptId}
        onCreate={handleCreateScript}
        onDelete={handleDeleteScript}
      />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden">
          <header className="h-12 shrink-0 border-b flex items-center px-4 bg-sidebar/50">
            <EditorTabs 
              scripts={scripts} 
              activeScriptId={activeScriptId} 
              onSelect={setActiveScriptId} 
              onClose={(id) => handleDeleteScript(id)}
            />
          </header>
          
          <main className="flex-1 min-h-0 overflow-hidden relative border-b">
            <CodeEditor 
              script={activeScript} 
              onChange={handleUpdateContent} 
              onRun={handleRunScript}
              isRunning={isRunning}
              onCreateDefault={() => handleCreateScript('main.py')}
              onGenerateNew={handleGenerateNew}
            />
          </main>

          <footer className="h-[35%] min-h-[200px] shrink-0 bg-sidebar/30">
            <ConsoleOutput 
              output={consoleOutput} 
              onClear={clearConsole}
              isRunning={isRunning}
            />
          </footer>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
