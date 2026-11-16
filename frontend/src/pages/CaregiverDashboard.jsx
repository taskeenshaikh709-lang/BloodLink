import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  User,
  AlertTriangle,
  Clock,
  Building2,
  PhoneCall,
  Search,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';

export const CaregiverDashboard = () => {
  const { requests, currentUser, institutions, createRequest, showToast } = useApp();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({
    hospital_name: 'Lilavati Hospital & Research Centre (DEMO)',
    hospital_location: 'Bandra West, Mumbai',
    patient_ref: 'LIL-EMG-102',
    blood_group: 'B+',
    component: 'Platelet Concentrate (RDP)',
    quantity: 2,
    urgency: 'high',
    required_by: 'Within 4-6 Hours',
    contact_person: currentUser?.name || 'Rohit K. Mehta (Caregiver)',
    clinical_notes: 'Chemotherapy-induced thrombocytopenia under Dr. Joshi.'
  });

  // Requests created by caregiver
  const myRequests = requests.filter(r => r.created_by_user_id === currentUser?.id || r.created_by_user_id === 103);

  const verifiedBanks = institutions.filter(i => i.institution_type === 'blood_bank' && i.verification_status === 'verified');

  const handleCaregiverSubmit = (e) => {
    e.preventDefault();
    createRequest({
      ...formData,
      hospital_name: formData.hospital_name,
      hospital_location: formData.hospital_location
    });
    setShowRequestModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Caregiver Welcome Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">Patient & Family Caregiver Helpdesk</h1>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Caregiver Role
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Logged in as {currentUser?.name || 'Rohit K. Mehta'} • Direct Transparent Communication Grid
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Search Verified Blood Availability</span>
          </button>
        </div>

        {/* Life Safety Guidance Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-950">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <h4 className="font-bold">Essential Transfusion Advice for Families</h4>
            <p className="mt-0.5 text-blue-900">
              1. Always keep the <strong>Doctor Requisition Slip</strong> and the <strong>Blood Sample Pilot Tube</strong> (taken by the hospital nurse/attendant) ready.<br />
              2. Do not pay any cash or fee to private third-parties or middlemen claiming to arrange blood. Licensed blood centres only levy standard processing service charges prescribed by the Government of India.<br />
              3. BloodLink does not guarantee availability until the blood centre laboratory confirms physical matching.
            </p>
          </div>
        </div>

        {/* Active Emergency Inquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Your Coordinated Emergency Requests</h2>
            <span className="text-xs text-slate-500">{myRequests.length} recorded</span>
          </div>

          <div className="divide-y divide-slate-100">
            {myRequests.map((req) => {
              const confirmedBank = req.responses_summary?.find(r => r.status === 'Availability Confirmed');

              return (
                <div key={req.id} className="p-6 hover:bg-slate-50/70 transition space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{req.reference_no}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          req.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-sm">
                          {req.blood_group}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{req.quantity} units of {req.component}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Attending Hospital: <strong>{req.hospital_name}</strong> ({req.hospital_location})
                      </p>
                    </div>

                    <Link
                      to={`/requests/${req.id}`}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 w-fit"
                    >
                      <span>Track Real-Time Status</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Confirmed availability highlight */}
                  {confirmedBank ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start justify-between text-xs text-emerald-950">
                      <div>
                        <div className="font-bold flex items-center space-x-1 text-emerald-800">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Availability Confirmed at {confirmedBank.blood_bank_name}</span>
                        </div>
                        <p className="text-[11px] text-emerald-900 mt-1">
                          {confirmedBank.available_units_reported} unit(s) verified ready for crossmatching. 
                          Contact phone: <strong>{confirmedBank.blood_bank_phone}</strong>.
                        </p>
                      </div>
                      <a
                        href={`tel:${confirmedBank.blood_bank_phone}`}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs whitespace-nowrap"
                      >
                        Call Bank
                      </a>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                      Dispatched to <strong>{req.responses_summary?.length || 2} verified Mumbai blood centres</strong>. Awaiting lab technician response.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Directory of Verified Blood Centres nearby */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Nearby Licensed Blood Centres (Mumbai Metropolitan Region)</h3>
              <p className="text-[11px] text-slate-500">Contact directly or show the patient crossmatch sample at their transfusion counter</p>
            </div>
            <Link to="/verified-directory" className="text-xs font-semibold text-blue-600 hover:underline">
              View Full Directory
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {verifiedBanks.slice(0, 4).map(bank => (
              <div key={bank.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs truncate max-w-[240px]">{bank.name}</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    Form 28C
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{bank.address}</p>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-mono text-[11px]">{bank.contact_phone}</span>
                  <span className="text-[10px] text-slate-400">{bank.operating_hours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Caregiver Raising Blood Requirement */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Emergency Availability Coordination</h3>
                <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleCaregiverSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attending Hospital Name</label>
                  <input
                    type="text"
                    required
                    value={formData.hospital_name}
                    onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Patient MRN / Bed Ref</label>
                    <input
                      type="text"
                      required
                      value={formData.patient_ref}
                      onChange={(e) => setFormData({ ...formData, patient_ref: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Blood Group Needed</label>
                    <select
                      value={formData.blood_group}
                      onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Component</label>
                    <select
                      value={formData.component}
                      onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Platelet Concentrate (RDP)">Platelet Concentrate (RDP)</option>
                      <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
                      <option value="Single Donor Platelets (SDP)">Single Donor Platelets (SDP)</option>
                      <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Prescription Note</label>
                  <textarea
                    rows="2"
                    value={formData.clinical_notes}
                    onChange={(e) => setFormData({ ...formData, clinical_notes: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  ></textarea>
                </div>

                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[10px] text-amber-900 leading-relaxed">
                  * Note: Submission alerts nearby verified blood banks. You must present the patient sample tube at the hospital/bank for mandatory pre-transfusion crossmatching before blood can be issued.
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                  >
                    Broadcast Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
