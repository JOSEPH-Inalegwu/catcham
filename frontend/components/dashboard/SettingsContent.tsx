"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspace } from '@/app/context/WorkspaceContext';
import Modal from '@/components/Modal';

type NotificationPrefs = {
  realTime: boolean;
  dailyDigest: boolean;
  weeklyDigest: boolean;
};

const defaultNotifPrefs: NotificationPrefs = {
  realTime: true,
  dailyDigest: false,
  weeklyDigest: false,
};

const planFeatures: Record<string, { label: string; features: string[] }> = {
  sandbox: {
    label: 'Sandbox',
    features: ['2 workspace seats', '10 scans per month', 'Basic detection', 'Community support'],
  },
  pro: {
    label: 'Pro',
    features: ['10 workspace seats', '500 scans per month', 'Per-face spatial analysis', 'Email support', 'API access'],
  },
  enterprise: {
    label: 'Enterprise',
    features: ['Unlimited seats', 'Unlimited scans', 'Real-time web crawler alerts', 'Dedicated account manager', 'SSO integration', 'Audit logs'],
  },
};

const industryOptions = ['Finance', 'Media', 'Government', 'Healthcare', 'Technology', 'Legal', 'Education', 'Other'];

type SectionCardProps = {
  title: string;
  description?: string;
  danger?: boolean;
  children: React.ReactNode;
};

function SectionCard({ title, description, danger, children }: SectionCardProps) {
  return (
    <div className={`bg-[#1A1A1A] border rounded-[8px] ${danger ? 'border-[#ef4444]/30' : 'border-[#3d3a39]'}`}>
  <div className="px-6 py-4 border-b border-[#3d3a39]">
    <h3 className={`text-sm font-semibold ${danger ? 'text-[#ef4444]' : 'text-[#ffffff]'}`}>{title}</h3>
    {description && <p className="text-xs text-[#a0a0a0] mt-0.5">{description}</p>}
  </div>
      <div className="px-6 py-5">
        {children}
      </div>
    </div>
  );
}

type FieldRowProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

function FieldRow({ label, description, children }: FieldRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0 border-b border-[#3d3a39]/50 last:border-0">
      <div className="w-[180px] shrink-0 pt-1">
        <p className="text-sm text-[#ffffff]">{label}</p>
        {description && <p className="text-xs text-[#5a5a5a] mt-0.5">{description}</p>}
      </div>
      <div className="flex-1 max-w-[380px]">
        {children}
      </div>
    </div>
  );
}

