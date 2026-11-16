import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoBanner = () => {
  const { currentUser, switchDemoRole } = useApp();
  const navigate = useNavigate();

  const demoRoles = [
    { key: 'hospital', label: 'Hospital Transfusion Staff', path: '/hospital' },
    { key: 'blood_bank', label: 'Verified Blood Centre Staff', path: '/blood-bank' },
    { key: 'public', label: 'Patient / Family Caregiver', path: '/caregiver' },
    { key: 'donor', label: 'Voluntary Donor (Opt-in)', path: '/donor' },
    { key: 'admin', label: 'Platform Administrator', path: '/admin' }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-white px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center space-x-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">INTERACTIVE REVIEWER DEMO MODE:</span>
          <span className="text-slate-400">Current Role:</span>
          <span className="bg-red-950/80 text-red-300 font-mono font-bold px-2 py-0.5 rounded border border-red-800/60 uppercase">
            {currentUser ? currentUser.role.replace('_', ' ') : 'Guest'}
          </span>
          {currentUser?.institution_name && (
            <span className="text-slate-300 truncate hidden sm:inline">
              ({currentUser.institution_name})
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 mr-1 hidden sm:inline">Explore As:</span>
          {demoRoles.map(r => {
            const isCurrent = currentUser?.role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => {
                  switchDemoRole(r.key);
                  navigate(r.path);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center space-x-1 ${
                  isCurrent
                    ? 'bg-red-600 text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <span>{r.label.split(' ')[0]}</span>
                {isCurrent && <span className="text-[9px] font-mono opacity-80">(Active)</span>}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
