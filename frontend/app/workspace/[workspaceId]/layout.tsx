"use client";

import { useState, useEffect, ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspace } from '@/app/context/WorkspaceContext';
import GlobalHeader from '@/components/dashboard/GlobalHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import TourOverlay from '@/components/dashboard/TourOverlay';
import DashboardHeading from '@/components/dashboard/DashboardHeading';

const TOUR_KEY = 'catcham-tour-completed';
const TOUR_TARGETS = ['overview', 'scanner', 'monitoring', 'billing'];
const TOUR_TOTAL = TOUR_TARGETS.length;

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const { workspaces, isHydrated } = useWorkspace();
  
  const workspaceId = params.workspaceId as string;
  const [isValidating, setIsValidating] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    // Workspace Validation Guard
    const isValid = workspaces.some(w => w.id === workspaceId);
    if (!isValid && workspaces.length > 0) {
      router.push(`/workspace/${workspaces[0].id}`);
    } else if (!isValid) {
      router.push('/auth/onboarding');
    } else {
      setIsValidating(false);
    }
  }, [isHydrated, workspaceId, workspaces, router]);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) setTourStep(0);
  }, []);

  if (!isHydrated || isValidating) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <span className="text-[#a0a0a0] text-sm">Loading workspace...</span>
      </div>
    );
  }

  const finishTour = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    setTourStep(null);
  };

  const tourTarget = tourStep !== null ? TOUR_TARGETS[tourStep] : null;

  return (
    <div className="h-screen bg-[#101010] text-[#ffffff] flex flex-col">
      <GlobalHeader onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden pt-[65px]">
        {/* Desktop sidebar + crease hamburger */}
        <div className="hidden md:block relative">
          <Sidebar
            collapsed={sidebarCollapsed}
            tourTarget={tourTarget}
            onCloseMobile={() => {}}
          />

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-0 -right-3 w-8 h-8 flex items-center justify-center bg-[#101010] border border-[#3d3a39] rounded-full hover:border-[#00C170] transition-colors z-10"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className={`w-3 h-3 text-[#a0a0a0] transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ease-in-out ${mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setMobileSidebarOpen(false)} 
        />
        
        <div 
          className={`fixed inset-y-[56px] left-0 z-40 w-[240px] md:hidden bg-[#101010] border-r border-[#3d3a39] transform transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-4 h-[56px] border-b border-[#3d3a39]">
            <img src="/logo (2).png" alt="CatchAm" className="h-7 w-auto" />
            <button onClick={() => setMobileSidebarOpen(false)} className="p-1 hover:bg-[#1A1A1A] rounded-[6px] transition-colors">
              <svg className="w-5 h-5 text-[#a0a0a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Sidebar
            collapsed={false}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Sandbox Banner */}
          <div className="bg-[#fbbf24]/10 border-b border-[#fbbf24]/20 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            <p className="text-xs text-[#fbbf24] flex items-center gap-2 text-center sm:text-left">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              You are viewing mock data in Sandbox Mode. Real scanning is disabled.
            </p>
            <button 
              onClick={() => router.push(`/workspace/${workspaceId}/billing`)} 
              className="px-3 py-1.5 bg-[#fbbf24] text-[#101010] text-[10px] font-bold uppercase tracking-wider rounded-[6px] hover:bg-[#f59e0b] transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              Upgrade to Pro
            </button>
          </div>

          <DashboardHeading />

          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>

      {tourStep !== null && (
        <TourOverlay
          step={tourStep}
          totalSteps={TOUR_TOTAL}
          onNext={() => setTourStep(tourStep + 1)}
          onBack={() => setTourStep(tourStep - 1)}
          onSkip={finishTour}
          onAction={
            tourStep === TOUR_TOTAL - 1
              ? () => {
                  router.push(`/workspace/${workspaceId}/billing`);
                  finishTour();
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
