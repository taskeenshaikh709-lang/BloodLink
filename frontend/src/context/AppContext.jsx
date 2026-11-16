import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEMO_USERS,
  INITIAL_INSTITUTIONS,
  INITIAL_INVENTORY,
  INITIAL_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/demoData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current logged in user (defaults to hospital role for immediate high-impact exploration)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bl_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.hospital;
  });

  const [institutions, setInstitutions] = useState(() => {
    const saved = localStorage.getItem('bl_institutions');
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('bl_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('bl_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('bl_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('bl_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [staleThresholdHours, setStaleThresholdHours] = useState(() => {
    const saved = localStorage.getItem('bl_stale_threshold');
    return saved ? parseInt(saved, 10) : 6;
  });

  const [toast, setToast] = useState(null);

  // Sync to local persistence
  useEffect(() => {
    localStorage.setItem('bl_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bl_institutions', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('bl_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('bl_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('bl_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bl_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('bl_stale_threshold', staleThresholdHours.toString());
  }, [staleThresholdHours]);

  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Log an audit event
  const addAuditLog = (action, resourceType, details, resourceId = null) => {
    const newLog = {
      id: Date.now(),
      action,
      resource_type: resourceType,
      resource_id: resourceId ? String(resourceId) : null,
      details,
      actor_email: currentUser ? currentUser.email : 'SYSTEM',
      actor_role: currentUser ? currentUser.role : 'SYSTEM',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Role Switcher for seamless Demo Mode Exploration
  const switchDemoRole = (roleKey) => {
    const target = DEMO_USERS[roleKey];
    if (target) {
      setCurrentUser(target);
      addAuditLog('DEMO_ROLE_SWITCH', 'AUTH', `Switched active dashboard to demo role: ${roleKey}`);
      showToast(`Switched active profile to ${target.name} (${roleKey.toUpperCase()})`, 'info');
    }
  };

  // Login handler
  const loginUser = (email, password) => {
    const foundRole = Object.keys(DEMO_USERS).find(k => DEMO_USERS[k].email === email);
    if (foundRole) {
      setCurrentUser(DEMO_USERS[foundRole]);
      showToast(`Welcome back, ${DEMO_USERS[foundRole].name}`, 'success');
      return true;
    }
    showToast('Invalid credentials. Please select one of the Demo Accounts.', 'error');
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged out securely.', 'info');
  };

  // Create emergency blood request
  const createRequest = ({
    blood_group,
    component,
    quantity,
    urgency,
    required_by,
    patient_ref,
    hospital_name,
    hospital_location,
    clinical_notes,
    contact_person,
    target_bank_ids
  }) => {
    const nowIso = new Date().toISOString();
    const refNo = `BL-${currentUser.role === 'hospital' ? 'HOSP' : 'PUB'}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Pick verified blood banks
    const eligibleBanks = institutions.filter(i =>
      i.institution_type === 'blood_bank' &&
      i.verification_status === 'verified' &&
      (!target_bank_ids || target_bank_ids.length === 0 || target_bank_ids.includes(i.id))
    );

    const responsesSummary = eligibleBanks.map((b, idx) => ({
      id: Date.now() + idx,
      request_id: Date.now(),
      blood_bank_id: b.id,
      blood_bank_name: b.name,
      blood_bank_district: b.district,
      blood_bank_suburb: b.suburb,
      blood_bank_phone: b.contact_phone,
      status: 'Sent',
      available_units_reported: null,
      response_note: null,
      action_by_name: null,
      responded_at: null
    }));

    const newRequest = {
      id: Date.now(),
      reference_no: refNo,
      created_by_user_id: currentUser.id,
      hospital_id: currentUser.institution_id || 1,
      hospital_name: currentUser.institution_name || hospital_name || 'Emergency Center',
      hospital_location: hospital_location || 'Mumbai City',
      treating_department: 'Transfusion & Critical Care',
      patient_ref: patient_ref || `DEMO-REF-${Math.floor(100 + Math.random() * 900)}`,
      blood_group,
      component,
      quantity: Number(quantity),
      urgency,
      required_by,
      clinical_notes,
      contact_person: contact_person || currentUser.name,
      contact_phone_masked: currentUser.phone_masked || '+91 98••••••••',
      status: 'active',
      selected_bank_id: null,
      created_at: nowIso,
      updated_at: nowIso,
      responses_summary: responsesSummary,
      events: [
        {
          id: Date.now(),
          event_type: 'REQUEST_CREATED',
          institution_name: currentUser.institution_name || hospital_name || 'Hospital Center',
          actor_name: currentUser.name,
          details: `Emergency requirement raised for ${quantity} unit(s) of ${blood_group} ${component}. Dispatched to ${eligibleBanks.length} verified blood bank(s).`,
          timestamp: nowIso
        }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);

    // In-app notification for blood banks
    const newNotif = {
      id: Date.now(),
      role_target: 'blood_bank',
      title: `URGENT: ${blood_group} ${component} Requisition`,
      message: `Emergency request ${refNo} from ${newRequest.hospital_name} (${quantity} units needed ${required_by}).`,
      is_read: false,
      channel: 'IN_APP',
      created_at: nowIso
    };
    setNotifications(prev => [newNotif, ...prev]);

    addAuditLog('REQUEST_CREATED', 'BLOOD_REQUEST', `Created emergency request ${refNo}`, newRequest.id);
    showToast(`Emergency request ${refNo} dispatched to ${eligibleBanks.length} verified blood banks.`, 'success');

    return newRequest;
  };

  // Blood bank responds to a request
  const respondToRequest = (requestId, { status, available_units_reported, response_note }) => {
    const nowIso = new Date().toISOString();
    const bankId = currentUser.institution_id || 10;
    const bankName = currentUser.institution_name || 'Tata Memorial Centre Blood Bank (DEMO)';

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      const updatedResponses = req.responses_summary.map(res => {
        if (res.blood_bank_id === bankId) {
          return {
            ...res,
            status,
            available_units_reported: available_units_reported !== undefined ? Number(available_units_reported) : null,
            response_note,
            action_by_name: currentUser.name,
            responded_at: nowIso
          };
        }
        return res;
      });

      // Update overall request status
      let newReqStatus = req.status;
      if (status === 'Availability Confirmed') {
        newReqStatus = 'confirmed';
      } else if (newReqStatus === 'active') {
        newReqStatus = 'partially_responded';
      }

      const newEvent = {
        id: Date.now(),
        event_type: 'BANK_RESPONDED',
        institution_name: bankName,
        actor_name: currentUser.name,
        details: `Updated status to "${status}". Available: ${available_units_reported || 0} unit(s). Notes: ${response_note || 'None'}. (Compatibility check required).`,
        timestamp: nowIso
      };

      return {
        ...req,
        status: newReqStatus,
        updated_at: nowIso,
        responses_summary: updatedResponses,
        events: [newEvent, ...req.events]
      };
    }));

    // Notify hospital
    setNotifications(prev => [
      {
        id: Date.now(),
        role_target: 'hospital',
        title: `Response Received from ${bankName}`,
        message: `${bankName} marked status as "${status}". Review event log and coordinate protocol.`,
        is_read: false,
        channel: 'IN_APP',
        created_at: nowIso
      },
      ...prev
    ]);

    addAuditLog('BANK_RESPONSE', 'REQUEST_RECIPIENT', `Bank ${bankName} responded with ${status}`, requestId);
    showToast(`Recorded response: ${status}`, 'success');
  };

  // Hospital selects a bank for direct follow-up
  const selectBankForFollowUp = (requestId, bankId) => {
    const bank = institutions.find(i => i.id === bankId);
    if (!bank) return;

    const nowIso = new Date().toISOString();
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      const newEvent = {
        id: Date.now(),
        event_type: 'BANK_SELECTED_FOR_FOLLOWUP',
        institution_name: req.hospital_name,
        actor_name: currentUser.name,
        details: `Hospital transfusion staff selected ${bank.name} for official phone and transport coordination. Physical pilot sample tube mandatory.`,
        timestamp: nowIso
      };

      return {
        ...req,
        selected_bank_id: bankId,
        updated_at: nowIso,
        events: [newEvent, ...req.events]
      };
    }));

    addAuditLog('SELECT_BANK_FOLLOWUP', 'BLOOD_REQUEST', `Selected ${bank.name} for request ${requestId}`, requestId);
    showToast(`Selected ${bank.name} for follow-up coordination.`, 'info');
  };

  // Blood bank updates inventory
  const updateInventoryItem = ({ component, blood_group, available_units, reserved_units, notes }) => {
    const bankId = currentUser.institution_id || 10;
    const nowIso = new Date().toISOString();

    setInventory(prev => {
      const idx = prev.findIndex(item => item.institution_id === bankId && item.component === component && item.blood_group === blood_group);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          available_units: Number(available_units),
          reserved_units: Number(reserved_units || 0),
          notes,
          last_updated: nowIso,
          is_stale: false
        };
        return copy;
      } else {
        const newItem = {
          id: Date.now(),
          institution_id: bankId,
          component,
          blood_group,
          available_units: Number(available_units),
          reserved_units: Number(reserved_units || 0),
          notes,
          last_updated: nowIso,
          is_stale: false
        };
        return [newItem, ...prev];
      }
    });

    addAuditLog('INVENTORY_UPDATE', 'BLOOD_INVENTORY', `Updated stock of ${blood_group} ${component} to ${available_units} units.`);
    showToast(`Inventory updated for ${blood_group} ${component}.`, 'success');
  };

  // Admin updates institution verification status
  const updateInstitutionStatus = (instId, newStatus) => {
    setInstitutions(prev => prev.map(inst => {
      if (inst.id === instId) {
        return { ...inst, verification_status: newStatus };
      }
      return inst;
    }));
    addAuditLog('INSTITUTION_VERIFICATION', 'INSTITUTION', `Verification status changed to ${newStatus}`, instId);
    showToast(`Institution verification status changed to: ${newStatus.toUpperCase()}`, 'info');
  };

  // Reset demo data to fresh seed
  const resetDemoData = () => {
    localStorage.clear();
    setInstitutions(INITIAL_INSTITUTIONS);
    setInventory(INITIAL_INVENTORY);
    setRequests(INITIAL_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(DEMO_USERS.hospital);
    setStaleThresholdHours(6);
    showToast('Platform demo state restored to pristine seed data.', 'info');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchDemoRole,
      loginUser,
      logoutUser,
      institutions,
      inventory,
      requests,
      notifications,
      auditLogs,
      staleThresholdHours,
      setStaleThresholdHours,
      createRequest,
      respondToRequest,
      selectBankForFollowUp,
      updateInventoryItem,
      updateInstitutionStatus,
      resetDemoData,
      toast,
      showToast,
      addAuditLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
