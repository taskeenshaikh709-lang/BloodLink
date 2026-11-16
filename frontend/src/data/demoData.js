/**
 * Realistic Fictional Seed Data for Standalone Frontend Prototype Mode
 * All entities clearly tagged with (DEMO) for ethical healthcare presentation
 */

export const INITIAL_INSTITUTIONS = [
  {
    id: 1,
    name: 'KEM Hospital & Seth GS Medical College (DEMO)',
    institution_type: 'hospital',
    license_number: 'MH-MUM-HOSP-2024-0012',
    verification_status: 'verified',
    district: 'Mumbai City',
    suburb: 'Parel',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    contact_phone: '+91 22 2410 7000',
    emergency_contact: '+91 22 2413 6051',
    contact_email: 'transfusion.demo@kem.edu.in',
    is_demo: true,
    operating_hours: '24 Hours Emergency Transfusion Service'
  },
  {
    id: 2,
    name: 'Lilavati Hospital & Research Centre (DEMO)',
    institution_type: 'hospital',
    license_number: 'MH-MUM-HOSP-2023-0481',
    verification_status: 'verified',
    district: 'Mumbai Suburban',
    suburb: 'Bandra West',
    address: 'A-791, Bandra Reclamation, Bandra West, Mumbai 400050',
    contact_phone: '+91 22 2675 1000',
    emergency_contact: '+91 22 2656 8000',
    contact_email: 'bloodreq.demo@lilavati.org',
    is_demo: true,
    operating_hours: '24 Hours Emergency'
  },
  {
    id: 3,
    name: 'Fortis Hospital Mulund (DEMO)',
    institution_type: 'hospital',
    license_number: 'MH-MUM-HOSP-2024-0992',
    verification_status: 'verified',
    district: 'Mumbai Suburban',
    suburb: 'Mulund West',
    address: 'Mulund Goregaon Link Rd, Bhandup West, Mumbai 400078',
    contact_phone: '+91 22 6799 4444',
    emergency_contact: '+91 22 6799 4100',
    contact_email: 'icu.transfusion@fortis-demo.in',
    is_demo: true,
    operating_hours: '24 Hours Emergency'
  },
  {
    id: 4,
    name: 'Kokilaben Dhirubhai Ambani Hospital (DEMO)',
    institution_type: 'hospital',
    license_number: 'MH-MUM-HOSP-2025-0105',
    verification_status: 'pending',
    district: 'Mumbai Suburban',
    suburb: 'Andheri West',
    address: 'Rao Saheb, Achutrao Patwardhan Marg, Andheri West, Mumbai 400053',
    contact_phone: '+91 22 4269 6969',
    emergency_contact: '+91 22 4269 9999',
    contact_email: 'onboarding@kdah-demo.in',
    is_demo: true,
    operating_hours: '24 Hours Emergency'
  },
  {
    id: 10,
    name: 'Tata Memorial Centre Blood Bank (DEMO)',
    institution_type: 'blood_bank',
    license_number: 'MH-MUM-BB-28C-1049',
    verification_status: 'verified',
    district: 'Mumbai City',
    suburb: 'Parel',
    address: 'Dr. E Borges Road, Parel, Mumbai, Maharashtra 400012',
    contact_phone: '+91 22 2417 7000',
    emergency_contact: '+91 22 2417 7015',
    contact_email: 'bloodcentre@tmc-demo.gov.in',
    is_demo: true,
    operating_hours: '24x7 Component Lab & Dispatch'
  },
  {
    id: 11,
    name: 'State Blood Transfusion Council Center (DEMO)',
    institution_type: 'blood_bank',
    license_number: 'MH-SBTC-CENT-0021',
    verification_status: 'verified',
    district: 'Mumbai City',
    suburb: 'Dadar West',
    address: 'Ranade Road, Dadar West, Mumbai 400028',
    contact_phone: '+91 22 2430 8820',
    emergency_contact: '+91 22 2430 9911',
    contact_email: 'dispatch@sbtc-demo.gov.in',
    is_demo: true,
    operating_hours: '24x7 Component Separation'
  },
  {
    id: 12,
    name: 'Samarpan Blood Bank & Component Lab (DEMO)',
    institution_type: 'blood_bank',
    license_number: 'MH-MUM-BB-28C-3381',
    verification_status: 'verified',
    district: 'Mumbai Suburban',
    suburb: 'Ghatkopar East',
    address: 'MG Road, Rajawadi, Ghatkopar East, Mumbai 400077',
    contact_phone: '+91 22 2511 4050',
    emergency_contact: '+91 22 2511 4055',
    contact_email: 'inventory@samarpan-demo.org',
    is_demo: true,
    operating_hours: '8:00 AM - 10:00 PM (Emergency On-Call)'
  },
  {
    id: 13,
    name: 'Navi Mumbai Municipal Blood Centre (DEMO)',
    institution_type: 'blood_bank',
    license_number: 'MH-NMMC-BB-28C-0814',
    verification_status: 'verified',
    district: 'Navi Mumbai',
    suburb: 'Vashi',
    address: 'Sector 10, Vashi, Navi Mumbai, Maharashtra 400703',
    contact_phone: '+91 22 2789 2211',
    emergency_contact: '+91 22 2789 2220',
    contact_email: 'nmmcblood@navimumbai-demo.gov.in',
    is_demo: true,
    operating_hours: '24 Hours Emergency'
  },
  {
    id: 14,
    name: 'Sanjeevani Voluntary Blood Centre (DEMO - Pending Approval)',
    institution_type: 'blood_bank',
    license_number: 'MH-THN-BB-APPL-772',
    verification_status: 'pending',
    district: 'Thane',
    suburb: 'Thane West',
    address: 'Gokhale Road, Naupada, Thane West 400602',
    contact_phone: '+91 22 2533 1100',
    emergency_contact: '+91 22 2533 1102',
    contact_email: 'admin@sanjeevani-demo.org',
    is_demo: true,
    operating_hours: '9:00 AM - 7:00 PM'
  }
];

