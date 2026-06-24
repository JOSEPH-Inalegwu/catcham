"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from './ToastContext';

export type PlanType = 'sandbox' | 'pro' | 'enterprise';

export interface Workspace {
  id: string;
  name: string;
  plan: PlanType;
  industry: string;
  domain?: string;
  createdAt: number;
}

export interface WorkspaceContextType {
  workspaces: Workspace[];
  isHydrated: boolean;
  createWorkspace: (data: Omit<Workspace, 'id' | 'createdAt'>) => Promise<Workspace>;
  updateWorkspace: (id: string, data: Partial<Pick<Workspace, 'name' | 'industry' | 'domain'>>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const STORAGE_KEY = 'catcham-workspaces';

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let localWorkspaces: Workspace[] = [];
    if (stored) {
      try { localWorkspaces = JSON.parse(stored); } catch {}
    }
    setWorkspaces(localWorkspaces);

    fetch('/api/workspaces')
      .then((res) => res.json())
      .then((json) => {
        if (json.workspaces && json.workspaces.length > 0) {
          const mapped = json.workspaces.map((w: any) => ({
            id: w.id,
            name: w.name,
            plan: w.plan,
            industry: w.industry ?? '',
            domain: w.domain ?? undefined,
            createdAt: new Date(w.created_at).getTime(),
          }));
          setWorkspaces(mapped);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        }
      })
      .catch(() => {})
      .finally(() => setIsHydrated(true));
  }, []);

  const createWorkspace = useCallback(async (data: Omit<Workspace, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      addToast(json.details || json.error || 'Failed to create workspace', 'error');
      throw new Error(json.error ?? 'Failed to create workspace');
    }

    const w = json.workspace;
    const newWorkspace: Workspace = {
      id: w.id,
      name: w.name,
      plan: w.plan,
      industry: w.industry ?? '',
      domain: w.domain ?? undefined,
      createdAt: new Date(w.created_at).getTime(),
    };

    const updated = [...workspaces, newWorkspace];
    setWorkspaces(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newWorkspace;
  }, [workspaces]);

  const updateWorkspace = useCallback(async (id: string, data: Partial<Pick<Workspace, 'name' | 'industry' | 'domain'>>) => {
    const res = await fetch(`/api/workspaces/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json();
      addToast(json.details || json.error || 'Failed to update workspace', 'error');
      return;
    }

    const updated = workspaces.map((w) => (w.id === id ? { ...w, ...data } : w));
    setWorkspaces(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    addToast('Workspace updated', 'success');
  }, [workspaces, addToast]);

  const deleteWorkspace = useCallback(async (id: string) => {
    const res = await fetch(`/api/workspaces/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      const json = await res.json();
      addToast(json.details || json.error || 'Failed to delete workspace', 'error');
      return;
    }

    const remaining = workspaces.filter((w) => w.id !== id);
    setWorkspaces(remaining);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    addToast('Workspace deleted', 'success');
  }, [workspaces, addToast]);

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
