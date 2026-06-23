"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWorkspace, Workspace, PlanType } from '@/app/context/WorkspaceContext';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';
import Modal from '@/components/Modal';

function WorkspaceSwitcher({ workspaces, current, onChange }: { workspaces: Workspace[], current?: Workspace, onChange: (w: Workspace) => void }) {
  const [open, setOpen] = useState(false);
  const hasMultiple = workspaces.length > 1;

  return (
    <div className="relative">
      <button
        onClick={() => hasMultiple && setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] transition-colors text-sm ${hasMultiple ? 'hover:bg-[#1A1A1A] cursor-pointer' : 'cursor-default'}`}
      >
        <span className="text-[#ffffff] font-semibold hidden sm:inline">{current?.name || 'Loading...'}</span>
        {hasMultiple && (
          <svg className={`w-3.5 h-3.5 text-[#a0a0a0] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        )}
      </button>

      {open && hasMultiple && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 w-[220px] bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-1.5 z-20 shadow-lg">
            {workspaces.map((w) => (
              <button
                key={w.id}
                onClick={() => { onChange(w); setOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-[6px] text-sm transition-colors ${w.id === current?.id ? 'bg-[#141414] text-[#ffffff]' : 'text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#141414]/50'
                  }`}
              >
                {w.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function GlobalHeader({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { workspaces, createWorkspace } = useWorkspace();
  
  const currentWorkspace = workspaces.find(w => w.id === workspaceId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspacePlan, setNewWorkspacePlan] = useState<PlanType>('pro');
  const [newWorkspaceIndustry, setNewWorkspaceIndustry] = useState('');
  const [newWorkspaceDomain, setNewWorkspaceDomain] = useState('');

  const handleAddWorkspace = () => {
    setNewWorkspaceName('');
    setNewWorkspacePlan('pro');
    setNewWorkspaceIndustry('');
    setNewWorkspaceDomain('');
    setIsCreateModalOpen(true);
  };

  const submitNewWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim() || !newWorkspaceIndustry.trim()) return;
    if (newWorkspacePlan === 'enterprise' && !newWorkspaceDomain.trim()) return;

    const newWs = createWorkspace({
      name: newWorkspaceName.trim(),
      plan: newWorkspacePlan,
      industry: newWorkspaceIndustry.trim(),
      domain: newWorkspaceDomain.trim() || undefined,
    });
    
    setIsCreateModalOpen(false);
    router.push(`/workspace/${newWs.id}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-[56px] border-b border-[#3d3a39] bg-[#101010] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 rounded-[6px] hover:bg-[#1A1A1A] transition-colors"
        >
          <svg className="w-5 h-5 text-[#a0a0a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <img src="/logo (2).png" alt="CatchAm" className="h-7 w-auto" />
        <span className="hidden sm:flex items-center px-2 py-0.5 ml-2 rounded-[9999px] border border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[10px] font-mono text-[#fbbf24] uppercase tracking-wider">
          Sandbox
        </span>
        <div className="mx-2 w-px h-4 bg-[#3d3a39] hidden sm:block"></div>
        <WorkspaceSwitcher 
          workspaces={workspaces} 
          current={currentWorkspace} 
          onChange={(w) => router.push(`/workspace/${w.id}`)} 
        />
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <UserAvatar onAddWorkspace={handleAddWorkspace} />
      </div>

      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Organization"
        description="Set up a new workspace for your team or personal projects."
      >
        <form onSubmit={submitNewWorkspace}>
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-[1.5px] text-[#a0a0a0] mb-2">Plan Type</label>
            <div className="flex bg-[#101010] rounded-[6px] p-1 border border-[#3d3a39]">
              <button
                type="button"
                onClick={() => setNewWorkspacePlan('pro')}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-[4px] transition-colors ${newWorkspacePlan === 'pro' ? 'bg-[#2a2a2a] text-[#ffffff] shadow' : 'text-[#a0a0a0] hover:text-[#ffffff]'}`}
              >
                Pro
              </button>
              <button
                type="button"
                onClick={() => setNewWorkspacePlan('enterprise')}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-[4px] transition-colors ${newWorkspacePlan === 'enterprise' ? 'bg-[#2a2a2a] text-[#ffffff] shadow' : 'text-[#a0a0a0] hover:text-[#ffffff]'}`}
              >
                Enterprise
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-[1.5px] text-[#a0a0a0] mb-2">Organization Name</label>
            <input
              type="text"
              autoFocus
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-4 py-3 text-[#ffffff] text-sm focus:border-[#00C170] outline-none transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-[1.5px] text-[#a0a0a0] mb-2">Industry Vector</label>
            <input
              type="text"
              value={newWorkspaceIndustry}
              onChange={(e) => setNewWorkspaceIndustry(e.target.value)}
              placeholder="e.g. Finance, Healthcare, Politics"
              className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-4 py-3 text-[#ffffff] text-sm focus:border-[#00C170] outline-none transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-mono uppercase tracking-[1.5px] text-[#a0a0a0] mb-2">
              {newWorkspacePlan === 'enterprise' ? 'Corporate Domain (Required)' : 'Primary Web Domain (Optional for Reports)'}
            </label>
            <input
              type="text"
              value={newWorkspaceDomain}
              onChange={(e) => setNewWorkspaceDomain(e.target.value)}
              placeholder="e.g. acme.com"
              className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-4 py-3 text-[#ffffff] text-sm focus:border-[#00C170] outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-[6px] text-sm font-semibold text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#262626] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newWorkspaceName.trim() || !newWorkspaceIndustry.trim() || (newWorkspacePlan === 'enterprise' && !newWorkspaceDomain.trim())}
              className="px-4 py-2 bg-[#00C170] text-[#0A0A0A] rounded-[6px] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Organization
            </button>
          </div>
        </form>
      </Modal>
    </header>
  );
}
