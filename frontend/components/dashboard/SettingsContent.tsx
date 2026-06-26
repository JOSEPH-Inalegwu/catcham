"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspace } from '@/app/context/WorkspaceContext';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import Modal from '@/components/Modal';
import AvatarCropModal from '@/components/AvatarCropModal';
import { Skeleton } from '@/components/Skeleton';

type Member = {
  id: string;
  userId: string;
  role: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  joinedAt: string;
};

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
      <div className="px-6 py-5">{children}</div>
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
      <div className="flex-1 max-w-[380px]">{children}</div>
    </div>
  );
}

function MemberRow({ member, isOwner }: { member: Member; isOwner: boolean }) {
  const initials = member.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#3d3a39]/50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#00C170]/20 flex items-center justify-center text-sm font-bold text-[#00C170] shrink-0">
          {initials || '?'}
        </div>
        <div>
          <p className="text-sm text-[#ffffff] font-medium">{member.displayName}</p>
          <p className="text-xs text-[#5a5a5a]">{member.email || 'No email'}</p>
        </div>
      </div>
      <span
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
          isOwner
            ? 'bg-[#00C170]/20 text-[#00C170]'
            : member.role === 'admin'
              ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
              : 'bg-[#3d3a39]/50 text-[#a0a0a0]'
        }`}
      >
        {isOwner ? 'Owner' : member.role === 'admin' ? 'Admin' : 'Member'}
      </span>
    </div>
  );
}

export default function SettingsContent() {
  const params = useParams();
  const router = useRouter();
  const { workspaces, updateWorkspace, deleteWorkspace } = useWorkspace();
  const workspace = workspaces.find((w) => w.id === params.workspaceId);

  const { user, profile, refreshProfile, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState(0);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [domain, setDomain] = useState('');
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(defaultNotifPrefs);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDisplayName, setInviteDisplayName] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'admin'>('member');
  const [inviteError, setInviteError] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!workspace) return;
    setName(workspace.name);
    setIndustry(workspace.industry);
    setDomain(workspace.domain || '');
  }, [workspace]);

  useEffect(() => {
    if (profile) {
      setProfileName(profile.displayName);
      setProfileAvatar(profile.avatarUrl ?? user?.user_metadata?.avatar_url ?? null);
    } else if (user) {
      setProfileName(user.user_metadata?.full_name ?? user.email ?? '');
      setProfileAvatar(user.user_metadata?.avatar_url ?? null);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    if (!params.workspaceId) return;
    setMembersLoading(true);
    try {
      const res = await fetch(`/api/workspace/${params.workspaceId}/members`);
      const json = await res.json();
      if (json.members) setMembers(json.members);
    } catch {
      // fallback empty
    } finally {
      setMembersLoading(false);
    }
  }, [params.workspaceId]);

  const fetchPreferences = useCallback(async () => {
    if (!params.workspaceId) return;
    try {
      const res = await fetch(`/api/workspace/${params.workspaceId}/preferences`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.notifications) setNotifPrefs(json.notifications);
      if (json.sessionTimeout) setSessionTimeout(json.sessionTimeout);
      setPrefsLoaded(true);
    } catch {
      // fallback to defaults
    }
  }, [params.workspaceId]);

  useEffect(() => {
    fetchMembers();
    fetchPreferences();
  }, [fetchMembers, fetchPreferences]);

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#a0a0a0] text-sm">Workspace not found.</p>
      </div>
    );
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setUploadError('Only JPEG, PNG, WebP, and GIF files are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleCropSave = async (blob: Blob) => {
    setCropModalOpen(false);
    setCropImageSrc(null);
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', blob, 'avatar.webp');
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData });
      let errorMsg = 'Upload failed';
      try {
        const json = await res.json();
        if (!res.ok) {
          errorMsg = json.details || json.error || errorMsg;
        } else {
          const busted = `${json.avatarUrl}?t=${Date.now()}`;
          setProfileAvatar(busted);
          setAvatarKey((k) => k + 1);
          updateProfile({ avatarUrl: json.avatarUrl });
          refreshProfile();
          addToast('Profile photo updated', 'success');
          return;
        }
      } catch {
        errorMsg = res.statusText || errorMsg;
      }
      addToast(errorMsg, 'error');
    } catch {
      addToast('Network error — check your connection and try again.', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: profileName.trim() }),
      });
      if (res.ok) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
        refreshProfile();
      }
    } catch {
      // silent
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSave = async () => {
    await updateWorkspace(workspace.id, { name, industry, domain: domain || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== workspace.name) return;
    await deleteWorkspace(workspace.id);
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
    const remaining = workspaces.filter((w) => w.id !== workspace.id);
    router.push(remaining.length > 0 ? `/workspace/${remaining[0].id}` : '/auth/onboarding');
  };

  const toggleNotif = async (key: keyof NotificationPrefs) => {
    const next = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(next);
    await fetch(`/api/workspace/${workspace.id}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
  };

  const handleSessionTimeoutChange = async (value: string) => {
    const minutes = parseInt(value, 10);
    setSessionTimeout(minutes);
    await fetch(`/api/workspace/${workspace.id}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionTimeout: minutes }),
    });
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setInviteError('Email is required');
      return;
    }
    setInviteError('');
    setInviting(true);
    try {
      const res = await fetch(`/api/workspace/${workspace.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          displayName: inviteDisplayName.trim() || undefined,
          role: inviteRole,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setInviteError(json.error || 'Failed to add member');
        return;
      }
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteDisplayName('');
      setInviteRole('member');
      fetchMembers();
    } catch {
      setInviteError('Network error');
    } finally {
      setInviting(false);
    }
  };

  const owner = members.find((m) => m.role === 'owner');
  const plan = planFeatures[workspace.plan] || planFeatures.sandbox;
  const isEnterprise = workspace.plan === 'enterprise';

  return (
    <div className="space-y-6 pb-12">
      <SectionCard title="Profile" description="Your personal account information.">
        <FieldRow label="Avatar" description="JPEG, PNG, WebP, or GIF. Max 2MB.">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#3d3a39] bg-[#101010] shrink-0">
              {profileAvatar ? (
                <img key={avatarKey} src={profileAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-[#5a5a5a]">
                  {user?.email?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#00C170] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="px-4 py-2 rounded-[6px] text-sm font-semibold border border-[#3d3a39] text-[#ffffff] hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
              >
                {uploadingAvatar ? 'Uploading...' : 'Upload photo'}
              </button>
              {uploadError && (
                <p className="text-xs text-[#ef4444] mt-3 animate-shake">{uploadError}</p>
              )}
            </div>
          </div>
        </FieldRow>
        <AvatarCropModal
          open={cropModalOpen}
          imageSrc={cropImageSrc}
          onSave={handleCropSave}
          onClose={() => { setCropModalOpen(false); setCropImageSrc(null); }}
        />
        <FieldRow label="Display name" description="How your name appears across CatchAm.">
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#ffffff] placeholder-[#5a5a5a] outline-none focus:border-[#00C170] transition-colors"
          />
        </FieldRow>
        <FieldRow label="Email" description="Your primary email address.">
          <input
            type="email"
            value={profile?.email ?? user?.email ?? ''}
            disabled
            className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#5a5a5a] outline-none cursor-not-allowed"
          />
        </FieldRow>
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={handleProfileSave}
            disabled={profileSaving || !profileName.trim()}
            className="px-5 py-2 rounded-[6px] text-sm font-semibold bg-[#00C170] text-[#0A0A0A] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {profileSaving ? 'Saving...' : 'Save changes'}
          </button>
          {profileSaved && <span className="text-xs text-[#00C170] font-semibold">Profile updated</span>}
        </div>
      </SectionCard>

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
        {membersLoading ? (
          <div className="divide-y divide-[#3d3a39]/50">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3 last:pb-0">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="text-sm text-[#5a5a5a] py-3">No members found.</p>
        ) : (
          <div>
            {members.map((m) => (
              <MemberRow key={m.id} member={m} isOwner={m.role === 'owner'} />
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[#5a5a5a]">
            {workspace.plan === 'sandbox'
              ? 'Sandbox workspaces are limited to 2 seats.'
              : workspace.plan === 'pro'
                ? 'Pro workspaces support up to 10 seats.'
                : 'Enterprise workspaces have unlimited seats.'}
          </p>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 rounded-[6px] text-sm font-semibold border border-[#3d3a39] text-[#ffffff] hover:bg-[#2a2a2a] transition-colors"
          >
            Invite member
          </button>
        </div>
      </SectionCard>

      <Modal
        open={showInviteModal}
        onClose={() => { setShowInviteModal(false); setInviteError(''); }}
        title="Invite member"
        description="Add someone to this workspace by their email."
        actions={
          <>
            <button
              onClick={() => { setShowInviteModal(false); setInviteError(''); }}
              className="px-4 py-2 rounded-[6px] text-sm font-semibold text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#262626] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={inviting}
              className="px-4 py-2 rounded-[6px] text-sm font-semibold bg-[#00C170] text-[#0A0A0A] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {inviting ? 'Adding...' : 'Add member'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#ffffff] placeholder-[#5a5a5a] outline-none focus:border-[#00C170] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Display name (optional)</label>
            <input
              type="text"
              value={inviteDisplayName}
              onChange={(e) => setInviteDisplayName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#ffffff] placeholder-[#5a5a5a] outline-none focus:border-[#00C170] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as 'member' | 'admin')}
              className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#ffffff] outline-none focus:border-[#00C170] transition-colors appearance-none"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {inviteError && <p className="text-xs text-[#ef4444]">{inviteError}</p>}
        </div>
      </Modal>

      <SectionCard title="Notifications" description="How you receive alerts when flagged media is detected.">
        <div className="space-y-1">
          {(['realTime', 'dailyDigest', 'weeklyDigest'] as const).map((key) => {
            const labels: Record<string, { title: string; desc: string }> = {
              realTime: { title: 'Real-time alerts', desc: 'Push notifications the moment a threat is flagged' },
              dailyDigest: { title: 'Daily digest', desc: 'A single email each day with all alerts' },
              weeklyDigest: { title: 'Weekly digest', desc: 'Weekly summary every Monday morning' },
            };
            const l = labels[key];
            return (
              <div key={key} className="flex items-center justify-between py-3 border-b border-[#3d3a39]/50 last:border-0">
                <div>
                  <p className="text-sm text-[#ffffff]">{l.title}</p>
                  <p className="text-xs text-[#5a5a5a]">{l.desc}</p>
                </div>
                <div
                  onClick={() => toggleNotif(key)}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${notifPrefs[key] ? 'bg-[#00C170]' : 'bg-[#3d3a39]'}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#ffffff] shadow transition-transform ${notifPrefs[key] ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Security" description="Session and API settings for your workspace.">
        <FieldRow label="Session timeout" description="Auto-logout after inactivity.">
          <select
            className="w-full bg-[#101010] border border-[#3d3a39] rounded-[6px] px-3 py-2 text-sm text-[#ffffff] outline-none focus:border-[#00C170] transition-colors appearance-none"
            value={String(sessionTimeout)}
            onChange={(e) => handleSessionTimeoutChange(e.target.value)}
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
          description="This action cannot be undone. All scans, alerts, and data will be permanently removed."
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
