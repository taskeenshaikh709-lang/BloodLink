import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, Mail, Sparkles, Hospital, Building2, User, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { switchDemoRole, loginUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('hospital@bloodlink.org');
  const [password, setPassword] = useState('demo123');

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (loginUser(email, password)) {
      if (email.includes('hospital')) navigate('/hospital');
      else if (email.includes('bank')) navigate('/blood-bank');
      else if (email.includes('admin')) navigate('/admin');
      else if (email.includes('donor')) navigate('/donor');
      else navigate('/caregiver');
    }
  };

  const handleQuickDemo = (roleKey, path) => {
    switchDemoRole(roleKey);
    navigate(path);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-2xl text-white flex items-center justify-center font-black mx-auto mb-3 shadow-sm text-xl">
            BL
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign in to BloodLink</h1>
          <p className="text-xs text-slate-500 mt-1">
            Emergency Transfusion Coordination Access for Mumbai Healthcare Grid
          </p>
        </div>

        {/* 1-Click Demo Profiles Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 mb-6 shadow-md border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>1-Click Interactive Reviewer Login</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-3">
            Click any button below to instantly load the dashboard with pre-configured Mumbai institutional permissions:
          </p>

          <div className="space-y-1.5">
            <button
              onClick={() => handleQuickDemo('hospital', '/hospital')}
              className="w-full text-left bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center space-x-2">
                <Hospital className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="font-semibold block text-slate-100">KEM Hospital Transfusion Team</span>
                  <span className="text-[10px] text-slate-400">hospital@bloodlink.org</span>
                </div>
              </div>
              <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded font-mono">HOSPITAL</span>
            </button>

            <button
              onClick={() => handleQuickDemo('blood_bank', '/blood-bank')}
              className="w-full text-left bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-red-400" />
                <div>
                  <span className="font-semibold block text-slate-100">Tata Memorial Blood Centre</span>
                  <span className="text-[10px] text-slate-400">bank@bloodlink.org</span>
                </div>
              </div>
              <span className="text-[10px] bg-red-900/60 text-red-300 px-2 py-0.5 rounded font-mono">BLOOD BANK</span>
            </button>

            <button
              onClick={() => handleQuickDemo('public', '/caregiver')}
              className="w-full text-left bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-semibold block text-slate-100">Rohit K. Mehta (Caregiver)</span>
                  <span className="text-[10px] text-slate-400">public@bloodlink.org</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-mono">CAREGIVER</span>
            </button>

            <button
              onClick={() => handleQuickDemo('admin', '/admin')}
              className="w-full text-left bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="font-semibold block text-slate-100">Platform Admin (Audit & Compliance)</span>
                  <span className="text-[10px] text-slate-400">admin@bloodlink.org</span>
                </div>
              </div>
              <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded font-mono">ADMIN</span>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Demo Mode: All accounts use password "demo123"')}
                  className="text-[11px] text-red-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs shadow-sm transition flex items-center justify-center space-x-2"
            >
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
