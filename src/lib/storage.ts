export interface PythonScript {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

const STORAGE_KEY = 'codeflow_scripts';

export const getScripts = (): PythonScript[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaultScript: PythonScript = {
      id: 'default',
      name: 'hello_world.py',
      content: 'print("Hello, CodeFlow!")\n\n# Start typing your Python code here...',
      updatedAt: Date.now(),
    };
    saveScripts([defaultScript]);
    return [defaultScript];
  }
  return JSON.parse(stored);
};

export const saveScripts = (scripts: PythonScript[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
};

export const addScript = (name: string, content: string = ''): PythonScript => {
  const scripts = getScripts();
  const newScript: PythonScript = {
    id: Math.random().toString(36).substr(2, 9),
    name: name.endsWith('.py') ? name : `${name}.py`,
    content,
    updatedAt: Date.now(),
  };
  saveScripts([newScript, ...scripts]);
  return newScript;
};

export const updateScriptContent = (id: string, content: string) => {
  const scripts = getScripts();
  const updated = scripts.map(s => s.id === id ? { ...s, content, updatedAt: Date.now() } : s);
  saveScripts(updated);
};

export const deleteScript = (id: string) => {
  const scripts = getScripts();
  const filtered = scripts.filter(s => s.id !== id);
  saveScripts(filtered);
};
