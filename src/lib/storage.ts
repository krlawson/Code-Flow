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
        # if not firebase_admin._apps:
        #     cred = credentials.Certificate(config_path)
        #     firebase_admin.initialize_app(cred)
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
        print(f"🛠️ Creating venv at {venv_dir} using {sys.executable}...")
        try:
            subprocess.check_call([sys.executable, "-m", "venv", venv_dir])
            print("✅ Virtual environment created successfully.")
            
            # Suggesting next steps
            pip_path = os.path.join(venv_dir, "bin", "pip") if os.name != "nt" else os.path.join(venv_dir, "Scripts", "pip.exe")
            print(f"📦 To install dependencies, run: {pip_path} install firebase-admin")
        except Exception as e:
            print(f"❌ Failed to create venv: {e}")
    else:
        print("ℹ️ Virtual environment already exists. Ready to work.")

if __name__ == "__main__":
    setup_venv()
`;

export const getScripts = (): PythonScript[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const scripts: PythonScript[] = [
      {
        id: 'default',
        name: 'main.py',
        content: DEFAULT_SCRIPT_CONTENT,
        updatedAt: Date.now(),
      },
      {
        id: 'venv-setup',
        name: 'setup_venv.py',
        content: VENV_SETUP_CONTENT,
        updatedAt: Date.now(),
      }
    ];
    saveScripts(scripts);
    return scripts;
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
