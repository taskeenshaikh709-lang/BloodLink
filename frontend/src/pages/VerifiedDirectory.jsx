import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Clock,
  PhoneCall,
  MapPin,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const VerifiedDirectory = () => {
  const { institutions, inventory, staleThresholdHours } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const verifiedBanks = institutions.filter(i =>
    i.institution_type === 'blood_bank' &&
    i.verification_status === 'verified' &&
    (districtFilter === 'ALL' || i.district === districtFilter) &&
    (searchTerm === '' ||
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.suburb.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Public Verification Grid</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Licensed Form 28C Centres</span>
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">Verified Blood Centres & Stock Transparency</h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time reported availability across Mumbai City, Mumbai Suburban, Thane, and Navi Mumbai.
              </p>
            </div>

            <div className="text-xs font-mono bg-slate-100 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500">Stale Threshold:</span> <strong>{staleThresholdHours}h</strong>
            </div>
          </div>
        </div>

        {/* Disclaimer alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Availability Notice:</strong> Inventory is reported by participating blood centres. It is subject to physical verification, doctor requisition, and laboratory crossmatching. <strong>Units cannot be purchased or reserved online.</strong>
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by blood bank name or locality (e.g. Parel, Vashi)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Mumbai Districts</option>
              <option value="Mumbai City">Mumbai City (Parel, Dadar, Byculla)</option>
              <option value="Mumbai Suburban">Mumbai Suburban (Bandra, Ghatkopar, Andheri)</option>
              <option value="Navi Mumbai">Navi Mumbai (Vashi, Nerul)</option>
              <option value="Thane">Thane Region</option>
            </select>

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
            >
              <option value="ALL">All Groups</option>
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

        {/* Directory Grid */}
        <div className="space-y-4">
          {verifiedBanks.map((bank) => {
            const bankStock = inventory.filter(i =>
              i.institution_id === bank.id &&
              (selectedGroup === 'ALL' || i.blood_group === selectedGroup)
            );

            return (
              <div key={bank.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-base">{bank.name}</h3>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                          {bank.license_number}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{bank.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Emergency Contact</span>
                      <a href={`tel:${bank.contact_phone}`} className="font-bold text-blue-600 hover:underline flex items-center space-x-1">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{bank.contact_phone}</span>
                      </a>
                    </div>
                    <div className="border-l border-slate-200 pl-4">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Operating Hours</span>
                      <span className="font-semibold text-slate-700">{bank.operating_hours}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Badges Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Reported Component Stock</h4>
                  {bankStock.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No inventory recorded for selected filter.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                      {bankStock.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                            item.is_stale
                              ? 'bg-amber-50/60 border-amber-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-black text-sm text-red-600">
                              {item.blood_group}
                            </span>
                            {item.is_stale ? (
                              <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1 rounded">
                                STALE
                              </span>
                            ) : (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                                FRESH
                              </span>
                            )}
                          </div>

                          <div className="font-medium text-slate-800 text-[11px] truncate" title={item.component}>
                            {item.component.split(' ')[0]} {item.component.split(' ')[1] || ''}
                          </div>

                          <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                            <span className="font-bold text-slate-900 text-xs">{item.available_units} units</span>
                            <span>{new Date(item.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
