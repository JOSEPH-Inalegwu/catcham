"use client";

import { useState } from 'react';
import Modal from '@/components/Modal';

type BillingTab = 'credits' | 'recharge' | 'payment' | 'history';

const tabs: { id: BillingTab; label: string }[] = [
  { id: 'credits', label: 'Add Credits' },
  { id: 'recharge', label: 'Auto-Recharge' },
  { id: 'payment', label: 'Payment Method' },
  { id: 'history', label: 'History' },
];

const savedCards = [
  { id: '1', brand: 'Visa', last4: '4242', exp: '08/27', default: true },
  { id: '2', brand: 'Mastercard', last4: '8888', exp: '11/26', default: false },
];

const invoices = [
  { date: '16/06/2026, 13:41:12', amount: '$1.00', method: '$1 Credit: Sign-up Bonus', status: '-', chargeType: '-' },
  { date: '15/06/2026, 09:22:34', amount: '₦8,000', method: 'Visa •••• 4242', status: 'Completed', chargeType: 'Add Credits' },
  { date: '01/06/2026, 14:05:00', amount: '₦75,000', method: 'Mastercard •••• 8888', status: 'Completed', chargeType: 'Subscription' },
  { date: '28/05/2026, 09:15:00', amount: '₦8,000', method: 'Visa •••• 4242', status: 'Completed', chargeType: 'Add Credits' },
  { date: '15/05/2026, 11:22:10', amount: '₦8,000', method: 'Visa •••• 4242', status: 'Completed', chargeType: 'Add Credits' },
  { date: '01/05/2026, 14:05:00', amount: '₦75,000', method: 'Mastercard •••• 8888', status: 'Completed', chargeType: 'Subscription' },
  { date: '12/04/2026, 16:45:00', amount: '₦8,000', method: 'Visa •••• 4242', status: 'Completed', chargeType: 'Add Credits' },
  { date: '01/04/2026, 14:05:00', amount: '₦75,000', method: 'Mastercard •••• 8888', status: 'Completed', chargeType: 'Subscription' },
];

function CreditBalanceCard() {
  return (
    <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-6">
      <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-3">Credit Balance</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-semibold text-[#ffffff] tracking-tight">0</p>
        <p className="text-sm text-[#5a5a5a]">reports</p>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#3d3a39]">
        <div className="h-full rounded-full bg-[#00C170] transition-all" style={{ width: '0%' }} />
      </div>
      <p className="text-xs text-[#5a5a5a] mt-2">0 / 0 reports used this period</p>
    </div>
  );
}

function AddCreditsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#ffffff]">10 Forensic Reports</p>
          <p className="text-xs text-[#a0a0a0] mt-0.5">Per-report deepfake analysis</p>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#3d3a39]">
          <span className="text-xl font-semibold text-[#ffffff]">₦8,000</span>
          <button className="px-4 py-2 text-sm font-semibold text-[#0A0A0A] bg-[#00C170] rounded-[6px] hover:opacity-90 transition-opacity">
            Buy Credits
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#ffffff]">Proactive Surveillance</p>
          <p className="text-xs text-[#a0a0a0] mt-0.5">Full web crawler monitoring + unlimited reports</p>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#3d3a39]">
          <span className="text-xl font-semibold text-[#ffffff]">₦75,000<span className="text-xs text-[#a0a0a0] font-normal">/mo</span></span>
          <button className="px-4 py-2 text-sm font-semibold text-[#0A0A0A] bg-[#00C170] rounded-[6px] hover:opacity-90 transition-opacity">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}

