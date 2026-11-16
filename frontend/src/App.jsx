import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { Toast } from './components/Toast';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HospitalDashboard } from './pages/HospitalDashboard';
import { NewHospitalRequest } from './pages/NewHospitalRequest';
import { RequestTrackingDetails } from './pages/RequestTrackingDetails';
import { BloodBankDashboard } from './pages/BloodBankDashboard';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { DonorDashboard } from './pages/DonorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { VerifiedDirectory } from './pages/VerifiedDirectory';
import { HowItWorks } from './pages/HowItWorks';
import { SafetyTransfusion } from './pages/SafetyTransfusion';
import { UserProfile } from './pages/UserProfile';
import { PrivacyTerms } from './pages/PrivacyTerms';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <DemoBanner />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/verified-directory" element={<VerifiedDirectory />} />
          <Route path="/safety-transfusion" element={<SafetyTransfusion />} />

          {/* Role Dashboards */}
          <Route path="/hospital" element={<HospitalDashboard />} />
          <Route path="/hospital/new-request" element={<NewHospitalRequest />} />
          <Route path="/requests/:id" element={<RequestTrackingDetails />} />
          <Route path="/blood-bank" element={<BloodBankDashboard />} />
          <Route path="/caregiver" element={<CaregiverDashboard />} />
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Common */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/privacy" element={<PrivacyTerms />} />
          <Route path="/terms" element={<PrivacyTerms />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default App;
