"use client";

import { usePathname } from 'next/navigation';

export type NavItem = 'overview' | 'scanner' | 'monitoring' | 'usage' | 'billing' | 'settings';

const headings: Record<NavItem, { title: string; description: string }> = {
  overview: { title: 'Overview', description: 'Security activity and workspace summary.' },
  scanner: { title: 'Forensic Scanner', description: 'Upload media, detect synthetic content, and review per-face verdicts.' },
  monitoring: { title: 'Monitoring', description: 'Continuous web crawler surveillance targets.' },
  usage: { title: 'Usage', description: 'Tier, billing limits, and team access across organizations.' },
  billing: { title: 'Billing', description: 'Payment methods, invoices, and subscription management.' },
  settings: { title: 'Settings', description: 'Workspace configuration and team access.' },
};

export default function DashboardHeading() {
  const pathname = usePathname() || '';
  const parts = pathname.split('/');
  const activeParam = parts.length > 3 ? parts[3] : 'overview';
  
  const h = headings[activeParam as NavItem] || headings.overview;
  
  return (
    <header className="px-4 md:px-8 py-5 bg-[#101010]">
      <h1 className="text-xl font-semibold tracking-tight text-[#ffffff]">{h.title}</h1>
      <p className="text-sm text-[#a0a0a0] mt-0.5">{h.description}</p>
    </header>
  );
}
