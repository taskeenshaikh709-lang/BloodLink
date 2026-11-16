import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Hospital,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  FileCheck2,
  Users,
  Activity,
  ChevronRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    institutions,
    auditLogs,
    requests,
    updateInstitutionStatus,
    staleThresholdHours,
    setStaleThresholdHours,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('verification'); // 'verification' | 'audits' | 'settings'
  const [thresholdInput, setThresholdInput] = useState(staleThresholdHours);

  const pendingInstitutions = institutions.filter(i => i.verification_status === 'pending');
  const verifiedInstitutions = institutions.filter(i => i.verification_status === 'verified');

  const handleThresholdSave = (e) => {
    e.preventDefault();
    setStaleThresholdHours(Number(thresholdInput));
    showToast(`Stale stock threshold updated to ${thresholdInput} hours.`, 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Admin Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">Platform Governance & Regulatory Console</h1>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Admin Privileges
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory Document Audit • Institution Onboarding • Network Stale Threshold Management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>Stale Freshness Window: <strong>{staleThresholdHours} Hours</strong></span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Pending Approvals</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingInstitutions.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Awaiting Form 28C audit</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Active Medical Partners</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{verifiedInstitutions.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Verified blood centres & hospitals</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Lifetime Requisitions</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{requests.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Network emergency dispatches</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Immutable Audit Trail</span>
            <div className="text-2xl font-black text-blue-600 mt-1">{auditLogs.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Security & regulatory events</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-3 transition flex items-center space-x-2 ${
              activeTab === 'verification'
                ? 'border-b-2 border-purple-600 text-purple-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Institutional Verification Queue</span>
            {pendingInstitutions.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {pendingInstitutions.length} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audits')}
            className={`pb-3 transition flex items-center space-x-2 ${
              activeTab === 'audits'
                ? 'border-b-2 border-purple-600 text-purple-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Platform Security Audit Log</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              {auditLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 transition flex items-center space-x-2 ${
              activeTab === 'settings'
                ? 'border-b-2 border-purple-600 text-purple-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Network Freshness Settings</span>
          </button>
        </div>

        {/* TAB 1: INSTITUTIONAL VERIFICATION QUEUE */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            
            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pending Review Queue (Form 28C / Clinical Licenses)</h3>
                  <p className="text-[11px] text-slate-500">
                    Administrators verify regulatory licenses with Maharashtra State FDA / SBTC before granting dispatch access.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">RESTRICTED WORKFLOW</span>
              </div>

              {pendingInstitutions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  ✓ All onboarding applications have been processed. No institutions in pending review.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingInstitutions.map((inst) => (
                    <div key={inst.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{inst.name}</span>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Pending Audit
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-mono">
                            {inst.institution_type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          License Ref: <strong>{inst.license_number}</strong> • Region: {inst.suburb}, {inst.district}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Address: {inst.address} • Contact: {inst.contact_phone}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateInstitutionStatus(inst.id, 'verified')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Grant Network Access</span>
                        </button>
                        <button
                          onClick={() => updateInstitutionStatus(inst.id, 'rejected')}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-semibold transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Institutions List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Active Verified Partners ({verifiedInstitutions.length})</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {verifiedInstitutions.map((inst) => (
                  <div key={inst.id} className="p-4 hover:bg-slate-50/60 transition flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{inst.name}</span>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Verified
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {inst.license_number} • {inst.suburb}, {inst.district}
                      </p>
                    </div>

                    <button
                      onClick={() => updateInstitutionStatus(inst.id, 'suspended')}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline"
                    >
                      Suspend Access
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: AUDIT LOGS */}
        {activeTab === 'audits' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Platform Security & Audit Trails</h3>
                <p className="text-[11px] text-slate-500">Every authorization, response, and clinical state transition is timestamped</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">Actor & Role</th>
                    <th className="px-6 py-3">Resource Type</th>
                    <th className="px-6 py-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 font-bold text-slate-800">
                        {log.action}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {log.actor_email} <span className="text-[10px] text-slate-400 uppercase">({log.actor_role})</span>
                      </td>
                      <td className="px-6 py-3 text-purple-700 font-semibold">
                        {log.resource_type}
                      </td>
                      <td className="px-6 py-3 text-slate-600 font-sans text-xs">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: NETWORK FRESHNESS SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-xl">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-base font-bold text-slate-900">Configure Stale-Inventory Threshold</h3>
              <p className="text-xs text-slate-500 mt-1">
                Stock entries exceeding this duration without a physical audit will automatically show the "STALE" flag to preventing families from traveling on outdated reports.
              </p>
            </div>

            <form onSubmit={handleThresholdSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Stale Window Threshold (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default standard in Mumbai component labs is 6 hours.</span>
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition"
              >
                Save Stale Window Configuration
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
