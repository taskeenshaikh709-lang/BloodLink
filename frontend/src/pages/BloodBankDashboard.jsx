import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Clock,
  AlertTriangle,
  PlusCircle,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const BloodBankDashboard = () => {
  const { inventory, requests, currentUser, updateInventoryItem, staleThresholdHours } = useApp();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'incoming'
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [modalItem, setModalItem] = useState({
    component: 'Packed Red Blood Cells (PRBC)',
    blood_group: 'O+',
    available_units: 10,
    reserved_units: 2,
    notes: 'Rotator checked, negative for TTI'
  });

  const bankId = currentUser?.institution_id || 10;
  const bankInventory = inventory.filter(i => i.institution_id === bankId);

  // Incoming emergency requisitions routed to this blood bank
  const incomingRequests = requests.filter(r =>
    r.responses_summary?.some(resp => resp.blood_bank_id === bankId)
  );

  const staleItemsCount = bankInventory.filter(i => i.is_stale).length;

  const handleInventorySubmit = (e) => {
    e.preventDefault();
    updateInventoryItem(modalItem);
    setShowUpdateModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Institution Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {currentUser?.institution_name || 'Tata Memorial Centre Blood Bank (DEMO)'}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Form 28C Licensed Center</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                License: MH-MUM-BB-28C-1049 • Parel Component Laboratory • 24x7 Emergency Transfusion Desk
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Update Stock Entry</span>
            </button>
          </div>
        </div>

        {/* Stale Inventory Warning Alert if any item > threshold */}
        {staleItemsCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold">Stale Stock Warning ({staleItemsCount} Component Entries)</h4>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                Platform safety policy flags any inventory older than {staleThresholdHours} hours as <strong>STALE</strong>. Please physically verify shelf counts and click update to refresh the verification timestamp for hospital emergency visibility.
              </p>
            </div>
          </div>
        )}

        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 transition flex items-center space-x-2 ${
              activeTab === 'inventory'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Component Inventory Grid</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              {bankInventory.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-3 transition flex items-center space-x-2 ${
              activeTab === 'incoming'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Incoming Emergency Queue</span>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
              {incomingRequests.length}
            </span>
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Current Reported Stock By Component</h3>
                <p className="text-[11px] text-slate-500">
                  Reported units are indicative only. Physical reservation and crossmatch release occur strictly upon sample arrival.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">FRESHNESS WINDOW: {staleThresholdHours}H</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Blood Group</th>
                    <th className="px-6 py-3">Component Type</th>
                    <th className="px-6 py-3">Available Units</th>
                    <th className="px-6 py-3">Internal Hold</th>
                    <th className="px-6 py-3">Last Verified At</th>
                    <th className="px-6 py-3">Freshness Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bankInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-base font-black text-red-600 bg-red-50 px-2.5 py-1 rounded border border-red-200">
                          {item.blood_group}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">{item.component}</span>
                        {item.notes && (
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">{item.notes}</div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-black text-slate-900 text-sm">{item.available_units}</span>
                        <span className="text-slate-500 ml-1">units</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-slate-600 font-mono">{item.reserved_units} units</span>
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(item.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(item.last_updated).toLocaleDateString()}</span>
                      </td>

                      <td className="px-6 py-4">
                        {item.is_stale ? (
                          <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase flex items-center space-x-1 w-fit">
                            <AlertCircle className="w-3 h-3" />
                            <span>STALE ({staleThresholdHours}h+)</span>
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase flex items-center space-x-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>FRESH</span>
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setModalItem({
                              component: item.component,
                              blood_group: item.blood_group,
                              available_units: item.available_units,
                              reserved_units: item.reserved_units,
                              notes: item.notes || ''
                            });
                            setShowUpdateModal(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs transition"
                        >
                          Quick Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING EMERGENCY REQUISITIONS */}
        {activeTab === 'incoming' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Hospital Emergency Requisitions Queue</h3>
              <span className="text-xs text-slate-500">{incomingRequests.length} requests in queue</span>
            </div>

            <div className="divide-y divide-slate-100">
              {incomingRequests.map((req) => {
                const myResponse = req.responses_summary?.find(r => r.blood_bank_id === bankId);

                return (
                  <div key={req.id} className="p-6 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{req.reference_no}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          req.urgency === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.urgency}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">• Needed: {req.required_by}</span>
                      </div>

                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-xl font-black text-red-600 font-mono bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          {req.blood_group}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          {req.quantity} Unit(s) of {req.component}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-600 mt-1">
                        From: <strong>{req.hospital_name}</strong> ({req.hospital_location}) • Contact: {req.contact_person}
                      </p>

                      {myResponse && (
                        <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 inline-block">
                          <span className="font-semibold">Your Current Institution Status: </span>
                          <span className="font-bold text-red-700">{myResponse.status}</span>
                          {myResponse.response_note && <span className="ml-1 italic text-slate-500">"{myResponse.response_note}"</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/requests/${req.id}`}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                      >
                        <span>Respond / View Case</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal: Update Inventory Stock Entry */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Physical Inventory Audit Update</h3>
                <button onClick={() => setShowUpdateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleInventorySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={modalItem.blood_group}
                      onChange={(e) => setModalItem({ ...modalItem, blood_group: e.target.value })}
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

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Component Type</label>
                    <select
                      value={modalItem.component}
                      onChange={(e) => setModalItem({ ...modalItem, component: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
                      <option value="Platelet Concentrate (RDP)">Platelet Concentrate (RDP)</option>
                      <option value="Single Donor Platelets (SDP)">Single Donor Platelets (SDP)</option>
                      <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                      <option value="Cryoprecipitate">Cryoprecipitate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Available Units on Shelf</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={modalItem.available_units}
                      onChange={(e) => setModalItem({ ...modalItem, available_units: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Internal Reserved Hold</label>
                    <input
                      type="number"
                      min="0"
                      value={modalItem.reserved_units}
                      onChange={(e) => setModalItem({ ...modalItem, reserved_units: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lab / Storage Notes</label>
                  <input
                    type="text"
                    value={modalItem.notes}
                    onChange={(e) => setModalItem({ ...modalItem, notes: e.target.value })}
                    placeholder="e.g. Temperature checked, negative for TTI via CLIA..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-500">
                  Updating this record resets the freshness timestamp to now and clears the STALE alert.
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                  >
                    Commit Stock Audit
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
