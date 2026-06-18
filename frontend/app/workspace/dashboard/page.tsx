"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GlobalHeader from '@/components/dashboard/GlobalHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import type { NavItem } from '@/components/dashboard/Sidebar';
import DashboardHeading from '@/components/dashboard/DashboardHeading';
import OverviewContent from '@/components/dashboard/OverviewContent';
import ForensicScannerContent from '@/components/dashboard/ForensicScannerContent';
import TourOverlay from '@/components/dashboard/TourOverlay';

const TOUR_KEY = 'catcham-tour-completed';
const TOUR_TARGETS = ['overview', 'scanner', 'monitoring', 'billing'];
const TOUR_TOTAL = TOUR_TARGETS.length;

function DashboardContent() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<NavItem>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) setTourStep(0);
  }, []);

  const finishTour = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    setTourStep(null);
  };

  const tourTarget = tourStep !== null ? TOUR_TARGETS[tourStep] : null;

  return (
    <div className="min-h-screen bg-[#101010] text-[#ffffff] flex flex-col">
      <GlobalHeader onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex flex-1">
        {/* Desktop sidebar + crease hamburger */}
        <div className="hidden md:block relative">
          <Sidebar
            active={active}
            onNavigate={setActive}
            collapsed={sidebarCollapsed}
            tourTarget={tourTarget}
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
        {mobileSidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-40 w-[240px] md:hidden bg-[#101010] border-r border-[#3d3a39]">
              <div className="flex items-center justify-between px-4 h-[56px] border-b border-[#3d3a39]">
                <img src="/logo (2).png" alt="CatchAm" className="h-7 w-auto" />
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 hover:bg-[#1A1A1A] rounded-[6px] transition-colors">
                  <svg className="w-5 h-5 text-[#a0a0a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Sidebar
                active={active}
                onNavigate={(id) => { setActive(id); setMobileSidebarOpen(false); }}
                collapsed={false}
              />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeading active={active} />

          <main className="flex-1 p-4 md:p-8">
            {active === 'overview' && <OverviewContent />}
            {active === 'scanner' && <ForensicScannerContent />}
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
                  setActive('billing');
                  finishTour();
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

export default function WorkspaceDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#101010] flex items-center justify-center"><span className="text-[#a0a0a0] text-sm">Loading dashboard...</span></div>}>
      <DashboardContent />
    </Suspense>
  );
}
