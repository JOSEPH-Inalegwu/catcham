"use client";

import type { NavItem } from './Sidebar';

const headings: Record<NavItem, { title: string; description: string }> = {
  overview: { title: 'Overview', description: 'Security activity and workspace summary.' },
  scanner: { title: 'Forensic Scanner', description: 'Fund credits, upload files, and download forensic reports.' },
  monitoring: { title: 'Monitoring', description: 'Continuous web crawler surveillance targets.' },
  usage: { title: 'Usage', description: 'Tier, billing limits, and team access across organizations.' },
  billing: { title: 'Billing', description: 'Payment methods, invoices, and subscription management.' },
  settings: { title: 'Settings', description: 'Workspace configuration and team access.' },
};

export default function DashboardHeading({ active }: { active: NavItem }) {
  const h = headings[active];
  return (
    <header className="px-4 md:px-8 py-5 bg-[#101010]">
      <h1 className="text-xl font-semibold tracking-tight text-[#ffffff]">{h.title}</h1>
      <p className="text-sm text-[#a0a0a0] mt-0.5">{h.description}</p>
    </header>
  );
}