function AutoRechargeTab() {
  const [enabled, setEnabled] = useState(false);
  const [threshold, setThreshold] = useState(5);
  const [amount, setAmount] = useState(10);

  return (
    <div className="space-y-4">
      <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-[#ffffff]">Auto-Recharge</p>
            <p className="text-xs text-[#a0a0a0] mt-0.5">Automatically top up when credits run low</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-[#00C170]' : 'bg-[#3d3a39]'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#ffffff] transition-transform ${enabled ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        {enabled && (
          <div className="space-y-3 pt-4 border-t border-[#3d3a39]">
            <div>
              <label className="text-xs text-[#a0a0a0] mb-1.5 block">Recharge when credits fall below</label>
              <div className="flex items-center gap-2">
                {[3, 5, 10, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setThreshold(n)}
                    className={`px-3 py-1.5 text-xs rounded-[6px] border transition-colors ${threshold === n ? 'border-[#00C170] text-[#ffffff] bg-[#00C170]/10' : 'border-[#3d3a39] text-[#a0a0a0] hover:border-[#5a5a5a]'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-[#a0a0a0] mb-1.5 block">Recharge amount</label>
              <div className="flex items-center gap-2">
                {[10, 25, 50, 100].map((n) => (
                  <button
                    key={n}
                    onClick={() => setAmount(n)}
                    className={`px-3 py-1.5 text-xs rounded-[6px] border transition-colors ${amount === n ? 'border-[#00C170] text-[#ffffff] bg-[#00C170]/10' : 'border-[#3d3a39] text-[#a0a0a0] hover:border-[#5a5a5a]'}`}
                  >
                    {n} credits
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentMethodTab() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-[#ffffff]">Saved cards</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-[#0A0A0A] bg-[#00C170] rounded-[6px] hover:opacity-90 transition-opacity"
          >
            + Add card
          </button>
        </div>

        {savedCards.length === 0 ? (
          <p className="text-xs text-[#5a5a5a] py-2">No cards saved yet.</p>
        ) : (
          <div className="space-y-2">
            {savedCards.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-3 rounded-[6px] border border-[#3d3a39] bg-[#101010]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 rounded-[4px] bg-gradient-to-br from-[#00C170]/20 to-[#1A7A4A]/20 border border-[#3d3a39] flex items-center justify-center text-[10px] font-mono text-[#a0a0a0]">
                    {card.brand === 'Visa' ? 'VISA' : 'MC'}
                  </div>
                  <div>
                    <p className="text-sm text-[#ffffff]">
                      {card.brand} •••• {card.last4}
                      {card.default && <span className="text-[10px] text-[#a0a0a0] ml-2">Default</span>}
                    </p>
                    <p className="text-xs text-[#a0a0a0]">Expires {card.exp}</p>
                  </div>
                </div>
                <button className="text-xs text-[#a0a0a0] hover:text-[#ffffff] transition-colors">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add payment card">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#a0a0a0] mb-1.5 block">Card number</label>
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              className="w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border border-[#3d3a39] rounded-[6px] placeholder:text-[#5a5a5a] focus:outline-none focus:border-[#00C170]/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#a0a0a0] mb-1.5 block">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border border-[#3d3a39] rounded-[6px] placeholder:text-[#5a5a5a] focus:outline-none focus:border-[#00C170]/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#a0a0a0] mb-1.5 block">CVC</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border border-[#3d3a39] rounded-[6px] placeholder:text-[#5a5a5a] focus:outline-none focus:border-[#00C170]/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#a0a0a0] mb-1.5 block">Cardholder name</label>
            <input
              type="text"
              placeholder="Joseph Jonah"
              className="w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border border-[#3d3a39] rounded-[6px] placeholder:text-[#5a5a5a] focus:outline-none focus:border-[#00C170]/50 transition-colors"
            />
          </div>
        </div>
        <div className="mt-5">
          <button className="w-full py-2.5 text-sm font-semibold text-[#0A0A0A] bg-[#00C170] rounded-[6px] hover:opacity-90 transition-opacity">
            Add card
          </button>
        </div>
      </Modal>
    </div>
  );
}

function HistoryTab() {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(invoices.length / pageSize) || 1;
  const paged = invoices.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 text-center">
          <p className="text-xs text-[#5a5a5a]">No transaction history yet.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#3d3a39]">
                  {['Date', 'Amount', 'Payment Method', 'Status', 'Charge Type'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] font-medium px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d3a39]">
                {paged.map((inv, i) => (
                  <tr key={i} className="hover:bg-[#262626]/50 transition-colors">
                    <td className="px-5 py-4 text-[#ffffff] whitespace-nowrap">{inv.date}</td>
                    <td className="px-5 py-4 text-[#ffffff] whitespace-nowrap font-medium">{inv.amount}</td>
                    <td className="px-5 py-4 text-[#a0a0a0] whitespace-nowrap">{inv.method}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider ${
                        inv.status === 'Completed'
                          ? 'bg-[#00C170]/20 text-[#00C170]'
                          : 'text-[#a0a0a0] bg-[#3d3a39]/50'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#a0a0a0] whitespace-nowrap">{inv.chargeType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {paged.map((inv, i) => (
              <div key={i} className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-[#ffffff]">{inv.chargeType === '-' ? 'Transaction' : inv.chargeType}</p>
                    <p className="text-xs text-[#a0a0a0] mt-1">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-[#ffffff]">{inv.amount}</p>
                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                      inv.status === 'Completed'
                        ? 'bg-[#00C170]/20 text-[#00C170]'
                        : 'text-[#a0a0a0] bg-[#3d3a39]/50'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#3d3a39]">
                  <p className="text-xs text-[#a0a0a0]">Method: <span className="text-[#ffffff]">{inv.method}</span></p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px]">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 text-xs text-[#a0a0a0] hover:text-[#ffffff] disabled:opacity-30 transition-colors"
              >
                Prev
              </button>
              <span className="text-xs text-[#5a5a5a]">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 text-xs text-[#a0a0a0] hover:text-[#ffffff] disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BillingContent() {
  const [tab, setTab] = useState<BillingTab>('credits');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 border-b border-[#3d3a39]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-[1px] ${
              tab === t.id
                ? 'text-[#ffffff] border-[#00C170] font-medium'
                : 'text-[#a0a0a0] border-transparent hover:text-[#ffffff]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {tab === 'credits' && <AddCreditsTab />}
          {tab === 'recharge' && <AutoRechargeTab />}
          {tab === 'payment' && <PaymentMethodTab />}
          {tab === 'history' && <HistoryTab />}
        </div>

        <div className="w-full lg:w-[280px] flex-shrink-0">
          <CreditBalanceCard />
        </div>
      </div>
    </div>
  );
}
