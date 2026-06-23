"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PlanType = 'sandbox' | 'pro' | 'enterprise';

export interface Workspace {
  id: string; // The URL-safe slug
  name: string;
  plan: PlanType;
  industry: string;
  domain?: string;
  createdAt: number;
}

export interface WorkspaceContextType {
  workspaces: Workspace[];
  isHydrated: boolean;
  createWorkspace: (data: Omit<Workspace, 'id' | 'createdAt'>) => Workspace;
  updateWorkspace: (id: string, data: Partial<Pick<Workspace, 'name' | 'industry' | 'domain'>>) => void;
  deleteWorkspace: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Sluggification Utility
function generateSlug(name: string, existingWorkspaces: Workspace[]): string {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // replace spaces and non-word chars with hyphens
    .replace(/^-+|-+$/g, ''); // trim hyphens from start/end

  let uniqueSlug = baseSlug || 'workspace';
  let counter = 1;
  
  // Ensure collision-free slug
  while (existingWorkspaces.some(w => w.id === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hydrate state from localStorage
    const stored = localStorage.getItem('catcham-workspaces');
    let loadedWorkspaces: Workspace[] = [];
    
    if (stored) {
      try {
        loadedWorkspaces = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse workspaces from localStorage", e);
      }
    }
    
    setWorkspaces(loadedWorkspaces);
    setIsHydrated(true);
  }, []);

  const createWorkspace = (data: Omit<Workspace, 'id' | 'createdAt'>) => {
    const slug = generateSlug(data.name, workspaces);
    const newWorkspace: Workspace = {
      ...data,
      id: slug,
      createdAt: Date.now(),
    };

    const newWorkspaces = [...workspaces, newWorkspace];
    setWorkspaces(newWorkspaces);
    localStorage.setItem('catcham-workspaces', JSON.stringify(newWorkspaces));
    
    return newWorkspace;
  };

  const updateWorkspace = (id: string, data: Partial<Pick<Workspace, 'name' | 'industry' | 'domain'>>) => {
    const updated = workspaces.map(w => w.id === id ? { ...w, ...data } : w);
    setWorkspaces(updated);
    localStorage.setItem('catcham-workspaces', JSON.stringify(updated));
  };

  const deleteWorkspace = (id: string) => {
    const remaining = workspaces.filter(w => w.id !== id);
    setWorkspaces(remaining);
    localStorage.setItem('catcham-workspaces', JSON.stringify(remaining));
  };

  return (
    <WorkspaceContext.Provider value={{ workspaces, isHydrated, createWorkspace, updateWorkspace, deleteWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
