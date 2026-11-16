import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  Heart
} from 'lucide-react';

export const SafetyTransfusion = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Medical Protocol & Regulatory Framework</span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Transfusion Safety, Law & Indian Regulations</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
            Understanding why safe blood cannot be delivered like groceries or purchased online, and how BloodLink complies with Indian statutory standards.
          </p>
        </div>

        {/* 1. Drugs and Cosmetics Act & Indian Law */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-red-600">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-lg font-bold text-slate-900">Legal Framework: Drugs & Cosmetics Act (Form 28C)</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In India, human blood is legally categorized as a "Drug" under Section 3(b) of the <strong>Drugs and Cosmetics Act, 1940</strong>. Operating a blood centre or separating components requires a statutory license on <strong>Form 28C</strong> issued by State Licensing Authorities and approved by the Central Drugs Standard Control Organisation (CDSCO).
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800">Key Legal Boundaries:</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Prohibition of Paid Donors:</strong> The Supreme Court of India banned commercial/paid blood donation across India in January 1998. BloodLink never facilitates remuneration.</li>
              <li><strong>Mandatory Infectious Disease Testing:</strong> Every collected unit must be tested for HIV-I/II, Hepatitis B, Hepatitis C, Syphilis, and Malaria before release.</li>
              <li><strong>No Third-Party Brokers:</strong> Only licensed blood banks and authorized hospital transfusion services may handle blood storage and distribution.</li>
            </ul>
          </div>
        </div>

        {/* 2. Component Therapy vs Whole Blood */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-blue-600">
            <Layers className="w-6 h-6" />
            <h2 className="text-lg font-bold text-slate-900">Transfusion Medicine: Component Separation</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Modern Indian transfusion centres do not dispense Whole Blood except in rare field scenarios. A single voluntary donation is split into specific lifesaving components with distinct storage requirements:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Packed Red Blood Cells (PRBC)</h4>
              <p className="text-[11px] text-slate-600 mt-1">Stored at 2°C to 6°C (Shelf-life 35–42 days). Indicated for severe trauma, surgical hemorrhage, and severe anemia.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Platelet Concentrates (RDP / SDP)</h4>
              <p className="text-[11px] text-slate-600 mt-1">Stored at 20°C to 24°C with continuous gentle agitation (Shelf-life strictly 5 days). Used in dengue, leukemia, and thrombocytopenia.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Fresh Frozen Plasma (FFP)</h4>
              <p className="text-[11px] text-slate-600 mt-1">Stored frozen at -30°C or below (Shelf-life up to 1 year). Replenishes multiple clotting factors in coagulopathy.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Cryoprecipitate</h4>
              <p className="text-[11px] text-slate-600 mt-1">Frozen at -30°C. High concentration of Factor VIII, von Willebrand factor, and Fibrinogen.</p>
            </div>
          </div>
        </div>

        {/* 3. Why Crossmatching is Mandatory */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-lg font-bold text-slate-900">Why ABO/Rh Alone Is Not Enough: Mandatory Crossmatch</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Many public users assume that knowing a patient is "B Positive" means any B Positive unit can be picked up immediately. In reality, pre-transfusion serological testing is mandatory:
          </p>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <p>
              1. <strong>Major Crossmatch:</strong> Patient's serum is tested against donor red blood cells to check for unexpected antibodies that could cause fatal acute hemolytic transfusion reactions.
            </p>
            <p>
              2. <strong>Pilot Sample Tube:</strong> The patient's blood sample must be physically brought in an EDTA tube from the hospital to the blood centre before any blood unit can be released.
            </p>
            <p>
              3. <strong>Cold Chain Transportation:</strong> Blood must be transported in insulated validation boxes maintained at monitored temperatures.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