export default function SettingsContent() {
  const params = useParams();
  const router = useRouter();
  const { workspaces, updateWorkspace, deleteWorkspace } = useWorkspace();
  const workspace = workspaces.find((w) => w.id === params.workspaceId);

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [domain, setDomain] = useState('');
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(defaultNotifPrefs);

  useEffect(() => {
    if (!workspace) return;
    setName(workspace.name);
    setIndustry(workspace.industry);
    setDomain(workspace.domain || '');
    const stored = localStorage.getItem(`catcham-notif-${workspace.id}`);
    if (stored) {
      try { setNotifPrefs(JSON.parse(stored)); } catch { }
    }
  }, [workspace]);

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#a0a0a0] text-sm">Workspace not found.</p>
      </div>
    );
  }

  const handleSave = () => {
    updateWorkspace(workspace.id, { name, industry, domain: domain || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (deleteConfirmText !== workspace.name) return;
    deleteWorkspace(workspace.id);
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
    const remaining = workspaces.filter(w => w.id !== workspace.id);
    router.push(remaining.length > 0 ? `/workspace/${remaining[0].id}` : '/auth/onboarding');
  };

  const toggleNotif = (key: keyof NotificationPrefs) => {
    const next = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(next);
    localStorage.setItem(`catcham-notif-${workspace.id}`, JSON.stringify(next));
  };

  const plan = planFeatures[workspace.plan] || planFeatures.sandbox;
  const isEnterprise = workspace.plan === 'enterprise';

  return (
    <div className="space-y-6 pb-12">

      <SectionCard title="General" description="Basic workspace information used across your CatchAm dashboard.">
        <FieldRow label="Workspace name" description="Used in reports and team invitations.">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#ffffff] placeholder-[#5a5a5a] outline-none focus:border-[#00C170] transition-colors"
          />
        </FieldRow>
        <FieldRow label="Industry" description="Helps tailor detection models to your sector.">
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#ffffff] outline-none focus:border-[#00C170] transition-colors appearance-none"
          >
            {industryOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </FieldRow>
        <FieldRow label="Domain" description="Your primary web domain for brand monitoring.">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#ffffff] placeholder-[#5a5a5a] outline-none focus:border-[#00C170] transition-colors"
          />
        </FieldRow>
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-[6px] text-sm font-semibold bg-[#00C170] text-[#0A0A0A] hover:opacity-90 transition-opacity"
          >
            Save changes
          </button>
          {saved && <span className="text-xs text-[#00C170] font-semibold">Changes saved</span>}
        </div>
      </SectionCard>

      <SectionCard title="Team" description="Manage who has access to this workspace.">
        <div className="flex items-center justify-between py-3 border-b border-[#3d3a39]/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00C170]/20 flex items-center justify-center text-sm font-bold text-[#00C170]">JD</div>
            <div>
              <p className="text-sm text-[#ffffff] font-medium">Joseph Jonah</p>
              <p className="text-xs text-[#5a5a5a]">Owner</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#00C170]/20 text-[#00C170]">Admin</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[#5a5a5a]">
            {workspace.plan === 'sandbox'
              ? 'Sandbox workspaces are limited to 2 seats.'
              : workspace.plan === 'pro'
                ? 'Pro workspaces support up to 10 seats.'
                : 'Enterprise workspaces have unlimited seats.'}
          </p>
          <button className="px-4 py-2 rounded-[6px] text-sm font-semibold border border-[#3d3a39] text-[#ffffff] hover:bg-[#2a2a2a] transition-colors">
            Invite member
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Notifications" description="How you receive alerts when flagged media is detected.">
        <div className="space-y-1">
          <div className="flex items-center justify-between py-3 border-b border-[#3d3a39]/50">
            <div>
              <p className="text-sm text-[#ffffff]">Real-time alerts</p>
              <p className="text-xs text-[#5a5a5a]">Push notifications the moment a threat is flagged</p>
            </div>
            <div
              onClick={() => toggleNotif('realTime')}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${notifPrefs.realTime ? 'bg-[#00C170]' : 'bg-[#3d3a39]'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#ffffff] shadow transition-transform ${notifPrefs.realTime ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#3d3a39]/50">
            <div>
              <p className="text-sm text-[#ffffff]">Daily digest</p>
              <p className="text-xs text-[#5a5a5a]">A single email each day with all alerts</p>
            </div>
            <div
              onClick={() => toggleNotif('dailyDigest')}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${notifPrefs.dailyDigest ? 'bg-[#00C170]' : 'bg-[#3d3a39]'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#ffffff] shadow transition-transform ${notifPrefs.dailyDigest ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-[#ffffff]">Weekly digest</p>
              <p className="text-xs text-[#5a5a5a]">Weekly summary every Monday morning</p>
            </div>
            <div
              onClick={() => toggleNotif('weeklyDigest')}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${notifPrefs.weeklyDigest ? 'bg-[#00C170]' : 'bg-[#3d3a39]'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#ffffff] shadow transition-transform ${notifPrefs.weeklyDigest ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Security" description="Session and API settings for your workspace.">
        <FieldRow label="Session timeout" description="Auto-logout after inactivity.">
          <select
            className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#ffffff] outline-none focus:border-[#00C170] transition-colors appearance-none"
            defaultValue="30"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="240">4 hours</option>
            <option value="1440">24 hours</option>
          </select>
        </FieldRow>
        <FieldRow label="API token" description="Authenticate requests from external tools.">
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm font-mono text-[#5a5a5a] select-all truncate">
              sk-{workspace.id}-{workspace.createdAt.toString(36)}-xxxx
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(`sk-${workspace.id}-${workspace.createdAt.toString(36)}-xxxx`)}
              className="px-3 py-2 rounded-[6px] text-xs font-semibold border border-[#3d3a39] text-[#a0a0a0] hover:text-[#ffffff] hover:border-[#5a5a5a] transition-colors shrink-0"
            >
              Copy
            </button>
          </div>
        </FieldRow>
      </SectionCard>

      <SectionCard title="Plan" description="Your current subscription tier and included features.">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00C170]/20 text-[#00C170]">
            {plan.label}
          </span>
          {!isEnterprise && (
            <a
              href={`/workspace/${workspace.id}/billing`}
              className="text-sm font-semibold text-[#00C170] hover:underline"
            >
              Upgrade plan
            </a>
          )}
        </div>
        <ul className="space-y-2">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-[#a0a0a0]">
              <svg className="w-3.5 h-3.5 text-[#00C170] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        {!isEnterprise && (
          <a
            href={`/workspace/${workspace.id}/billing`}
            className="inline-block mt-5 px-5 py-2 rounded-[6px] text-sm font-semibold bg-[#00C170] text-[#0A0A0A] hover:opacity-90 transition-opacity"
          >
            Manage subscription
          </a>
        )}
      </SectionCard>

      <SectionCard title="Danger Zone" description="Irreversible actions that affect your entire workspace." danger>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-5 py-2 rounded-[6px] text-sm font-semibold border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
        >
          Delete workspace
        </button>

        <Modal
          open={showDeleteConfirm}
          onClose={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
          title="Delete workspace"
          description="Irreversible actions that affect your entire workspace."
          danger
          actions={
            <>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                className="px-4 py-2 rounded-[6px] text-sm font-semibold text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#262626] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmText !== workspace.name}
                className={`px-4 py-2 rounded-[6px] text-sm font-semibold transition-colors ${
                  deleteConfirmText === workspace.name
                    ? 'bg-[#ef4444] text-[#ffffff] hover:opacity-90'
                    : 'bg-[#3d3a39] text-[#5a5a5a] cursor-not-allowed'
                }`}
              >
                Delete this workspace
              </button>
            </>
          }
        >
          <p className="text-sm text-[#ffffff] mb-3">
            Type <span className="font-mono font-bold text-[#ef4444]">{workspace.name}</span> to confirm.
          </p>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder={workspace.name}
            className="w-full bg-[#101010] border border-[#ef4444]/50 rounded-[6px] px-3 py-2 text-sm text-[#ffffff] placeholder-[#5a5a5a] outline-none focus:border-[#ef4444] transition-colors"
          />
        </Modal>
      </SectionCard>
    </div>
  );
}