export const DEMO_USERS = {
  hospital: {
    id: 101,
    name: 'Dr. Ananya Sen (Transfusion Officer)',
    email: 'hospital@bloodlink.org',
    role: 'hospital',
    institution_id: 1,
    institution_name: 'KEM Hospital & Seth GS Medical College (DEMO)',
    phone_masked: '+91 98211 •••••'
  },
  blood_bank: {
    id: 102,
    name: 'Kavita Deshmukh (Blood Centre In-Charge)',
    email: 'bank@bloodlink.org',
    role: 'blood_bank',
    institution_id: 10,
    institution_name: 'Tata Memorial Centre Blood Bank (DEMO)',
    phone_masked: '+91 98222 •••••'
  },
  public: {
    id: 103,
    name: 'Rohit K. Mehta (Family Caregiver)',
    email: 'public@bloodlink.org',
    role: 'public',
    institution_id: null,
    institution_name: null,
    phone_masked: '+91 98333 •••••'
  },
  donor: {
    id: 104,
    name: 'Pooja Nair (Voluntary Donor)',
    email: 'donor@bloodlink.org',
    role: 'donor',
    institution_id: null,
    institution_name: null,
    phone_masked: '+91 98444 •••••'
  },
  admin: {
    id: 105,
    name: 'Dr. Rajesh Sharma (Administrator)',
    email: 'admin@bloodlink.org',
    role: 'admin',
    institution_id: null,
    institution_name: null,
    phone_masked: '+91 98200 •••••'
  }
};

const now = new Date();
const minutesAgo = (m) => new Date(now.getTime() - m * 60000).toISOString();
const hoursAgo = (h) => new Date(now.getTime() - h * 3600000).toISOString();

