"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar';
import EditorTabs from './editor-tabs';
import CodeEditor from './code-editor';
import ConsoleOutput from './console-output';
import { PythonScript, getScripts, saveScripts, addScript, updateScriptContent, deleteScript } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function CodeFlowContainer() {
  const [scripts, setScripts] = useState<PythonScript[]>([]);
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<{ type: 'log' | 'error', text: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loaded = getScripts();
    setScripts(loaded);
    if (loaded.length > 0) {
      setActiveScriptId(loaded[0].id);
    }
  }, []);

  const activeScript = scripts.find(s => s.id === activeScriptId) || null;

  const handleCreateScript = (name: string) => {
    const newScript = addScript(name);
    setScripts(getScripts());
    setActiveScriptId(newScript.id);
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
    setConsoleOutput([{ type: 'log', text: `Running ${activeScript.name}...` }]);
    
    // Simulating script execution
    setTimeout(() => {
      const outputLines: { type: 'log' | 'error', text: string }[] = [];
      
      // Very basic simulation: detect print() calls
      const printMatches = activeScript.content.match(/print\((['"])(.*?)\1\)/g);
      if (printMatches) {
        printMatches.forEach(match => {
          const text = match.slice(7, -2);
          outputLines.push({ type: 'log', text });
        });
      } else if (activeScript.content.trim() === '') {
        outputLines.push({ type: 'log', text: '(Script is empty)' });
      } else {
        outputLines.push({ type: 'log', text: 'Script finished with no output.' });
      }

      // Detect simple syntax errors (mock)
      if (activeScript.content.includes('pirnt')) {
        outputLines.push({ type: 'error', text: 'NameError: name \'pirnt\' is not defined' });
      }

      setConsoleOutput(prev => [...prev, ...outputLines]);
      setIsRunning(false);
      toast({
        title: "Execution Finished",
        description: `Successfully executed ${activeScript.name}`,
      });
    }, 800);
  };

  const clearConsole = () => setConsoleOutput([]);

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
