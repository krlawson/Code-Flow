export interface PythonScript {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

const STORAGE_KEY = 'codeflow_scripts';

const DEFAULT_SCRIPT_CONTENT = `import asyncio
import os
import firebase_admin
from firebase_admin import credentials, firestore

# Expert Python Hub - Async Firestore Example
async def main():
    print("🚀 Initializing Expert Python Engine (v3.11)...")
    
    # Check for Studio Environment Config
    config_path = os.environ.get('FIREBASE_CONFIG_PATH')
    
    if config_path and os.path.exists(config_path):
        print(f"📂 Found Service Account: {config_path}")
        # if not firebase_admin._apps:
        #     cred = credentials.Certificate(config_path)
        #     firebase_admin.initialize_app(cred)
    else:
        print("⚠️ FIREBASE_CONFIG_PATH not set. Using Application Default.")

    print("✅ System Ready.")
    await asyncio.sleep(0.5)
    print("💡 Tip: Use 'await' for all Firestore operations to keep the Hub responsive.")

if __name__ == "__main__":
    asyncio.run(main())
`;

export const getScripts = (): PythonScript[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaultScript: PythonScript = {
      id: 'default',
      name: 'main.py',
      content: DEFAULT_SCRIPT_CONTENT,
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
    content: content || DEFAULT_SCRIPT_CONTENT,
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