export const INITIAL_INVENTORY = [
  // Tata Memorial (10)
  { id: 1, institution_id: 10, component: 'Packed Red Blood Cells (PRBC)', blood_group: 'O+', available_units: 14, reserved_units: 2, last_updated: minutesAgo(40), is_stale: false, notes: 'Screened negative for TTI via CLIA' },
  { id: 2, institution_id: 10, component: 'Packed Red Blood Cells (PRBC)', blood_group: 'O-', available_units: 3, reserved_units: 1, last_updated: minutesAgo(35), is_stale: false, notes: 'Emergency trauma priority reserve' },
  { id: 3, institution_id: 10, component: 'Platelet Concentrate (RDP)', blood_group: 'B+', available_units: 18, reserved_units: 4, last_updated: minutesAgo(20), is_stale: false, notes: 'Agitator temp 22°C logged' },
  { id: 4, institution_id: 10, component: 'Single Donor Platelets (SDP)', blood_group: 'A+', available_units: 2, reserved_units: 0, last_updated: minutesAgo(45), is_stale: false, notes: 'Apheresis single donor available' },
  { id: 5, institution_id: 10, component: 'Fresh Frozen Plasma (FFP)', blood_group: 'AB+', available_units: 9, reserved_units: 0, last_updated: hoursAgo(8.5), is_stale: true, notes: 'Plasma deep freeze unit #2 (needs recount)' },

  // SBTC Centre (11)
  { id: 6, institution_id: 11, component: 'Packed Red Blood Cells (PRBC)', blood_group: 'A+', available_units: 22, reserved_units: 5, last_updated: hoursAgo(2), is_stale: false, notes: 'Regular batch from camp' },
  { id: 7, institution_id: 11, component: 'Packed Red Blood Cells (PRBC)', blood_group: 'B+', available_units: 30, reserved_units: 6, last_updated: hoursAgo(2), is_stale: false, notes: 'Optimal supply' },
  { id: 8, institution_id: 11, component: 'Packed Red Blood Cells (PRBC)', blood_group: 'AB-', available_units: 1, reserved_units: 0, last_updated: minutesAgo(15), is_stale: false, notes: 'Extremely scarce inventory' },
  { id: 9, institution_id: 11, component: 'Cryoprecipitate', blood_group: 'O+', available_units: 8, reserved_units: 0, last_updated: hoursAgo(9), is_stale: true, notes: 'Stale update alert' },

  // Samarpan Blood Bank (12)
  { id: 10, institution_id: 12, component: 'Packed Red Blood Cells (PRBC)', blood_group: 'O-', available_units: 0, reserved_units: 0, last_updated: minutesAgo(25), is_stale: false, notes: 'Zero units remaining' },
  { id: 11, institution_id: 12, component: 'Packed Red Blood Cells (PRBC)', blood_group: 'B-', available_units: 2, reserved_units: 0, last_updated: hoursAgo(7.2), is_stale: true, notes: 'Old stock log' },
  { id: 12, institution_id: 12, component: 'Platelet Concentrate (RDP)', blood_group: 'O+', available_units: 12, reserved_units: 2, last_updated: hoursAgo(1.5), is_stale: false, notes: 'Rotator checked' },

  // Navi Mumbai Municipal (13)
  { id: 13, institution_id: 13, component: 'Packed Red Blood Cells (PRBC)', blood_group: 'A-', available_units: 4, reserved_units: 0, last_updated: hoursAgo(7), is_stale: true, notes: 'Night shift logged' },
  { id: 14, institution_id: 13, component: 'Packed Red Blood Cells (PRBC)', blood_group: 'O+', available_units: 19, reserved_units: 3, last_updated: minutesAgo(50), is_stale: false, notes: 'Fresh voluntary camp' }
];

