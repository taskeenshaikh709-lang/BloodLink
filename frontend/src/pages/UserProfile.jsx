import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck, Mail, Phone, Building2, Key, CheckCircle2 } from 'lucide-react';

export const UserProfile = () => {
  const { currentUser, showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email] = useState(currentUser?.email || '');

  const handleUpdate = (e) => {
    e.preventDefault();
    showToast('Profile information saved.', 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              {currentUser?.name ? currentUser.name[0] : 'U'}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{currentUser?.name}</h1>
              <p className="text-xs text-slate-500 capitalize">{currentUser?.role?.replace('_', ' ')} Profile</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email (Immutable in Demo)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            {currentUser?.institution_name && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Associated Institution</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.institution_name}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Privacy</label>
              <input
                type="text"
                disabled
                value={currentUser?.phone_masked || '+91 98••••••••'}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Phone numbers are masked to safeguard privacy.</span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
