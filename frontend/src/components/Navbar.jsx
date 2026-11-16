import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Activity,
  ShieldAlert,
  Bell,
  User,
  LogOut,
  Hospital,
  Building2,
  HeartHandshake,
  ShieldCheck,
  Menu,
  X,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, switchDemoRole, notifications, logoutUser, resetDemoData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const roles = [
    { key: 'hospital', label: 'Hospital Transfusion Team', icon: Hospital, badge: 'Institution' },
    { key: 'blood_bank', label: 'Verified Blood Bank', icon: Building2, badge: 'Blood Centre' },
    { key: 'public', label: 'Patient / Family Caregiver', icon: User, badge: 'Public' },
    { key: 'donor', label: 'Voluntary Donor (Opt-in)', icon: HeartHandshake, badge: 'Volunteer' },
    { key: 'admin', label: 'Platform Administrator', icon: ShieldCheck, badge: 'System Admin' },
  ];

  const getDashboardPath = (role) => {
    switch (role) {
      case 'hospital': return '/hospital';
      case 'blood_bank': return '/blood-bank';
      case 'public': return '/caregiver';
      case 'donor': return '/donor';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Top Regulatory & Demo Notice Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 font-mono flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2 truncate">
          <span className="bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">Demo Prototype</span>
          <span className="hidden sm:inline">Emergency Blood Coordination Network (Mumbai Metropolitan Area)</span>
          <span className="text-slate-400 hidden md:inline">• Non-commercial • Not a Blood Seller</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={resetDemoData}
            title="Reset prototype state to initial demo seed"
            className="flex items-center space-x-1 text-slate-300 hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 tracking-tight text-xl leading-none">
                  BLOOD<span className="text-red-600">LINK</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">MUMBAI EMERGENCY GRID</span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link to="/how-it-works" className={`hover:text-red-600 transition ${location.pathname === '/how-it-works' ? 'text-red-600 font-semibold' : ''}`}>
              How It Works
            </Link>
            <Link to="/verified-directory" className={`hover:text-red-600 transition ${location.pathname === '/verified-directory' ? 'text-red-600 font-semibold' : ''}`}>
              Live Directory
            </Link>
            <Link to="/safety-transfusion" className={`hover:text-red-600 transition ${location.pathname === '/safety-transfusion' ? 'text-red-600 font-semibold' : ''}`}>
              Safety & Regulations
            </Link>
            {currentUser && (
              <Link
                to={getDashboardPath(currentUser.role)}
                className="text-slate-900 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition"
              >
                My Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action Tools: Role Switcher & User Profile */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span className="capitalize hidden sm:inline">Role: {currentUser ? currentUser.role.replace('_', ' ') : 'Select Role'}</span>
                <span className="sm:hidden font-mono text-[11px]">ROLE</span>
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Interactive Demo Roles</p>
                    <p className="text-[11px] text-slate-500">Switch instantaneously without passwords</p>
                  </div>
                  <div className="py-1">
                    {roles.map(r => {
                      const Icon = r.icon;
                      const active = currentUser?.role === r.key;
                      return (
                        <button
                          key={r.key}
                          onClick={() => {
                            switchDemoRole(r.key);
                            setShowRoleDropdown(false);
                            navigate(getDashboardPath(r.key));
                          }}
                          className={`w-full text-left px-3 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition ${active ? 'bg-red-50/70 font-semibold text-red-700' : 'text-slate-700'}`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <Icon className={`w-4 h-4 ${active ? 'text-red-600' : 'text-slate-400'}`} />
                            <span>{r.label}</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {r.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition"
                title="Simulated In-App Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-sm">Transfusion Alerts</span>
                    <span className="text-xs text-slate-500">{notifications.length} simulated alerts</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 text-xs hover:bg-slate-50">
                        <div className="flex items-center justify-between font-medium text-slate-800">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">SIMULATED</span>
                        </div>
                        <p className="text-slate-600 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 py-1 px-2 rounded-lg hover:bg-slate-100 transition"
                  title="View Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name ? currentUser.name[0] : 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{currentUser.role.replace('_', ' ')}</p>
                  </div>
                </Link>
                <button
                  onClick={logoutUser}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold bg-red-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-red-700 shadow-sm transition"
                >
                  Choose Role
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 text-sm font-medium">
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-red-600"
          >
            How It Works
          </Link>
          <Link
            to="/verified-directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-red-600"
          >
            Live Directory
          </Link>
          <Link
            to="/safety-transfusion"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-red-600"
          >
            Safety & Regulations
          </Link>
          {currentUser && (
            <Link
              to={getDashboardPath(currentUser.role)}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-red-600 font-bold"
            >
              Go to {currentUser.role.replace('_', ' ').toUpperCase()} Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
