import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Hospital,
  AlertTriangle,
  Building2,
  Clock,
  Send,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const NewHospitalRequest = () => {
  const { createRequest, institutions, requests, showToast } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_ref: 'KEM-ICU-8820',
    blood_group: 'O-',
    component: 'Packed Red Blood Cells (PRBC)',
    quantity: 2,
    urgency: 'critical',
    required_by: 'Immediate (Within 1-2 Hours)',
    clinical_notes: 'Acute hemorrhagic shock in surgical theater. Massive transfusion standby.',
    contact_person: 'Dr. Ananya Sen (Transfusion In-Charge)',
    target_bank_ids: [] // empty means all verified banks
  });

  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const verifiedBanks = institutions.filter(i =>
    i.institution_type === 'blood_bank' && i.verification_status === 'verified'
  );

  const toggleBankSelection = (bankId) => {
    setFormData(prev => {
      const exists = prev.target_bank_ids.includes(bankId);
      if (exists) {
        return { ...prev, target_bank_ids: prev.target_bank_ids.filter(id => id !== bankId) };
      } else {
        return { ...prev, target_bank_ids: [...prev.target_bank_ids, bankId] };
      }
    });
  };

  const selectAllBanks = () => {
    setFormData(prev => ({
      ...prev,
      target_bank_ids: verifiedBanks.map(b => b.id)
    }));
  };

  const clearBankSelection = () => {
    setFormData(prev => ({ ...prev, target_bank_ids: [] }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check for duplicate in recent requests (same group, component and patient_ref)
    const duplicate = requests.find(r =>
      r.patient_ref.toLowerCase() === formData.patient_ref.toLowerCase() &&
      r.blood_group === formData.blood_group &&
      r.component === formData.component &&
      (r.status === 'active' || r.status === 'partially_responded' || r.status === 'pending')
    );

    if (duplicate && !duplicateWarning) {
      setDuplicateWarning({
        reference: duplicate.reference_no,
        message: `A recent active requisition (${duplicate.reference_no}) already exists for Patient Ref "${formData.patient_ref}" requiring ${formData.blood_group} ${formData.component}.`
      });
      return;
    }

    const newReq = createRequest({
      ...formData,
      hospital_name: 'KEM Hospital & Seth GS Medical College (DEMO)',
      hospital_location: 'Parel, Mumbai City'
    });

    navigate(`/requests/${newReq.id}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/hospital')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospital Queue</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          
          <div className="border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center space-x-2 text-xs font-bold text-red-600 uppercase tracking-wider">
              <Hospital className="w-4 h-4" />
              <span>Hospital Transfusion Service</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">Raise Emergency Blood Requisition</h1>
            <p className="text-xs text-slate-500 mt-1">
              Dispatches parallel emergency availability queries to verified Form 28C blood centres across Mumbai.
            </p>
          </div>

          {/* Mandatory Transfusion Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 mb-6 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Clinical Transfusion Responsibility:</strong> The treating hospital team retains complete responsibility for patient ABO/Rh verification, crossmatching compatibility checks, and doctor authorization. BloodLink does not guarantee availability or perform clinical triage.
            </div>
          </div>

          {/* Duplicate Warning Dialog if triggered */}
          {duplicateWarning && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-xs text-red-950 mb-6 animate-in fade-in">
              <div className="flex items-center space-x-2 font-bold text-sm text-red-800 mb-1">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Duplicate Requisition Warning</span>
              </div>
              <p className="text-slate-700 leading-relaxed mb-3">{duplicateWarning.message}</p>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setDuplicateWarning(null);
                    // Force submit on next click
                    createRequest({
                      ...formData,
                      hospital_name: 'KEM Hospital & Seth GS Medical College (DEMO)',
                      hospital_location: 'Parel, Mumbai City'
                    });
                    navigate('/hospital');
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs"
                >
                  Confirm & Send Anyway
                </button>
                <button
                  type="button"
                  onClick={() => setDuplicateWarning(null)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs"
                >
                  Review Details
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Medical Record No. / Emergency ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KEM-EMG-9941"
                  value={formData.patient_ref}
                  onChange={(e) => setFormData({ ...formData, patient_ref: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  * Fictional demo reference only. Never enter real Aadhaar or patient names.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Authorized Contact Doctor / Sister</label>
                <input
                  type="text"
                  required
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ABO / Rh Blood Group</label>
                <select
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                >
                  <option value="O-">O Negative (O-) — Emergency Universal</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Component</label>
                <select
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
                  <option value="Platelet Concentrate (RDP)">Platelet Concentrate (RDP)</option>
                  <option value="Single Donor Platelets (SDP)">Single Donor Platelets (SDP)</option>
                  <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                  <option value="Whole Blood">Whole Blood (Specific Indication)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Units Required</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Urgency Level</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="critical">Critical (Immediate life threat / 1-2 hours)</option>
                  <option value="high">High (4-6 hours scheduled surgery)</option>
                  <option value="standard">Standard (Next 12-24 hours buffer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required-By Timeline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Within 2 Hours (Before 3:00 PM)"
                  value={formData.required_by}
                  onChange={(e) => setFormData({ ...formData, required_by: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Context & Coordination Notes
              </label>
              <textarea
                rows="2"
                placeholder="Indicate diagnosis, crossmatch pilot tube readiness, or transport courier details..."
                value={formData.clinical_notes}
                onChange={(e) => setFormData({ ...formData, clinical_notes: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
              ></textarea>
            </div>

            {/* Target Blood Banks Selection */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-800">
                  Select Participating Blood Centres ({formData.target_bank_ids.length > 0 ? formData.target_bank_ids.length : 'All 4'} Selected)
                </label>
                <div className="space-x-2 text-[11px]">
                  <button type="button" onClick={selectAllBanks} className="text-blue-600 hover:underline">Select All</button>
                  <span className="text-slate-300">|</span>
                  <button type="button" onClick={clearBankSelection} className="text-slate-500 hover:underline">Clear</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {verifiedBanks.map(bank => {
                  const isChecked = formData.target_bank_ids.length === 0 || formData.target_bank_ids.includes(bank.id);
                  return (
                    <div
                      key={bank.id}
                      onClick={() => toggleBankSelection(bank.id)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${
                        isChecked ? 'bg-white border-blue-500 shadow-xs' : 'bg-slate-100 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold block text-slate-900 truncate">{bank.name}</span>
                        <span className="text-[10px] text-slate-500">{bank.suburb}, {bank.district}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/hospital')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Emergency Query</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
