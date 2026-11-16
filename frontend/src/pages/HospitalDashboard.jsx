import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Hospital,
  AlertCircle,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  Building2,
  FileText,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const HospitalDashboard = () => {
  const { requests, currentUser, institutions, selectBankForFollowUp } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Filter requests belonging to this hospital institution (or all in demo mode)
  const hospitalRequests = requests.filter(r => {
    // If user is hospital role, match institution if present
    const matchesUser = currentUser?.institution_id ? r.hospital_id === currentUser.institution_id : true;
    const matchesGroup = filterGroup === 'ALL' || r.blood_group === filterGroup;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      r.reference_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patient_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.component.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesStatus && matchesSearch;
  });

  // Calculate Operational Metrics
  const totalRaised = hospitalRequests.length;
  const activeCount = hospitalRequests.filter(r => r.status === 'active' || r.status === 'partially_responded').length;
  const confirmedCount = hospitalRequests.filter(r => r.status === 'confirmed').length;

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Hospital className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">Hospital Transfusion Requisition Grid</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Medical Partner</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser?.institution_name || 'KEM Hospital & Seth GS Medical College (DEMO)'} • Parel Transfusion Service
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/hospital/new-request"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Raise Emergency Requirement</span>
            </Link>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Active In-Flight Requisitions</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{activeCount}</div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Awaiting partner bank updates</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Availability Confirmed</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{confirmedCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Crossmatch & dispatch pending</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Avg Network Response Time</span>
            <div className="text-2xl font-black text-blue-600 mt-1">14.2 min</div>
            <div className="text-[11px] text-slate-500 mt-1">Across 4 verified Mumbai banks</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Total Historical Records</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalRaised}</div>
            <div className="text-[11px] text-slate-500 mt-1">Fully auditable timeline</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by Ref No, Patient Ref, Component..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O- (Critical)</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active Dispatch</option>
              <option value="partially_responded">Partially Responded</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Hospital Emergency Coordination Queue</h2>
            <span className="text-xs text-slate-500">{hospitalRequests.length} requests matching filters</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="px-6 py-3">Reference & Patient</th>
                  <th className="px-6 py-3">Component & Group</th>
                  <th className="px-6 py-3">Units Needed</th>
                  <th className="px-6 py-3">Urgency & Timeline</th>
                  <th className="px-6 py-3">Partner Bank Responses</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hospitalRequests.map((req) => {
                  const responses = req.responses_summary || [];
                  const confirmedBanks = responses.filter(r => r.status === 'Availability Confirmed');

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 font-mono">{req.reference_no}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Patient Ref: <span className="font-mono text-slate-700 font-semibold">{req.patient_ref}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{req.treating_department}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-black text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-mono">
                            {req.blood_group}
                          </span>
                          <span className="font-semibold text-slate-800">{req.component}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 text-sm">{req.quantity}</span>
                        <span className="text-slate-500 ml-1">units</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.urgency === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.urgency}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-1 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{req.required_by}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {responses.length === 0 ? (
                            <span className="text-slate-400 text-[11px]">Routing to network...</span>
                          ) : (
                            responses.map((resp, i) => (
                              <div key={i} className="flex items-center justify-between text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100">
                                <span className="font-medium text-slate-700 truncate max-w-[140px]" title={resp.blood_bank_name}>
                                  {resp.blood_bank_name?.split(' ')[0]} {resp.blood_bank_name?.split(' ')[1]}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                                  resp.status === 'Availability Confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : resp.status === 'Not Available'
                                    ? 'bg-red-50 text-red-700'
                                    : resp.status === 'Acknowledged'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {resp.status === 'Availability Confirmed' ? `Confirmed (${resp.available_units_reported}u)` : resp.status}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to={`/requests/${req.id}`}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
