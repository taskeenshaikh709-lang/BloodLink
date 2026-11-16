import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Hospital,
  Building2,
  User,
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';

export const RegisterPage = () => {
  const { switchDemoRole, showToast } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('hospital');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    institution_name: '',
    license_number: '',
    district: 'Mumbai City',
    suburb: '',
    blood_group: 'O+'
  });

  const rolesConfig = [
    {
      id: 'hospital',
      title: 'Hospital / Healthcare Institution',
      icon: Hospital,
      badge: 'Institution Review Required',
      description: 'Authorized medical officers, ICU coordinators, and hospital transfusion service staff raising emergency requisitions for admitted patients.',
      requiresVerification: true
    },
    {
      id: 'blood_bank',
      title: 'Licensed Blood Centre / Bank',
      icon: Building2,
      badge: 'Form 28C Verification Required',
      description: 'Government, municipal, or voluntary licensed blood centers with component laboratories receiving emergency dispatch requisitions.',
      requiresVerification: true
    },
    {
      id: 'public',
      title: 'Patient / Family Caregiver',
      icon: User,
      badge: 'Instant Access',
      description: 'Caregivers seeking verified availability at nearby blood centres under the supervision of their attending hospital physician.',
      requiresVerification: false
    },
    {
      id: 'donor',
      title: 'Voluntary Blood Donor (Opt-in)',
      icon: HeartHandshake,
      badge: 'Voluntary • No Commercial Rewards',
      description: 'Citizens who voluntarily indicate willingness to receive community blood shortage alerts. Not a source of guaranteed immediate blood.',
      requiresVerification: false
    },
    {
      id: 'admin',
      title: 'Platform Administrator',
      icon: ShieldCheck,
      badge: 'Restricted Access',
      description: 'Regulatory oversight, document verification, and system health governance. Self-registration is strictly disabled.',
      requiresVerification: true,
      disabled: true
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      showToast('Platform administrators cannot self-register. Please use demo credentials.', 'error');
      return;
    }

    // In demo prototype, switch to selected role with custom name or default
    switchDemoRole(selectedRole);
    showToast(`Registered successfully as ${rolesConfig.find(r => r.id === selectedRole)?.title}. Verification status: Pending Document Audit.`, 'success');
    
    // Redirect to respective dashboard
    if (selectedRole === 'hospital') navigate('/hospital');
    else if (selectedRole === 'blood_bank') navigate('/blood-bank');
    else if (selectedRole === 'donor') navigate('/donor');
    else navigate('/caregiver');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Multi-Role Registration</span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Select Your Platform Role</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            BloodLink enforces role-based access to safeguard patient privacy, prevent unauthorized clinical requests, and maintain compliance with Indian healthcare regulations.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {rolesConfig.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => !r.disabled && setSelectedRole(r.id)}
                className={`p-5 rounded-2xl border-2 transition relative flex flex-col justify-between ${
                  r.disabled
                    ? 'opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed'
                    : isSelected
                    ? 'border-red-600 bg-red-50/40 shadow-sm cursor-pointer'
                    : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.requiresVerification ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{r.description}</p>
                </div>

                {r.disabled && (
                  <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Administrator accounts require manual backend provisioning.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Role Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Complete {rolesConfig.find(r => r.id === selectedRole)?.title} Profile
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedRole === 'hospital' || selectedRole === 'blood_bank'
                ? 'Institutional accounts will be submitted to the Admin Document Verification Queue before receiving live dispatch privileges.'
                : 'Registration allows coordination tracking and notifications. Fictional demo information is permitted.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Authorized Officer</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh K. Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official / Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder="officer@hospital.demo.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>
            </div>

            {/* Institutional specific fields */}
            {(selectedRole === 'hospital' || selectedRole === 'blood_bank') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai Transfusion Centre"
                    value={formData.institution_name}
                    onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Form 28C / Clinical Reg. License No.</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-MUM-BB-28C-2026"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District / Region</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  >
                    <option value="Mumbai City">Mumbai City (South Mumbai, Parel, Dadar)</option>
                    <option value="Mumbai Suburban">Mumbai Suburban (Bandra, Andheri, Borivali)</option>
                    <option value="Thane">Thane Metropolitan Region</option>
                    <option value="Navi Mumbai">Navi Mumbai (Vashi, Nerul, Belapur)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Local Suburb / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parel / Vashi"
                    value={formData.suburb}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>
            )}

            {/* Donor specific preferences */}
            {selectedRole === 'donor' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group (As per lab card)</label>
                <select
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-2">
                  * Voluntary registration. Your contact info is NEVER displayed publicly. You will only receive occasional alerts during critical blood shortages.
                </p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Already registered? <button type="button" onClick={() => navigate('/login')} className="text-red-600 font-semibold hover:underline">Log In</button>
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center space-x-2"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
