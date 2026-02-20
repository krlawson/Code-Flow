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
    
    // Define environment logs to make the console feel "active"
    const envLogs = [
      { type: 'log', text: '🔍 Scanning for virtual environment...' },
      { type: 'log', text: '✅ Found .venv (Python 3.11.5)' },
      { type: 'log', text: '🚀 Initializing Firebase Admin SDK (FIREBASE_CONFIG_PATH detected)...' },
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < envLogs.length) {
        setConsoleOutput(prev => [...prev, envLogs[step]]);
        step++;
      } else {
        clearInterval(interval);
        
        // Final script output simulation
        const scriptOutput: { type: 'log' | 'error', text: string }[] = [];
        
        // Improved print detection (supports variables, numbers, strings)
        const printRegex = /print\s*\(\s*(['"])(.*?)\1\s*\)|print\s*\(\s*([^'"].*?)\s*\)/g;
        let match;
        while ((match = printRegex.exec(activeScript.content)) !== null) {
          const text = match[2] || match[3];
          scriptOutput.push({ type: 'log', text: text.trim() });
        }

        if (scriptOutput.length === 0) {
          if (activeScript.content.trim() === '') {
            scriptOutput.push({ type: 'log', text: '(Script is empty)' });
          } else {
            scriptOutput.push({ type: 'log', text: 'Process finished with exit code 0.' });
          }
        }

        // Mock error detection (simulating common Python errors for the prototype)
        if (activeScript.content.includes('pirnt')) {
           scriptOutput.push({ 
             type: 'error', 
             text: 'Traceback (most recent call last):\n  File "' + activeScript.name + '", line 12, in <module>\n    pirnt("hello")\nNameError: name \'pirnt\' is not defined. Did you mean: \'print\'?' 
           });
        }

        if (activeScript.content.includes('import non_existent')) {
          scriptOutput.push({ 
            type: 'error', 
            text: 'ModuleNotFoundError: No module named \'non_existent\'' 
          });
        }

        setConsoleOutput(prev => [...prev, ...scriptOutput]);
        setIsRunning(false);
        toast({
          title: "Execution Finished",
          description: `Successfully executed ${activeScript.name}`,
        });
      }
    }, 300);
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
      <SidebarInset className="flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 bg-background">
          <header className="h-12 border-b flex items-center px-4 bg-sidebar/50">
            <EditorTabs 
              scripts={scripts} 
              activeScriptId={activeScriptId} 
              onSelect={setActiveScriptId} 
              onClose={(id) => handleDeleteScript(id)}
            />
          </header>
          
          <main className="flex-1 overflow-hidden relative">
            <CodeEditor 
              script={activeScript} 
              onChange={handleUpdateContent} 
              onRun={handleRunScript}
              isRunning={isRunning}
              onCreateDefault={() => handleCreateScript('main.py')}
              onGenerateNew={handleGenerateNew}
            />
          </main>

          <footer className="h-1/3 min-h-[200px] border-t bg-sidebar/30">
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
