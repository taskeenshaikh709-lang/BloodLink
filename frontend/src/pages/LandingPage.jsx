import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Activity,
  ShieldCheck,
  Clock,
  Building2,
  Hospital,
  AlertTriangle,
  ArrowRight,
  Search,
  CheckCircle2,
  FileCheck2,
  PhoneCall,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export const LandingPage = () => {
  const { switchDemoRole } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200/80 px-3 py-1 rounded-full text-xs font-semibold text-red-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>Mumbai Emergency Transfusion Coordination Network</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              One Emergency Protocol for <br />
              <span className="text-red-600">Hospitals & Licensed Blood Centres</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              BloodLink connects hospital transfusion teams and verified Form 28C blood centres across Mumbai to reduce frantic phone calls, eliminate unverified stock rumors, and coordinate emergency availability within seconds.
            </p>

            {/* Strict Regulatory Notice */}
            <div className="mt-6 inline-block bg-slate-100 border border-slate-300/80 rounded-lg p-3 text-xs text-slate-700 max-w-xl text-left">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Statutory Scope & Legal Boundary</span>
              </div>
              <span>BloodLink is a software coordination platform. It is <strong>NOT</strong> a blood bank, blood seller, medical provider, or commercial courier. Blood units cannot be purchased online. Availability is subject to crossmatch testing and hospital requisition.</span>
            </div>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition flex items-center justify-center space-x-2 text-sm"
              >
                <span>Choose Your Role & Register</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/verified-directory"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-300 transition flex items-center justify-center space-x-2 text-sm"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Browse Verified Mumbai Directory</span>
              </Link>
            </div>

            {/* Demo Quick Start Box */}
            <div className="mt-10 p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 text-xs text-left shadow-lg">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white text-sm">Reviewer 1-Click Interactive Dashboards</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">FICTIONAL DATA</span>
              </div>
              <p className="text-slate-400 text-xs mb-3">
                No setup required. Click any profile below to immediately launch that operational dashboard with realistic Mumbai hospital & blood bank scenarios:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Link
                  to="/hospital"
                  onClick={() => switchDemoRole('hospital')}
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 text-center transition group"
                >
                  <Hospital className="w-5 h-5 mx-auto text-blue-400 mb-1 group-hover:scale-110 transition" />
                  <span className="font-semibold block text-white text-xs">Hospital</span>
                  <span className="text-[10px] text-slate-400">KEM Transfusion</span>
                </Link>

                <Link
                  to="/blood-bank"
                  onClick={() => switchDemoRole('blood_bank')}
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 text-center transition group"
                >
                  <Building2 className="w-5 h-5 mx-auto text-red-400 mb-1 group-hover:scale-110 transition" />
                  <span className="font-semibold block text-white text-xs">Blood Bank</span>
                  <span className="text-[10px] text-slate-400">Tata Memorial BB</span>
                </Link>

                <Link
                  to="/caregiver"
                  onClick={() => switchDemoRole('public')}
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 text-center transition group"
                >
                  <Activity className="w-5 h-5 mx-auto text-emerald-400 mb-1 group-hover:scale-110 transition" />
                  <span className="font-semibold block text-white text-xs">Caregiver</span>
                  <span className="text-[10px] text-slate-400">Patient Family</span>
                </Link>

                <Link
                  to="/donor"
                  onClick={() => switchDemoRole('donor')}
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 text-center transition group"
                >
                  <Clock className="w-5 h-5 mx-auto text-amber-400 mb-1 group-hover:scale-110 transition" />
                  <span className="font-semibold block text-white text-xs">Donor (Opt-in)</span>
                  <span className="text-[10px] text-slate-400">Voluntary</span>
                </Link>

                <Link
                  to="/admin"
                  onClick={() => switchDemoRole('admin')}
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 text-center transition group col-span-2 sm:col-span-1"
                >
                  <ShieldCheck className="w-5 h-5 mx-auto text-purple-400 mb-1 group-hover:scale-110 transition" />
                  <span className="font-semibold block text-white text-xs">Admin</span>
                  <span className="text-[10px] text-slate-400">Audit & Verify</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* The 3 Core Problems Solved */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest">Bridging Healthcare Fragmentation</h2>
          <p className="text-2xl font-black text-slate-900 mt-1">Why Emergency Blood Search in Mumbai Fails</p>
          <p className="text-slate-600 text-sm mt-2">
            In severe trauma or chemotherapy emergencies, families and junior residents waste 2 to 4 vital hours making disjointed phone calls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Repeated, Frantic Phone Rounds</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hospital attendants and panicked relatives call 10+ blood centres individually. By the time a centre answers, stock may have changed or the contact is engaged.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>BloodLink: 1 Requisition → Simultaneous Network Dispatch</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Uncertain & Stale Inventory</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Static public lists do not display when stock was last physically verified. Families travel across Mumbai only to discover units are expired or reserved.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>BloodLink: Live Timestamps & Stale Inventory Flagging</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Unregulated Brokers & Rumors</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Desperation leads families to unverified social media forwards or exploitative middle-men charging illegal fees for blood donation.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>BloodLink: Form 28C Licensed Centres Only • Zero Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Component & Clinical Distinction Notice */}
      <section className="bg-slate-100 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Clinical Transfusion Reality</span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Beyond ABO/Rh: Whole Blood vs Component Therapy</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                  Indian modern transfusion medicine relies on component therapy rather than whole blood. PRBC (red cells for trauma/anemia), Platelets / SDP (for dengue and oncology), FFP (for coagulopathy), and Cryoprecipitate (fibrinogen deficiency) have strict storage requirements (2°C–6°C vs -30°C vs 22°C continuous agitation). <strong>ABO/Rh match alone never replaces manual crossmatch or Coombs testing.</strong>
                </p>
              </div>
              <Link
                to="/safety-transfusion"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap transition"
              >
                Read Transfusion Protocol
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Architecture Badges */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Architecture Built For Trust</h3>
          <p className="text-xl font-black text-slate-900 mt-1">Key Pillars of the BloodLink Coordination Model</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Form 28C Verified</h4>
            <p className="text-xs text-slate-500 mt-1">Admin validates FDA Maharashtra licensing before access</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Privacy Isolated</h4>
            <p className="text-xs text-slate-500 mt-1">No broadcast of private patient records or full contact</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Stale Stock Alerts</h4>
            <p className="text-xs text-slate-500 mt-1">Inventory over 6 hours old automatically flagged STALE</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <FileCheck2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Immutable Audit Log</h4>
            <p className="text-xs text-slate-500 mt-1">Every response and status change recorded with timestamps</p>
          </div>
        </div>
      </section>

    </div>
  );
};
