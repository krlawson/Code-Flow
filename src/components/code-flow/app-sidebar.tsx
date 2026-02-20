"use client";

import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Plus, FileJson, Trash2, FolderPlus, Terminal, Code2, Cpu, Box, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PythonScript } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';

interface AppSidebarProps {
  scripts: PythonScript[];
  activeScriptId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
}

export default function AppSidebar({ 
  scripts, 
  activeScriptId, 
  onSelect, 
  onCreate, 
  onDelete 
}: AppSidebarProps) {
  const [newFileName, setNewFileName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onCreate(newFileName);
      setNewFileName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b h-12 flex items-center justify-center px-4">
        <div className="flex items-center gap-2 font-bold text-primary group-data-[collapsible=icon]:hidden">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-xl tracking-tight">Python Hub</span>
        </div>
        <div className="hidden group-data-[collapsible=icon]:block">
          <Code2 className="w-6 h-6 text-primary" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between pr-2 group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              Environment
            </SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="px-4 py-2 space-y-2 group-data-[collapsible=icon]:hidden">
                  <div className="flex items-center gap-2 text-xs text-accent font-medium">
                    <Box className="w-3 h-3" />
                    <span>.venv detected</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Firebase Auth Active</span>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between pr-2 group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              Scripts
            </SidebarGroupLabel>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="p-1 hover:bg-sidebar-accent rounded transition-colors">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border">
                <DialogHeader>
                  <DialogTitle>New Python Script</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Filename</label>
                    <Input 
                      placeholder="myscript.py" 
                      value={newFileName} 
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="bg-sidebar"
                      autoFocus
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={!newFileName.trim()}>Create File</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {scripts.map((script) => (
                <SidebarMenuItem key={script.id}>
                  <div className="group/item flex items-center w-full pr-2">
                    <SidebarMenuButton 
                      isActive={activeScriptId === script.id}
                      onClick={() => onSelect(script.id)}
                      className={cn(
                        "flex-1",
                        activeScriptId === script.id && "bg-primary/10 text-primary border-r-2 border-primary rounded-none"
                      )}
                    >
                      <FileJson className={cn("w-4 h-4", activeScriptId === script.id ? "text-primary" : "text-accent")} />
                      <span className="truncate">{script.name}</span>
                    </SidebarMenuButton>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(script.id);
                      }}
                      className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-destructive transition-all group-data-[collapsible=icon]:hidden"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:hidden">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Cpu className="w-3 h-3 text-accent" />
            <span>Python 3.11 Nix Env</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Terminal className="w-3 h-3 text-primary" />
            <span>Studio Hub v1.0</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
