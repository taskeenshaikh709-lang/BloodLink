import React from 'react';
import {
  Send,
  Building2,
  Hospital,
  Activity,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Hospital Raises Emergency Requisition',
      role: 'Hospital Transfusion Team',
      desc: 'Treating clinician or authorized nurse inputs the patient reference ID, required ABO/Rh group, specific blood component, urgency level, and target timeline.',
      sub: 'Duplicate protection prevents multiple nurses from spamming the system for the same patient.'
    },
    {
      num: '02',
      title: 'Automated Regional Grid Dispatch',
      role: 'BloodLink Routing Engine',
      desc: 'The requisition is dispatched in parallel to verified Form 28C licensed blood centres in the Mumbai cluster (or selected partners within proximity).',
      sub: 'Replaces 15 manual, sequential emergency phone calls.'
    },
    {
      num: '03',
      title: 'Centres Audit Physical Inventory & Respond',
      role: 'Verified Blood Banks',
      desc: 'Blood bank duty technicians view the emergency queue, verify actual shelf availability in their component storage, and independently confirm availability or mark units unavailable.',
      sub: 'No automated stock deduction. Institutions retain 100% control.'
    },
    {
      num: '04',
      title: 'Hospital Transfusion Team Selects Partner',
      role: 'Hospital Officer',
      desc: 'Hospital staff reviews confirmed responses and selects the best matching centre. Direct phone coordination arranges cold-chain pickup and dispatch of the patient pilot tube.',
      sub: 'Full audit history records all timestamps and responses.'
    },
    {
      num: '05',
      title: 'Physical Crossmatch & Authorized Dispensation',
      role: 'Clinical Transfusion Lab',
      desc: 'Upon physical delivery of the patient sample tube at the blood bank counter, major crossmatching is performed and verified units are released in accordance with NBTC guidelines.',
      sub: 'Safe, legal, and compliant healthcare delivery.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">End-to-End Coordination Lifecycle</span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">How BloodLink Works</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            A step-by-step walkthrough of how emergency blood availability is coordinated between Mumbai hospitals and licensed blood centres.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4">
          {steps.map((st, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0">
                {st.num}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-base">{st.title}</h3>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {st.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{st.desc}</p>
                <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{st.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Try Demo CTA */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold">Experience the Full Emergency Coordination Loop</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Open the hospital dashboard, create a sample requisition, switch to the blood bank role to confirm availability, and inspect the real-time event timeline.
          </p>
          <Link
            to="/hospital"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition"
          >
            <span>Launch Hospital Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
