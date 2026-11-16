import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  ShieldCheck,
  Bell,
  Clock,
  MapPin,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';

export const DonorDashboard = () => {
  const { currentUser, showToast } = useApp();

  const [donorData, setDonorData] = useState({
    blood_group: 'O+',
    district: 'Mumbai Suburban',
    suburb: 'Andheri East',
    willing_to_donate: true,
    notify_sms: false,
    notify_email: true,
    last_donation: '2026-08-14'
  });

  const [deleteRequested, setDeleteRequested] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    showToast('Voluntary donation preferences updated successfully.', 'success');
  };

  const handleDeleteWorkflow = () => {
    setDeleteRequested(true);
    showToast('Your account and donor records have been queued for complete deletion.', 'info');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Donor Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">Voluntary Donor Registry & Preferences</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  100% Voluntary • Non-Commercial
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser?.name || 'Pooja Nair'} • Registered Donor Profile
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700">
            Registered Group: <strong className="text-red-600">{donorData.blood_group}</strong>
          </div>
        </div>

        {/* Essential Disclaimers on Safety & Non-Commercial Ethics */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-1.5">
          <div className="flex items-center space-x-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Strict Indian National Blood Transfusion Council (NBTC) Policy</span>
          </div>
          <p className="text-amber-900 leading-relaxed">
            • <strong>No Payment or Monetary Compensation:</strong> In accordance with the Supreme Court of India ruling (1996) and Drugs & Cosmetics Act, paid blood donation is illegal. BloodLink does not facilitate monetary transfers or donor compensation.<br />
            • <strong>No Automated Matching:</strong> Voluntary donors are not dispatched directly to private homes or unverified parties. You will only receive voluntary camp or licensed blood centre shortage alerts.<br />
            • <strong>Medical Assessment Required:</strong> Donor eligibility (Hb &gt; 12.5 g/dl, weight &gt; 45kg, 3-month gap) is determined strictly by licensed blood centre medical officers at the time of donation.
          </p>
        </div>

        {/* Preferences Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900">Manage Notification & Location Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Control how and when you wish to be alerted about critical shortages in Mumbai.</p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={donorData.blood_group}
                  onChange={(e) => setDonorData({ ...donorData, blood_group: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">District / Municipal Area</label>
                <select
                  value={donorData.district}
                  onChange={(e) => setDonorData({ ...donorData, district: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Mumbai Suburban">Mumbai Suburban</option>
                  <option value="Mumbai City">Mumbai City</option>
                  <option value="Thane">Thane Metropolitan</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Suburb / Locality</label>
                <input
                  type="text"
                  value={donorData.suburb}
                  onChange={(e) => setDonorData({ ...donorData, suburb: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Last Donation</label>
                <input
                  type="date"
                  value={donorData.last_donation}
                  onChange={(e) => setDonorData({ ...donorData, last_donation: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">A 90-day recovery window is recommended between whole blood donations.</span>
              </div>

              <div className="flex flex-col justify-center space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={donorData.willing_to_donate}
                    onChange={(e) => setDonorData({ ...donorData, willing_to_donate: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                  <span className="font-semibold text-slate-800">Currently Available for Voluntary Calls</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={donorData.notify_email}
                    onChange={(e) => setDonorData({ ...donorData, notify_email: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                  <span className="text-slate-700">Receive verified blood centre shortage emails</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Your private contact info is never shared or displayed.</span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Privacy & Account Deletion Workflow */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-slate-600" />
                <span>Donor Privacy & Data Retention</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                You have the permanent right to remove your donor records from the coordination network at any time. All donor records are deleted permanently upon request.
              </p>
            </div>

            <button
              onClick={handleDeleteWorkflow}
              disabled={deleteRequested}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                deleteRequested
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{deleteRequested ? 'Deletion Request Queued' : 'Request Account Deletion'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
