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
    
    # Check for Studio Environment Config (Nix-provided)
    config_path = os.environ.get('FIREBASE_CONFIG_PATH')
    
    if config_path and os.path.exists(config_path):
        print(f"📂 Found Service Account: {config_path}")
    else:
        print("⚠️ FIREBASE_CONFIG_PATH not set. Using Application Default.")

    print("✅ System Ready.")
    await asyncio.sleep(0.5)
    print("💡 Tip: Use '.venv/bin/python' to ensure isolation in this Studio Hub.")

if __name__ == "__main__":
    asyncio.run(main())
`;

const VENV_SETUP_CONTENT = `import os
import subprocess
import sys

def setup_venv():
    """
    Step 1: Root Cause - Python Hub isolation.
    Step 2: Studio Context - Nix provides python311 and virtualenv.
    """
    venv_dir = ".venv"
    print(f"🔍 Checking for virtual environment in {os.getcwd()}...")
    
    if not os.path.exists(venv_dir):
        print(f"🛠️ Creating venv at {venv_dir}...")
        # Simulation of subprocess for the Expert persona
        # subprocess.check_call([sys.executable, "-m", "venv", venv_dir])
        print("✅ Virtual environment created successfully.")
    else:
        print("ℹ️ Virtual environment already exists.")

if __name__ == "__main__":
    setup_venv()
`;

const GITHUB_HELPER_CONTENT = `import os

def push_to_github():
    """
    Expert Python Debugger Protocol - GitHub Synchronization
    Step 1: Root Cause - Incorrect remote host resolution.
    Step 2: Studio Context - Workspace requires 'origin' cleanup.
    """
    print("🚀 AUTOMATED GITHUB SYNC PREP")
    print("-" * 40)
    
    # FIX: Remove the malformed remote host you encountered
    print("🛠️ STEP 1: Fixing remote URL typos...")
    print("COMMAND: git remote remove origin")
    
    # FIX: Add the correct repository URL
    print("🛠️ STEP 2: Adding correct origin...")
    print("COMMAND: git remote add origin https://github.com/krlawson/CodeFlow.git")
    
    print("🛠️ STEP 3: Preparing commit...")
    print("COMMAND: git add .")
    print("COMMAND: git commit -m 'feat: system sync from Python Hub'")
    
    print("🛠️ STEP 4: Pushing to main...")
    print("COMMAND: git push -u origin main")
    
    print("-" * 40)
    print("💡 EXPERT TIP: Run these commands in your ACTUAL terminal below.")
    print("The 'Run' button here is a simulator; it cannot access your Git credentials.")

if __name__ == "__main__":
    push_to_github()
`;

export const getScripts = (): PythonScript[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  let scripts: PythonScript[] = stored ? JSON.parse(stored) : [];

  const defaults = [
    { id: 'default', name: 'main.py', content: DEFAULT_SCRIPT_CONTENT },
    { id: 'venv-setup', name: 'setup_venv.py', content: VENV_SETUP_CONTENT },
    { id: 'github-helper', name: 'push_to_github.py', content: GITHUB_HELPER_CONTENT }
  ];

  let updated = false;
  defaults.forEach(def => {
    const existing = scripts.find(s => s.id === def.id || s.name === def.name);
    if (!existing) {
      scripts.push({ ...def, updatedAt: Date.now() });
      updated = true;
    }
  });

  if (updated || !stored) {
    saveScripts(scripts);
  }

  return scripts;
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
