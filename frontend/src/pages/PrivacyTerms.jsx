import React from 'react';
import { ShieldCheck, Lock, FileText, AlertTriangle } from 'lucide-react';

export const PrivacyTerms = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Healthcare Data Governance</span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Privacy Notice & Terms of Coordination</h1>
          <p className="text-slate-500 mt-1">Compliant with the Digital Personal Data Protection Act (DPDP), 2023</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Data Minimization & Patient Anonymity</h2>
          <p>
            BloodLink strictly implements medical data minimization. Full patient names, Aadhaar numbers, residential addresses, and non-pertinent medical records are <strong>never collected or stored</strong>. Emergency requisitions use hospital-generated bed/case reference numbers (MRNs) visible solely to attending clinicians and authorized blood centres.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. No Commercial Transactions or Blood Sales</h2>
          <p>
            In compliance with the National Blood Transfusion Council (NBTC) guidelines, BloodLink does not sell blood, collect money for blood units, or facilitate remuneration to donors. Any attempt to solicit commercial payments through this platform results in immediate institutional de-licensing and criminal reporting under the Drugs & Cosmetics Act.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Voluntary Donor Rights & Erasure</h2>
          <p>
            Voluntary donor registration is entirely optional and consensual. Donors may update communication preferences or execute account deletion at any time, which permanently removes their record from active dispatch caches.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. Clinical Disclaimer</h2>
          <p>
            BloodLink is a communication and logistics coordination protocol. It is not an emergency response ambulance provider or clinical pathology laboratory. Compatibility decisions, crossmatching, and authorization remain the strict statutory responsibility of qualified medical practitioners.
          </p>
        </section>

      </div>
    </div>
  );
};
