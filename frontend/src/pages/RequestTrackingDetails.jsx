import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Hospital,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  AlertTriangle,
  ArrowLeft,
  FileCheck2,
  ShieldCheck,
  Send,
  MessageSquare
} from 'lucide-react';

export const RequestTrackingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, currentUser, respondToRequest, selectBankForFollowUp, showToast } = useApp();

  const req = requests.find(r => r.id === Number(id));

  // Blood bank response modal state
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseStatus, setResponseStatus] = useState('Availability Confirmed');
  const [reportedUnits, setReportedUnits] = useState(2);
  const [responseNote, setResponseNote] = useState('Units ready for physical pilot crossmatch sample.');

  if (!req) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Emergency Requisition Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested ID does not exist or has been archived.</p>
        <Link to="/hospital" className="mt-4 inline-block text-xs font-semibold text-blue-600 hover:underline">
          Return to Hospital Dashboard
        </Link>
      </div>
    );
  }

  const isHospital = currentUser?.role === 'hospital' || currentUser?.role === 'admin';
  const isBloodBank = currentUser?.role === 'blood_bank';

  const handleBankSubmit = (e) => {
    e.preventDefault();
    respondToRequest(req.id, {
      status: responseStatus,
      available_units_reported: reportedUnits,
      response_note: responseNote
    });
    setShowResponseModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md">
            AUDIT RECORD: {req.reference_no}
          </span>
        </div>

        {/* Header Summary Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-500 uppercase">{req.reference_no}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  req.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {req.status}
                </span>
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {req.urgency} Urgency
                </span>
              </div>

              <div className="flex items-center space-x-3 mt-2">
                <span className="text-2xl font-black text-red-600 font-mono bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                  {req.blood_group}
                </span>
                <h1 className="text-xl font-bold text-slate-900">
                  {req.quantity} Unit(s) of {req.component}
                </h1>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Raised by: <strong>{req.hospital_name}</strong> ({req.hospital_location}) • Contact: {req.contact_person}
              </p>
            </div>

            {/* Quick action buttons depending on role */}
            <div className="flex items-center space-x-3">
              {isBloodBank && (
                <button
                  onClick={() => setShowResponseModal(true)}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Update Blood Bank Response</span>
                </button>
              )}
            </div>
          </div>

          {/* Clinical Context box */}
          {req.clinical_notes && (
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 flex items-start space-x-2">
              <span className="font-semibold text-slate-800 flex-shrink-0">Clinical Notes:</span>
              <span className="italic">{req.clinical_notes}</span>
            </div>
          )}
        </div>

        {/* 2-Column Layout: Bank Responses & Audit Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Parallel Blood Centre Responses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Dispatched Partner Blood Centres</h3>
                  <p className="text-[11px] text-slate-500">
                    Each licensed blood centre updates availability independently. No automated deduction.
                  </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                  {req.responses_summary?.length || 0} Centres
                </span>
              </div>

              <div className="space-y-3">
                {req.responses_summary?.map((resp) => {
                  const isSelected = req.selected_bank_id === resp.blood_bank_id;
                  const isConfirmed = resp.status === 'Availability Confirmed';

                  return (
                    <div
                      key={resp.id}
                      className={`p-4 rounded-xl border transition ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                          : isConfirmed
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start space-x-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-slate-900 text-xs">{resp.blood_bank_name}</h4>
                              {isSelected && (
                                <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                  Selected For Pickup
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {resp.blood_bank_suburb}, {resp.blood_bank_district} • Tel: {resp.blood_bank_phone}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : resp.status === 'Not Available'
                              ? 'bg-red-100 text-red-800'
                              : resp.status === 'Acknowledged'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {resp.status}
                          </span>
                        </div>
                      </div>

                      {/* Response details */}
                      {resp.response_note && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-start space-x-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-700">Bank Note: </span>
                            <span>"{resp.response_note}"</span>
                            {resp.available_units_reported !== null && (
                              <span className="font-bold text-emerald-700 ml-1">
                                ({resp.available_units_reported} unit(s) verified on shelf)
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Hospital Action: Contact & Select Bank */}
                      {isHospital && isConfirmed && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                            <PhoneCall className="w-3 h-3 text-emerald-600" />
                            <span>Call {resp.blood_bank_phone} to arrange pilot sample tube</span>
                          </span>

                          <button
                            onClick={() => selectBankForFollowUp(req.id, resp.blood_bank_id)}
                            className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                          >
                            {isSelected ? '✓ Coordination Partner Selected' : 'Select This Bank'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Immutable Event Audit Trail */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Transfusion Audit Timeline</h3>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-3 space-y-4">
                {req.events?.map((ev) => (
                  <div key={ev.id} className="relative pl-5 text-xs">
                    <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-white"></span>
                    <div className="font-semibold text-slate-900">{ev.event_type.replace(/_/g, ' ')}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {ev.actor_name}
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{ev.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Modal: Blood Bank Updating Requisition */}
        {showResponseModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Update Blood Bank Coordination Response</h3>
                <button onClick={() => setShowResponseModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleBankSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability Response</label>
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Availability Confirmed">Availability Confirmed (Stock Checked)</option>
                    <option value="Not Available">Not Available (0 Units)</option>
                    <option value="Acknowledged">Acknowledged (Auditing Reserve)</option>
                    <option value="More Information Required">More Information Required</option>
                  </select>
                </div>

                {responseStatus === 'Availability Confirmed' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Available Units on Shelf</label>
                    <input
                      type="number"
                      min="1"
                      max={req.quantity}
                      value={reportedUnits}
                      onChange={(e) => setReportedUnits(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transfusion / Crossmatch Instructions</label>
                  <textarea
                    rows="3"
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    placeholder="e.g. Please bring pilot tube in ice box and doctor requisition letter..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  ></textarea>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-500">
                  * Note: Clicking confirm does not automatically release blood. Final dispensation requires physical blood grouping, crossmatching and physician clearance at the centre.
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowResponseModal(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                  >
                    Save Response
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
