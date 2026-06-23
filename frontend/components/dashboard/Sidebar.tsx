"use client";

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export type NavItem = 'overview' | 'scanner' | 'monitoring' | 'usage' | 'billing' | 'settings';

const mainItems: { id: NavItem; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'scanner', label: 'Forensic Scanner', icon: 'scan' },
  { id: 'monitoring', label: 'Monitoring', icon: 'radar' },
];

const workspaceItems: { id: NavItem; label: string; icon: string }[] = [
  { id: 'usage', label: 'Usage', icon: 'chart' },
  { id: 'billing', label: 'Billing', icon: 'card' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
];

function NavIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'grid':
      return (
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      );
    case 'scan':
      return (
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      );
    case 'radar':
      return (
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'chart':
      return (
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    case 'card':
      return (
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      );
    case 'gear':
      return (
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({
  collapsed,
  onToggle,
  tourTarget,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  tourTarget?: string | null;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname() || '';
  const params = useParams();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const workspaceId = params.workspaceId as string;

  const parts = pathname.split('/');
  const activeParam = parts.length > 3 ? parts[3] : 'overview';

  const name = user?.user_metadata?.full_name ?? user?.email ?? 'User';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <aside
      className={`bg-[#1A1A1A] border-r border-[#3d3a39] flex flex-col transition-[width] duration-200 ease-in-out ${
        collapsed ? 'w-[64px]' : 'w-[256px]'
      } h-full relative`}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Section: Main */}
          <div>
            {!collapsed && (
              <p className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-[1.5px] text-[#5a5a5a] select-none">
                Main
              </p>
            )}
            <div className="space-y-0.5">
              {mainItems.map((item) => {
                const isActive = activeParam === item.id;
                const href = `/workspace/${workspaceId}${item.id === 'overview' ? '' : `/${item.id}`}`;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={onCloseMobile}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm transition-colors ${
                      collapsed ? 'justify-center px-0' : ''
                    } ${
                      isActive
                        ? 'bg-[#262626] text-[#ffffff] font-medium'
                        : 'text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#262626]/50'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#00C170] rounded-full" />
                    )}
                    <NavIcon icon={item.icon} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section: Organization */}
          <div>
            {!collapsed && (
              <p className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-[1.5px] text-[#5a5a5a] select-none">
                Organization
              </p>
            )}
            <div className="space-y-0.5">
              {workspaceItems.map((item) => {
                const isActive = activeParam === item.id;
                const href = `/workspace/${workspaceId}/${item.id}`;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={onCloseMobile}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm transition-colors ${
                      collapsed ? 'justify-center px-0' : ''
                    } ${
                      isActive
                        ? 'bg-[#262626] text-[#ffffff] font-medium'
                        : 'text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#262626]/50'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#00C170] rounded-full" />
                    )}
                    <NavIcon icon={item.icon} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-[#3d3a39] p-3">
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 w-full rounded-[6px] transition-colors ${
              collapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'
            } hover:bg-[#262626]/50`}
            title={collapsed ? name : undefined}
          >
            <div className="w-7 h-7 rounded-full bg-[#00C170]/20 border border-[#3d3a39] flex items-center justify-center text-[10px] font-semibold text-[#00C170] shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <>
                <span className="text-sm text-[#a0a0a0] truncate flex-1 text-left">{name}</span>
                <svg className="w-3 h-3 text-[#5a5a5a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-[#1A1A1A] border border-[#3d3a39] rounded-full hover:border-[#00C170] transition-colors z-10"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg
          className={`w-2.5 h-2.5 text-[#a0a0a0] transition-transform ${collapsed ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
    </aside>
  );
}