export const INITIAL_REQUESTS = [
  {
    id: 1,
    reference_no: 'BL-MUM-2026-8812',
    created_by_user_id: 101,
    hospital_id: 1,
    hospital_name: 'KEM Hospital & Seth GS Medical College (DEMO)',
    hospital_location: 'Parel, Mumbai City',
    treating_department: 'Emergency Trauma ICU',
    patient_ref: 'KEM-EMG-9021',
    blood_group: 'O-',
    component: 'Packed Red Blood Cells (PRBC)',
    quantity: 3,
    urgency: 'critical',
    required_by: 'Within 2 Hours',
    clinical_notes: 'Road traffic collision with acute internal hemorrhage. Massive transfusion protocol standby.',
    contact_person: 'Dr. Ananya Sen (Transfusion In-Charge)',
    contact_phone_masked: '+91 98211 •••••',
    status: 'partially_responded',
    selected_bank_id: null,
    created_at: hoursAgo(1.2),
    updated_at: minutesAgo(25),
    responses_summary: [
      {
        id: 101,
        request_id: 1,
        blood_bank_id: 10,
        blood_bank_name: 'Tata Memorial Centre Blood Bank (DEMO)',
        blood_bank_district: 'Mumbai City',
        blood_bank_suburb: 'Parel',
        blood_bank_phone: '+91 22 2417 7000',
        status: 'Availability Confirmed',
        available_units_reported: 2,
        response_note: 'We can coordinate 2 PRBC O- units upon receipt of crossmatch pilot sample tube & requisition form.',
        action_by_name: 'Kavita Deshmukh',
        responded_at: minutesAgo(45)
      },
      {
        id: 102,
        request_id: 1,
        blood_bank_id: 11,
        blood_bank_name: 'State Blood Transfusion Council Center (DEMO)',
        blood_bank_district: 'Mumbai City',
        blood_bank_suburb: 'Dadar West',
        blood_bank_phone: '+91 22 2430 8820',
        status: 'Acknowledged',
        available_units_reported: null,
        response_note: 'Checking secondary storage reserve. Will update in 15 mins.',
        action_by_name: 'Sunil Varma',
        responded_at: minutesAgo(30)
      },
      {
        id: 103,
        request_id: 1,
        blood_bank_id: 12,
        blood_bank_name: 'Samarpan Blood Bank & Component Lab (DEMO)',
        blood_bank_district: 'Mumbai Suburban',
        blood_bank_suburb: 'Ghatkopar East',
        blood_bank_phone: '+91 22 2511 4050',
        status: 'Not Available',
        available_units_reported: 0,
        response_note: 'Current stock of O- is 0 units. We have informed our voluntary call list.',
        action_by_name: 'Deepak Joshi',
        responded_at: minutesAgo(50)
      }
    ],
    events: [
      { id: 1, event_type: 'REQUEST_CREATED', institution_name: 'KEM Hospital (DEMO)', actor_name: 'Dr. Ananya Sen', details: 'Emergency request registered for 3 units of PRBC (O-) with Critical urgency.', timestamp: hoursAgo(1.2) },
      { id: 2, event_type: 'ROUTED_TO_PARTNERS', institution_name: 'BloodLink Dispatch Engine', actor_name: 'SYSTEM', details: 'Dispatched coordination alert to 3 verified blood banks in Mumbai City/Suburban cluster.', timestamp: hoursAgo(1.18) },
      { id: 3, event_type: 'BANK_RESPONDED', institution_name: 'Samarpan Blood Bank (DEMO)', actor_name: 'Deepak Joshi', details: 'Reported Not Available (0 units available).', timestamp: minutesAgo(50) },
      { id: 4, event_type: 'AVAILABILITY_CONFIRMED', institution_name: 'Tata Memorial Centre Blood Bank (DEMO)', actor_name: 'Kavita Deshmukh', details: 'Confirmed 2 units reported ready for manual crossmatch protocol.', timestamp: minutesAgo(45) },
      { id: 5, event_type: 'BANK_ACKNOWLEDGED', institution_name: 'SBTC Centre (DEMO)', actor_name: 'Sunil Varma', details: 'Acknowledged request and currently auditing reserve storage.', timestamp: minutesAgo(30) }
    ]
  },
  {
    id: 2,
    reference_no: 'BL-PUB-2026-1044',
    created_by_user_id: 103,
    hospital_id: 2,
    hospital_name: 'Lilavati Hospital & Research Centre (DEMO)',
    hospital_location: 'Bandra West, Mumbai Suburban',
    treating_department: 'Oncology Daycare Ward',
    patient_ref: 'LIL-ONC-331',
    blood_group: 'B+',
    component: 'Platelet Concentrate (RDP)',
    quantity: 2,
    urgency: 'high',
    required_by: 'Within 6 Hours',
    clinical_notes: 'Chemotherapy-induced thrombocytopenia. Platelet count under 18,000.',
    contact_person: 'Rohit K. Mehta (Son/Caregiver)',
    contact_phone_masked: '+91 98333 •••••',
    status: 'pending',
    selected_bank_id: null,
    created_at: minutesAgo(35),
    updated_at: minutesAgo(35),
    responses_summary: [
      {
        id: 201,
        request_id: 2,
        blood_bank_id: 10,
        blood_bank_name: 'Tata Memorial Centre Blood Bank (DEMO)',
        blood_bank_district: 'Mumbai City',
        blood_bank_suburb: 'Parel',
        blood_bank_phone: '+91 22 2417 7000',
        status: 'Sent',
        available_units_reported: null,
        response_note: null,
        action_by_name: null,
        responded_at: null
      },
      {
        id: 202,
        request_id: 2,
        blood_bank_id: 11,
        blood_bank_name: 'State Blood Transfusion Council Center (DEMO)',
        blood_bank_district: 'Mumbai City',
        blood_bank_suburb: 'Dadar West',
        blood_bank_phone: '+91 22 2430 8820',
        status: 'Sent',
        available_units_reported: null,
        response_note: null,
        action_by_name: null,
        responded_at: null
      }
    ],
    events: [
      { id: 10, event_type: 'PUBLIC_REQUEST_SUBMITTED', institution_name: 'Lilavati Hospital (DEMO)', actor_name: 'Rohit K. Mehta', details: 'Caregiver coordination initiated. Awaiting confirmation and requisition check.', timestamp: minutesAgo(35) }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 1, role_target: 'hospital', title: 'Availability Confirmed for BL-MUM-2026-8812', message: 'Tata Memorial Centre Blood Bank confirmed 2 units of PRBC (O-). Click to coordinate pickup.', is_read: false, created_at: minutesAgo(44), channel: 'IN_APP' },
  { id: 2, role_target: 'blood_bank', title: 'New Critical Blood Alert [O-]', message: 'KEM Hospital requires 3 units of PRBC (O-) within 2 hours. Review queue.', is_read: false, created_at: hoursAgo(1.18), channel: 'IN_APP' },
  { id: 3, role_target: 'public', title: 'Emergency Request BL-PUB-2026-1044 Dispatched', message: 'Your request has been routed to 2 nearby verified blood centres. Please keep the patient requisition slip ready.', is_read: false, created_at: minutesAgo(34), channel: 'IN_APP' },
  { id: 4, role_target: 'admin', title: 'Institutional Verification Pending', message: 'Sanjeevani Voluntary Blood Bank has uploaded Form 28C application. Review required.', is_read: false, created_at: hoursAgo(3), channel: 'IN_APP' }
];

export const INITIAL_AUDIT_LOGS = [
  { id: 1, action: 'SYSTEM_INITIALIZATION', actor_email: 'admin@bloodlink.org', actor_role: 'admin', resource_type: 'SYSTEM', details: 'Initialized verified Mumbai medical network bootstrap.', timestamp: hoursAgo(4) },
  { id: 2, action: 'REQUEST_DISPATCH', actor_email: 'hospital@bloodlink.org', actor_role: 'hospital', resource_type: 'BLOOD_REQUEST', resource_id: 'BL-MUM-2026-8812', details: 'Dispatched emergency requisition to 3 blood centres.', timestamp: hoursAgo(1.2) },
  { id: 3, action: 'BANK_CONFIRMATION', actor_email: 'bank@bloodlink.org', actor_role: 'blood_bank', resource_type: 'REQUEST_RECIPIENT', resource_id: '101', details: 'Confirmed 2 units reported ready for manual crossmatch protocol.', timestamp: minutesAgo(45) }
];
