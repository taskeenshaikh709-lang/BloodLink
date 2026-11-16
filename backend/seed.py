from datetime import datetime, timezone, timedelta
from models import db, User, Institution, InstitutionDocument, BloodInventory, BloodRequest, RequestRecipient, RequestEvent, DonorProfile, Notification, AuditLog, Role, VerificationStatus, RequestStatus, ResponseStatus, UrgencyLevel, BloodGroup, BloodComponent

def seed_database():
    # Only seed if no institutions exist
    if Institution.query.first():
        print("Database already seeded.")
        return

    print("Seeding initial fictional Mumbai healthcare demo data...")

    # 1. Institutions: Hospitals
    hospitals_data = [
        {
            'name': 'KEM Hospital & Seth GS Medical College (DEMO)',
            'institution_type': 'hospital',
            'license_number': 'MH-MUM-HOSP-2024-0012',
            'verification_status': VerificationStatus.VERIFIED,
            'district': 'Mumbai City',
            'suburb': 'Parel',
            'address': 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
            'contact_phone': '+91 22 2410 7000',
            'emergency_contact': '+91 22 2413 6051',
            'contact_email': 'transfusion.demo@kem.edu.in',
            'latitude': 19.0028,
            'longitude': 72.8427,
            'is_demo': True
        },
        {
            'name': 'Lilavati Hospital & Research Centre (DEMO)',
            'institution_type': 'hospital',
            'license_number': 'MH-MUM-HOSP-2023-0481',
            'verification_status': VerificationStatus.VERIFIED,
            'district': 'Mumbai Suburban',
            'suburb': 'Bandra West',
            'address': 'A-791, Bandra Reclamation, Bandra West, Mumbai 400050',
            'contact_phone': '+91 22 2675 1000',
            'emergency_contact': '+91 22 2656 8000',
            'contact_email': 'bloodreq.demo@lilavati.org',
            'latitude': 19.0514,
            'longitude': 72.8295,
            'is_demo': True
        },
        {
            'name': 'Fortis Hospital Mulund (DEMO)',
            'institution_type': 'hospital',
            'license_number': 'MH-MUM-HOSP-2024-0992',
            'verification_status': VerificationStatus.VERIFIED,
            'district': 'Mumbai Suburban',
            'suburb': 'Mulund West',
            'address': 'Mulund Goregaon Link Rd, Industrial Area, Bhandup West, Mumbai 400078',
            'contact_phone': '+91 22 6799 4444',
            'emergency_contact': '+91 22 6799 4100',
            'contact_email': 'icu.transfusion@fortis-demo.in',
            'latitude': 19.1601,
            'longitude': 72.9366,
            'is_demo': True
        },
        {
            'name': 'Kokilaben Dhirubhai Ambani Hospital (DEMO)',
            'institution_type': 'hospital',
            'license_number': 'MH-MUM-HOSP-2025-0105',
            'verification_status': VerificationStatus.PENDING,
            'district': 'Mumbai Suburban',
            'suburb': 'Andheri West',
            'address': 'Rao Saheb, Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai 400053',
            'contact_phone': '+91 22 4269 6969',
            'emergency_contact': '+91 22 4269 9999',
            'contact_email': 'onboarding@kdah-demo.in',
            'latitude': 19.1311,
            'longitude': 72.8258,
            'is_demo': True
        }
    ]

    hospitals = []
    for h in hospitals_data:
        inst = Institution(**h)
        db.session.add(inst)
        hospitals.append(inst)

    # 2. Institutions: Blood Banks
    banks_data = [
        {
            'name': 'Tata Memorial Centre Blood Bank (DEMO)',
            'institution_type': 'blood_bank',
            'license_number': 'MH-MUM-BB-28C-1049',
            'verification_status': VerificationStatus.VERIFIED,
            'district': 'Mumbai City',
            'suburb': 'Parel',
            'address': 'Dr. E Borges Road, Parel, Mumbai, Maharashtra 400012',
            'contact_phone': '+91 22 2417 7000',
            'emergency_contact': '+91 22 2417 7015',
            'contact_email': 'bloodcentre@tmc-demo.gov.in',
            'latitude': 19.0042,
            'longitude': 72.8431,
            'is_demo': True
        },
        {
            'name': 'State Blood Transfusion Council Center (DEMO)',
            'institution_type': 'blood_bank',
            'license_number': 'MH-SBTC-CENT-0021',
            'verification_status': VerificationStatus.VERIFIED,
            'district': 'Mumbai City',
            'suburb': 'Dadar West',
            'address': 'Ranade Road, Dadar West, Mumbai 400028',
            'contact_phone': '+91 22 2430 8820',
            'emergency_contact': '+91 22 2430 9911',
            'contact_email': 'dispatch@sbtc-demo.gov.in',
            'latitude': 19.0195,
            'longitude': 72.8428,
            'is_demo': True
        },
        {
            'name': 'Samarpan Blood Bank & Component Lab (DEMO)',
            'institution_type': 'blood_bank',
            'license_number': 'MH-MUM-BB-28C-3381',
            'verification_status': VerificationStatus.VERIFIED,
            'district': 'Mumbai Suburban',
            'suburb': 'Ghatkopar East',
            'address': 'MG Road, Rajawadi, Ghatkopar East, Mumbai 400077',
            'contact_phone': '+91 22 2511 4050',
            'emergency_contact': '+91 22 2511 4055',
            'contact_email': 'inventory@samarpan-demo.org',
            'latitude': 19.0790,
            'longitude': 72.9080,
            'is_demo': True
        },
        {
            'name': 'Navi Mumbai Municipal Blood Centre (DEMO)',
            'institution_type': 'blood_bank',
            'license_number': 'MH-NMMC-BB-28C-0814',
            'verification_status': VerificationStatus.VERIFIED,
            'district': 'Navi Mumbai',
            'suburb': 'Vashi',
            'address': 'Sector 10, Vashi, Navi Mumbai, Maharashtra 400703',
            'contact_phone': '+91 22 2789 2211',
            'emergency_contact': '+91 22 2789 2220',
            'contact_email': 'nmmcblood@navimumbai-demo.gov.in',
            'latitude': 19.0770,
            'longitude': 72.9986,
            'is_demo': True
        },
        {
            'name': 'Sanjeevani Voluntary Blood Bank (DEMO - Pending Approval)',
            'institution_type': 'blood_bank',
            'license_number': 'MH-THN-BB-APPL-772',
            'verification_status': VerificationStatus.PENDING,
            'district': 'Thane',
            'suburb': 'Thane West',
            'address': 'Gokhale Road, Naupada, Thane West 400602',
            'contact_phone': '+91 22 2533 1100',
            'emergency_contact': '+91 22 2533 1102',
            'contact_email': 'admin@sanjeevani-demo.org',
            'latitude': 19.1860,
            'longitude': 72.9754,
            'is_demo': True
        }
    ]

    banks = []
    for b in banks_data:
        inst = Institution(**b)
        db.session.add(inst)
        banks.append(inst)

    db.session.commit()

    # 3. Documents for verification review
    docs_data = [
        {
            'institution_id': banks[0].id,
            'doc_type': 'Form 28C Drug Licence',
            'doc_reference': 'FDA-MH/28C/2022/9941',
            'status': 'Verified Demo'
        },
        {
            'institution_id': banks[1].id,
            'doc_type': 'SBTC Operating Accreditation',
            'doc_reference': 'SBTC-REG-449-A',
            'status': 'Verified Demo'
        },
        {
            'institution_id': banks[4].id, # Sanjeevani (Pending)
            'doc_type': 'Form 28C Application Copy',
            'doc_reference': 'FDA-MH/PENDING/2026/088',
            'status': 'Awaiting Admin Review'
        },
        {
            'institution_id': hospitals[3].id, # Kokilaben (Pending)
            'doc_type': 'Clinical Establishment Registration',
            'doc_reference': 'BMC-CER-2024-8841',
            'status': 'Awaiting Admin Review'
        }
    ]
    for d in docs_data:
        db.session.add(InstitutionDocument(**d))

    # 4. Standard Demo Users for all roles
    # Passwords for demo accounts: "demo123"
    users_data = [
        {
            'email': 'admin@bloodlink.org',
            'password': 'demo123',
            'name': 'Dr. Rajesh Sharma (Admin)',
            'role': Role.ADMIN,
            'phone_masked': '+91 98200 •••••',
            'institution_id': None
        },
        {
            'email': 'hospital@bloodlink.org',
            'password': 'demo123',
            'name': 'Dr. Ananya Sen (Transfusion Officer)',
            'role': Role.HOSPITAL,
            'phone_masked': '+91 98211 •••••',
            'institution_id': hospitals[0].id # KEM Hospital
        },
        {
            'email': 'hospital.lilavati@bloodlink.org',
            'password': 'demo123',
            'name': 'Sister Meenakshi Rao (Emergency Coordinator)',
            'role': Role.HOSPITAL,
            'phone_masked': '+91 98212 •••••',
            'institution_id': hospitals[1].id # Lilavati
        },
        {
            'email': 'bank@bloodlink.org',
            'password': 'demo123',
            'name': 'Kavita Deshmukh (Blood Centre In-Charge)',
            'role': Role.BLOOD_BANK,
            'phone_masked': '+91 98222 •••••',
            'institution_id': banks[0].id # Tata Memorial
        },
        {
            'email': 'bank.sbtc@bloodlink.org',
            'password': 'demo123',
            'name': 'Sunil Varma (Technical Supervisor)',
            'role': Role.BLOOD_BANK,
            'phone_masked': '+91 98223 •••••',
            'institution_id': banks[1].id # SBTC
        },
        {
            'email': 'bank.samarpan@bloodlink.org',
            'password': 'demo123',
            'name': 'Deepak Joshi (Duty Officer)',
            'role': Role.BLOOD_BANK,
            'phone_masked': '+91 98224 •••••',
            'institution_id': banks[2].id # Samarpan
        },
        {
            'email': 'public@bloodlink.org',
            'password': 'demo123',
            'name': 'Rohit K. Mehta (Family Caregiver)',
            'role': Role.PUBLIC,
            'phone_masked': '+91 98333 •••••',
            'institution_id': None
        },
        {
            'email': 'donor@bloodlink.org',
            'password': 'demo123',
            'name': 'Pooja Nair (Voluntary Donor)',
            'role': Role.DONOR,
            'phone_masked': '+91 98444 •••••',
            'institution_id': None
        }
    ]

    created_users = {}
    for u in users_data:
        usr = User(
            email=u['email'],
            name=u['name'],
            role=u['role'],
            phone_masked=u['phone_masked'],
            institution_id=u['institution_id']
        )
        usr.set_password(u['password'])
        db.session.add(usr)
        created_users[u['email']] = usr

    db.session.commit()

    # 5. Donor Profile
    donor_user = created_users['donor@bloodlink.org']
    donor_prof = DonorProfile(
        user_id=donor_user.id,
        blood_group='O+',
        district='Mumbai Suburban',
        suburb='Andheri East',
        willing_to_donate=True,
        notify_sms=False,
        notify_email=True,
        last_donation_date='2026-08-14'
    )
    db.session.add(donor_prof)

    # 6. Blood Inventory for Banks (Fresh & Stale demo entries)
    now = datetime.now(timezone.utc)
    fresh_time = now - timedelta(minutes=45)
    stale_time = now - timedelta(hours=8, minutes=30)
    moderately_recent = now - timedelta(hours=2, minutes=15)

    inventories = [
        # Tata Memorial (Bank 0)
        {'institution_id': banks[0].id, 'component': BloodComponent.PRBC, 'blood_group': 'O+', 'available_units': 14, 'reserved_units': 2, 'last_updated': fresh_time, 'notes': 'Screened negative for TTI via CLIA'},
        {'institution_id': banks[0].id, 'component': BloodComponent.PRBC, 'blood_group': 'O-', 'available_units': 3, 'reserved_units': 1, 'last_updated': fresh_time, 'notes': 'Rare group priority reserve'},
        {'institution_id': banks[0].id, 'component': BloodComponent.PLATELETS, 'blood_group': 'B+', 'available_units': 18, 'reserved_units': 4, 'last_updated': fresh_time, 'notes': 'Shelf-life monitored 5 days max'},
        {'institution_id': banks[0].id, 'component': BloodComponent.SDP, 'blood_group': 'A+', 'available_units': 2, 'reserved_units': 0, 'last_updated': fresh_time, 'notes': 'Apheresis single donor available'},
        {'institution_id': banks[0].id, 'component': BloodComponent.FFP, 'blood_group': 'AB+', 'available_units': 9, 'reserved_units': 0, 'last_updated': stale_time, 'notes': 'Plasma kept at -30 deg C'},

        # SBTC Centre (Bank 1)
        {'institution_id': banks[1].id, 'component': BloodComponent.PRBC, 'blood_group': 'A+', 'available_units': 22, 'reserved_units': 5, 'last_updated': moderately_recent, 'notes': 'Regular stock replenished'},
        {'institution_id': banks[1].id, 'component': BloodComponent.PRBC, 'blood_group': 'B+', 'available_units': 30, 'reserved_units': 6, 'last_updated': moderately_recent, 'notes': 'Adequate stock'},
        {'institution_id': banks[1].id, 'component': BloodComponent.PRBC, 'blood_group': 'AB-', 'available_units': 1, 'reserved_units': 0, 'last_updated': fresh_time, 'notes': 'Extremely limited stock'},
        {'institution_id': banks[1].id, 'component': BloodComponent.CRYOPRECIPITATE, 'blood_group': 'O+', 'available_units': 8, 'reserved_units': 0, 'last_updated': stale_time, 'notes': 'Fibrinogen source'},

        # Samarpan Blood Bank (Bank 2 - Ghatkopar)
        {'institution_id': banks[2].id, 'component': BloodComponent.PRBC, 'blood_group': 'O-', 'available_units': 0, 'reserved_units': 0, 'last_updated': fresh_time, 'notes': 'Zero stock as of last stock verification'},
        {'institution_id': banks[2].id, 'component': BloodComponent.PRBC, 'blood_group': 'B-', 'available_units': 2, 'reserved_units': 0, 'last_updated': stale_time, 'notes': 'Awaiting fresh voluntary camp collection'},
        {'institution_id': banks[2].id, 'component': BloodComponent.PLATELETS, 'blood_group': 'O+', 'available_units': 12, 'reserved_units': 2, 'last_updated': moderately_recent, 'notes': 'Agitator temperature controlled'},

        # Navi Mumbai Municipal Centre (Bank 3 - Vashi)
        {'institution_id': banks[3].id, 'component': BloodComponent.PRBC, 'blood_group': 'A-', 'available_units': 4, 'reserved_units': 0, 'last_updated': stale_time, 'notes': 'Last updated yesterday night'},
        {'institution_id': banks[3].id, 'component': BloodComponent.PRBC, 'blood_group': 'O+', 'available_units': 19, 'reserved_units': 3, 'last_updated': fresh_time, 'notes': 'Fresh voluntary donation stock'}
    ]

    for inv in inventories:
        db.session.add(BloodInventory(**inv))

    # 7. Sample Initial Emergency Requests to Demonstrate Rich History
    # Scenario 1: Hospital Active Request with multiple bank responses
    req1 = BloodRequest(
        reference_no='BL-MUM-2026-8812',
        created_by_user_id=created_users['hospital@bloodlink.org'].id,
        hospital_id=hospitals[0].id,
        hospital_name=hospitals[0].name,
        hospital_location='Parel, Mumbai City',
        treating_department='Emergency Trauma ICU',
        patient_ref='KEM-EMG-9021',
        blood_group='O-',
        component=BloodComponent.PRBC,
        quantity=3,
        urgency=UrgencyLevel.CRITICAL,
        required_by='Within 2 Hours',
        clinical_notes='Road traffic collision with acute internal hemorrhage. Massive transfusion protocol standby.',
        contact_person='Dr. Ananya Sen (Transfusion In-Charge)',
        contact_phone_masked='+91 98211 •••••',
        status=RequestStatus.PARTIALLY_RESPONDED,
        created_at=now - timedelta(hours=1, minutes=15),
        updated_at=now - timedelta(minutes=25)
    )
    db.session.add(req1)
    db.session.flush()

    # Recipient bank 0 (Tata Memorial): Confirmed availability
    rec1_b0 = RequestRecipient(
        request_id=req1.id,
        blood_bank_id=banks[0].id,
        status=ResponseStatus.CONFIRMED,
        available_units_reported=2,
        response_note='We can coordinate 2 PRBC O- units upon receipt of crossmatch pilot sample tube & requisition form.',
        action_by_name='Kavita Deshmukh',
        responded_at=now - timedelta(minutes=45)
    )
    # Recipient bank 1 (SBTC Centre): Acknowledged / Searching
    rec1_b1 = RequestRecipient(
        request_id=req1.id,
        blood_bank_id=banks[1].id,
        status=ResponseStatus.ACKNOWLEDGED,
        available_units_reported=None,
        response_note='Checking inventory in secondary quarantine unit. Will update in 15 mins.',
        action_by_name='Sunil Varma',
        responded_at=now - timedelta(minutes=30)
    )
    # Recipient bank 2 (Samarpan): Not Available
    rec1_b2 = RequestRecipient(
        request_id=req1.id,
        blood_bank_id=banks[2].id,
        status=ResponseStatus.NOT_AVAILABLE,
        available_units_reported=0,
        response_note='Current stock of O- is 0 units. We have informed our voluntary call list.',
        action_by_name='Deepak Joshi',
        responded_at=now - timedelta(minutes=50)
    )
    db.session.add_all([rec1_b0, rec1_b1, rec1_b2])

    # Events for Request 1
    events_req1 = [
        RequestEvent(
            request_id=req1.id,
            event_type='REQUEST_CREATED',
            institution_name=hospitals[0].name,
            actor_name='Dr. Ananya Sen',
            details='Emergency request registered for 3 units of PRBC (O-) with Critical urgency.',
            timestamp=now - timedelta(hours=1, minutes=15)
        ),
        RequestEvent(
            request_id=req1.id,
            event_type='ROUTED_TO_PARTNERS',
            institution_name='BloodLink Dispatch Engine',
            actor_name='SYSTEM',
            details='Dispatched coordination alert to 3 verified blood banks in Mumbai City/Suburban cluster.',
            timestamp=now - timedelta(hours=1, minutes=14)
        ),
        RequestEvent(
            request_id=req1.id,
            event_type='BANK_RESPONDED',
            institution_name=banks[2].name,
            actor_name='Deepak Joshi',
            details='Reported Not Available (0 units available).',
            timestamp=now - timedelta(minutes=50)
        ),
        RequestEvent(
            request_id=req1.id,
            event_type='AVAILABILITY_CONFIRMED',
            institution_name=banks[0].name,
            actor_name='Kavita Deshmukh',
            details='Confirmed 2 units reported ready for manual crossmatch protocol.',
            timestamp=now - timedelta(minutes=45)
        ),
        RequestEvent(
            request_id=req1.id,
            event_type='BANK_ACKNOWLEDGED',
            institution_name=banks[1].name,
            actor_name='Sunil Varma',
            details='Acknowledged request and currently auditing reserve storage.',
            timestamp=now - timedelta(minutes=30)
        )
    ]
    db.session.add_all(events_req1)

    # Scenario 2: Public Caregiver Request
    req2 = BloodRequest(
        reference_no='BL-PUB-2026-1044',
        created_by_user_id=created_users['public@bloodlink.org'].id,
        hospital_id=hospitals[1].id, # Lilavati
        hospital_name=hospitals[1].name,
        hospital_location='Bandra West, Mumbai Suburban',
        treating_department='Oncology Daycare Ward',
        patient_ref='LIL-ONC-331',
        blood_group='B+',
        component=BloodComponent.PLATELETS,
        quantity=2,
        urgency=UrgencyLevel.HIGH,
        required_by='Within 6 Hours',
        clinical_notes='Scheduled chemotherapy thrombocytopenia. Platelet count below 18,000.',
        contact_person='Rohit K. Mehta (Son/Caregiver)',
        contact_phone_masked='+91 98333 •••••',
        status=RequestStatus.PENDING,
        created_at=now - timedelta(minutes=35),
        updated_at=now - timedelta(minutes=35)
    )
    db.session.add(req2)
    db.session.flush()

    rec2_b0 = RequestRecipient(
        request_id=req2.id,
        blood_bank_id=banks[0].id,
        status=ResponseStatus.SENT,
        created_at=now - timedelta(minutes=34)
    )
    rec2_b1 = RequestRecipient(
        request_id=req2.id,
        blood_bank_id=banks[1].id,
        status=ResponseStatus.SENT,
        created_at=now - timedelta(minutes=34)
    )
    db.session.add_all([rec2_b0, rec2_b1])

    db.session.add(RequestEvent(
        request_id=req2.id,
        event_type='PUBLIC_REQUEST_SUBMITTED',
        institution_name='Lilavati Hospital & Research Centre (Attending)',
        actor_name='Rohit K. Mehta',
        details='Public caregiver emergency coordination request created. Awaiting hospital transfusion confirmation.',
        timestamp=now - timedelta(minutes=35)
    ))

    # 8. Notifications
    notifs = [
        Notification(
            user_id=created_users['hospital@bloodlink.org'].id,
            role_target=Role.HOSPITAL,
            title='Availability Confirmed for BL-MUM-2026-8812',
            message='Tata Memorial Centre Blood Bank confirmed 2 units of PRBC (O-). Click to coordinate pickup.',
            channel='IN_APP',
            created_at=now - timedelta(minutes=44)
        ),
        Notification(
            user_id=created_users['bank@bloodlink.org'].id,
            role_target=Role.BLOOD_BANK,
            title='New Critical Blood Alert [O-]',
            message='KEM Hospital requires 3 units of PRBC (O-) within 2 hours. Review queue.',
            channel='IN_APP',
            created_at=now - timedelta(hours=1, minutes=14)
        ),
        Notification(
            user_id=created_users['public@bloodlink.org'].id,
            role_target=Role.PUBLIC,
            title='Emergency Request BL-PUB-2026-1044 Dispatched',
            message='Your request has been routed to 2 nearby verified blood centres. Please keep the patient requisition slip ready.',
            channel='IN_APP',
            created_at=now - timedelta(minutes=34)
        ),
        Notification(
            user_id=created_users['admin@bloodlink.org'].id,
            role_target=Role.ADMIN,
            title='New Institutional Verification Pending',
            message='Sanjeevani Voluntary Blood Bank has uploaded Form 28C application. Review required.',
            channel='IN_APP',
            created_at=now - timedelta(hours=3)
        )
    ]
    db.session.add_all(notifs)

    # 9. Audit Logs
    audit_entries = [
        AuditLog(
            action='SEED_SYSTEM_BOOT',
            actor_email='admin@bloodlink.org',
            actor_role=Role.ADMIN,
            resource_type='SYSTEM',
            details='Initial verified Mumbai medical network bootstrap loaded.',
            timestamp=now - timedelta(hours=4)
        ),
        AuditLog(
            action='REQUEST_DISPATCH',
            actor_email='hospital@bloodlink.org',
            actor_role=Role.HOSPITAL,
            resource_type='BLOOD_REQUEST',
            resource_id='BL-MUM-2026-8812',
            details='Emergency request dispatched to 3 blood bank partners.',
            timestamp=now - timedelta(hours=1, minutes=15)
        )
    ]
    db.session.add_all(audit_entries)

    db.session.commit()
    print("Database seeding completed successfully.")
