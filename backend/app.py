import os
import random
from datetime import datetime, timezone, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import (
    db, User, Institution, InstitutionDocument, BloodInventory,
    BloodRequest, RequestRecipient, RequestEvent, DonorProfile,
    Notification, AuditLog, Role, VerificationStatus, RequestStatus,
    ResponseStatus, UrgencyLevel, BloodComponent, BloodGroup
)
from auth import generate_token, token_required, roles_required, log_audit
from seed import seed_database

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    with app.app_context():
        db.create_all()
        seed_database()

    # ----------------------------------------------------
    # SYSTEM & HEALTH CHECK
    # ----------------------------------------------------
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'platform': 'BloodLink Emergency Blood Coordination Platform (Mumbai Prototype)',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'stale_threshold_hours': app.config.get('STALE_INVENTORY_HOURS', 6),
            'disclaimer': 'Platform strictly coordinates availability communication between licensed blood centres and hospitals. No blood sales, no medical suitability decisions.'
        })

    # ----------------------------------------------------
    # AUTHENTICATION & DEMO ROLES
    # ----------------------------------------------------
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json() or {}
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({'error': 'Email and password are required.'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password.'}), 401

        if not user.is_active:
            return jsonify({'error': 'This account has been deactivated or suspended.'}), 403

        token = generate_token(user)
        log_audit('USER_LOGIN', 'AUTH', actor=user, details=f"User logged in as role {user.role}")

        return jsonify({
            'token': token,
            'user': user.to_dict()
        })

    @app.route('/api/auth/demo-switch', methods=['POST'])
    def demo_switch():
        """Allows 1-click role exploration for reviewers using fictional seed profiles."""
        data = request.get_json() or {}
        target_role = data.get('role', Role.HOSPITAL)

        demo_emails = {
            Role.HOSPITAL: 'hospital@bloodlink.org',
            Role.BLOOD_BANK: 'bank@bloodlink.org',
            Role.PUBLIC: 'public@bloodlink.org',
            Role.DONOR: 'donor@bloodlink.org',
            Role.ADMIN: 'admin@bloodlink.org'
        }

        email = demo_emails.get(target_role)
        if not email:
            return jsonify({'error': 'Unknown role selection for demo'}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'Demo user not found. Did the database seed?'}), 500

        token = generate_token(user)
        log_audit('DEMO_ROLE_SWITCH', 'AUTH', actor=user, details=f"Switched to demo role {target_role}")

        return jsonify({
            'token': token,
            'user': user.to_dict(),
            'demo_mode': True
        })

    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json() or {}
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        role = data.get('role', Role.PUBLIC)
        phone = data.get('phone', '').strip()

        # Guard rails for registration
        if not email or not password or not name:
            return jsonify({'error': 'Name, email and password are required.'}), 400

        if role == Role.ADMIN:
            return jsonify({'error': 'Platform administrator accounts cannot be self-registered.'}), 403

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'An account with this email address already exists.'}), 409

        # Institution self-registration creates a pending verification entity
        institution_id = None
        if role in [Role.HOSPITAL, Role.BLOOD_BANK]:
            inst_name = data.get('institution_name', '').strip()
            inst_district = data.get('district', 'Mumbai City')
            inst_suburb = data.get('suburb', 'Central')
            inst_address = data.get('address', 'Mumbai Address Pending Review')
            license_no = data.get('license_number', 'PENDING-LIC-000')

            if not inst_name:
                return jsonify({'error': 'Institution name is required for healthcare accounts.'}), 400

            new_inst = Institution(
                name=f"{inst_name} (PENDING VERIFICATION)",
                institution_type=role,
                license_number=license_no,
                verification_status=VerificationStatus.PENDING,
                district=inst_district,
                suburb=inst_suburb,
                address=inst_address,
                contact_phone=phone or '+91 22 0000 0000',
                contact_email=email,
                is_demo=True
            )
            db.session.add(new_inst)
            db.session.flush()
            institution_id = new_inst.id

            # Add placeholder document record for review
            db.session.add(InstitutionDocument(
                institution_id=institution_id,
                doc_type='Statutory License & Registration Form',
                doc_reference=f"REF-{random.randint(10000, 99999)}",
                status='Awaiting Admin Verification'
            ))

        # Masked phone for privacy
        masked_phone = f"+91 {phone[:2]}••••••{phone[-2:]}" if len(phone) >= 10 else "+91 ••••••••••"

        new_user = User(
            email=email,
            name=name,
            role=role,
            phone_masked=masked_phone,
            institution_id=institution_id
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.flush()

        if role == Role.DONOR:
            donor_profile = DonorProfile(
                user_id=new_user.id,
                blood_group=data.get('blood_group', 'O+'),
                district=data.get('district', 'Mumbai City'),
                suburb=data.get('suburb', 'General'),
                willing_to_donate=True,
                notify_email=True
            )
            db.session.add(donor_profile)

        db.session.commit()
        token = generate_token(new_user)
        log_audit('USER_REGISTERED', 'USER', actor=new_user, resource_id=new_user.id, details=f"Registered as {role}")

        return jsonify({
            'message': 'Registration successful.',
            'token': token,
            'user': new_user.to_dict(),
            'pending_verification': role in [Role.HOSPITAL, Role.BLOOD_BANK]
        }), 201

    @app.route('/api/auth/me', methods=['GET'])
    @token_required
    def get_me(user):
        return jsonify({
            'user': user.to_dict(),
            'donor_profile': user.donor_profile.to_dict() if user.donor_profile else None
        })

    # ----------------------------------------------------
    # PUBLIC TRANSPARENCY & VERIFIED BLOOD BANK DIRECTORY
    # ----------------------------------------------------
    @app.route('/api/public/verified-banks', methods=['GET'])
    def get_verified_banks():
        """Public list of participating verified blood banks with recent stock updates and timestamps."""
        district = request.args.get('district')
        query = Institution.query.filter_by(
            institution_type='blood_bank',
            verification_status=VerificationStatus.VERIFIED
        )
        if district:
            query = query.filter_by(district=district)

        banks = query.all()
        results = []
        stale_hours = app.config.get('STALE_INVENTORY_HOURS', 6)

        for b in banks:
            b_dict = b.to_dict()
            # Attach inventory items
            inv_items = [i.to_dict(hours_threshold=stale_hours) for i in b.inventory]
            # Find latest update time across items
            latest_time = None
            if inv_items:
                times = [i['last_updated'] for i in inv_items if i['last_updated']]
                if times:
                    latest_time = max(times)
            b_dict['inventory'] = inv_items
            b_dict['latest_inventory_update'] = latest_time
            results.append(b_dict)

        return jsonify({
            'verified_blood_banks': results,
            'total_count': len(results),
            'stale_threshold_hours': stale_hours,
            'regulatory_notice': 'Verified blood centres operate under Form 28C licenses in Maharashtra. Blood availability is dynamic and subject to physical crossmatch and doctor prescription.'
        })

    # ----------------------------------------------------
    # EMERGENCY REQUESTS (HOSPITAL & PUBLIC CAREGIVERS)
    # ----------------------------------------------------
    @app.route('/api/requests', methods=['GET'])
    @token_required
    def list_requests(user):
        query = BloodRequest.query

        # Enforce strict data isolation
        if user.role == Role.HOSPITAL:
            if user.institution_id:
                query = query.filter_by(hospital_id=user.institution_id)
            else:
                query = query.filter_by(created_by_user_id=user.id)
        elif user.role == Role.BLOOD_BANK:
            # Blood banks only see requests routed to them
            if not user.institution_id:
                return jsonify({'requests': []})
            query = query.join(RequestRecipient).filter(RequestRecipient.blood_bank_id == user.institution_id)
        elif user.role == Role.PUBLIC:
            # Public caregivers only see requests they initiated
            query = query.filter_by(created_by_user_id=user.id)
        elif user.role == Role.ADMIN:
            # Administrator can see all requests for platform monitoring
            pass
        elif user.role == Role.DONOR:
            # Donors do not have direct access to patient emergency requests
            return jsonify({'requests': [], 'notice': 'Donor accounts cannot view clinical hospital requests directly.'})

        # Sorting: newest first
        requests_list = query.order_by(BloodRequest.created_at.desc()).all()
        return jsonify({
            'requests': [r.to_dict() for r in requests_list]
        })

    @app.route('/api/requests/<int:req_id>', methods=['GET'])
    @token_required
    def get_request_details(user, req_id):
        blood_req = BloodRequest.query.get_or_404(req_id)

        # Access check
        if user.role == Role.PUBLIC and blood_req.created_by_user_id != user.id:
            return jsonify({'error': 'Unauthorized to view this emergency coordination record.'}), 403
        if user.role == Role.HOSPITAL and user.institution_id and blood_req.hospital_id != user.institution_id:
            return jsonify({'error': 'Unauthorized: Hospital isolation boundary enforced.'}), 403
        if user.role == Role.BLOOD_BANK and user.institution_id:
            is_recipient = any(r.blood_bank_id == user.institution_id for r in blood_req.recipients)
            if not is_recipient:
                return jsonify({'error': 'Unauthorized: This request was not routed to your institution.'}), 403

        data = blood_req.to_dict()
        data['events'] = [e.to_dict() for e in blood_req.events]
        return jsonify({'request': data})

    @app.route('/api/requests', methods=['POST'])
    @token_required
    @roles_required(Role.HOSPITAL, Role.PUBLIC)
    def create_request(user):
        data = request.get_json() or {}

        # Validation
        blood_group = data.get('blood_group')
        component = data.get('component')
        quantity = data.get('quantity')
        urgency = data.get('urgency', UrgencyLevel.CRITICAL)
        required_by = data.get('required_by')
        patient_ref = data.get('patient_ref', '').strip()
        hospital_name = data.get('hospital_name', '').strip()
        hospital_location = data.get('hospital_location', '').strip()
        contact_person = data.get('contact_person', user.name)
        clinical_notes = data.get('clinical_notes', '')

        if not blood_group or not component or not quantity or not required_by or not patient_ref:
            return jsonify({'error': 'Missing required fields: blood_group, component, quantity, required_by, and patient_ref.'}), 400

        try:
            quantity = int(quantity)
            if quantity <= 0 or quantity > 50:
                return jsonify({'error': 'Quantity must be a valid number of units between 1 and 50.'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid quantity.'}), 400

        # Duplicate check: check if the same institution/user requested the identical group & component in the last 15 minutes
        recent_threshold = datetime.now(timezone.utc) - timedelta(minutes=15)
        existing = BloodRequest.query.filter(
            BloodRequest.created_by_user_id == user.id,
            BloodRequest.blood_group == blood_group,
            BloodRequest.component == component,
            BloodRequest.patient_ref == patient_ref,
            BloodRequest.created_at >= recent_threshold,
            BloodRequest.status.in_([RequestStatus.PENDING, RequestStatus.ACTIVE, RequestStatus.PARTIALLY_RESPONDED])
        ).first()

        force_override = data.get('force_duplicate_override', False)
        if existing and not force_override:
            return jsonify({
                'warning': 'DUPLICATE_SUSPECTED',
                'message': f"A request for patient ref '{patient_ref}' with {quantity} units of {blood_group} {component} was submitted {int((datetime.now(timezone.utc)-existing.created_at.replace(tzinfo=timezone.utc)).total_seconds()//60)} minutes ago (Ref: {existing.reference_no}).",
                'existing_reference': existing.reference_no
            }), 409

        # Auto reference number
        ref_no = f"BL-{'HOSP' if user.role == Role.HOSPITAL else 'PUB'}-2026-{random.randint(1000, 9999)}"

        new_req = BloodRequest(
            reference_no=ref_no,
            created_by_user_id=user.id,
            hospital_id=user.institution_id if user.role == Role.HOSPITAL else None,
            hospital_name=user.institution.name if user.institution else hospital_name or 'Caregiver Attending Hospital',
            hospital_location=user.institution.suburb if user.institution else hospital_location or 'Mumbai',
            treating_department=data.get('treating_department', 'Emergency Department'),
            patient_ref=patient_ref,
            blood_group=blood_group,
            component=component,
            quantity=quantity,
            urgency=urgency,
            required_by=required_by,
            clinical_notes=clinical_notes,
            contact_person=contact_person,
            contact_phone_masked=user.phone_masked or '+91 ••••••••••',
            status=RequestStatus.ACTIVE
        )
        db.session.add(new_req)
        db.session.flush()

        # Route to verified blood banks
        # If target_bank_ids specified by hospital, use those; otherwise route to all verified blood banks in the district/nearby
        target_bank_ids = data.get('target_bank_ids', [])
        if target_bank_ids:
            eligible_banks = Institution.query.filter(
                Institution.id.in_(target_bank_ids),
                Institution.institution_type == 'blood_bank',
                Institution.verification_status == VerificationStatus.VERIFIED
            ).all()
        else:
            eligible_banks = Institution.query.filter_by(
                institution_type='blood_bank',
                verification_status=VerificationStatus.VERIFIED
            ).all()

        recipient_count = 0
        for bank in eligible_banks:
            rec = RequestRecipient(
                request_id=new_req.id,
                blood_bank_id=bank.id,
                status=ResponseStatus.SENT
            )
            db.session.add(rec)
            recipient_count += 1

            # In-app notification for the blood bank team
            db.session.add(Notification(
                role_target=Role.BLOOD_BANK,
                title=f"URGENT: {blood_group} {component} Requirement",
                message=f"Request {new_req.reference_no} from {new_req.hospital_name} ({quantity} units needed {required_by}).",
                channel='IN_APP'
            ))

        # Create audit event
        db.session.add(RequestEvent(
            request_id=new_req.id,
            event_type='REQUEST_CREATED',
            institution_name=new_req.hospital_name,
            actor_name=user.name,
            details=f"Created emergency coordination requirement for {quantity} unit(s) of {blood_group} {component}. Urgency: {urgency}. Dispatched to {recipient_count} verified blood centre(s)."
        ))

        db.session.commit()
        log_audit('CREATE_REQUEST', 'BLOOD_REQUEST', actor=user, resource_id=new_req.id, details=f"Reference {ref_no}")

        return jsonify({
            'message': 'Emergency request successfully created and routed to partner blood centres.',
            'request': new_req.to_dict(),
            'dispatched_banks_count': recipient_count
        }), 201

    @app.route('/api/requests/<int:req_id>/cancel', methods=['POST'])
    @token_required
    def cancel_request(user, req_id):
        blood_req = BloodRequest.query.get_or_404(req_id)

        # Permission check
        if user.role != Role.ADMIN and blood_req.created_by_user_id != user.id:
            return jsonify({'error': 'Unauthorized to cancel this request.'}), 403

        if blood_req.status in [RequestStatus.CLOSED, RequestStatus.CANCELLED]:
            return jsonify({'error': f"Request is already in {blood_req.status} status."}), 400

        data = request.get_json() or {}
        reason = data.get('reason', 'Cancelled by authorized requester.')

        blood_req.status = RequestStatus.CANCELLED
        for rec in blood_req.recipients:
            rec.status = ResponseStatus.CANCELLED

        db.session.add(RequestEvent(
            request_id=blood_req.id,
            event_type='REQUEST_CANCELLED',
            institution_name=blood_req.hospital_name,
            actor_name=user.name,
            details=f"Emergency request marked as cancelled. Reason: {reason}"
        ))

        db.session.commit()
        log_audit('CANCEL_REQUEST', 'BLOOD_REQUEST', actor=user, resource_id=blood_req.id, details=reason)

        return jsonify({
            'message': 'Request marked as cancelled.',
            'request': blood_req.to_dict()
        })

    # ----------------------------------------------------
    # BLOOD BANK ACTIONS: RESPONDING & STOCK CONTROL
    # ----------------------------------------------------
    @app.route('/api/blood-bank/requests/<int:req_id>/respond', methods=['POST'])
    @token_required
    @roles_required(Role.BLOOD_BANK)
    def respond_to_request(user, req_id):
        if not user.institution_id:
            return jsonify({'error': 'User is not linked to a verified blood bank institution.'}), 403

        blood_req = BloodRequest.query.get_or_404(req_id)
        recipient = RequestRecipient.query.filter_by(
            request_id=blood_req.id,
            blood_bank_id=user.institution_id
        ).first()

        if not recipient:
            return jsonify({'error': 'This emergency request was not routed to your institution.'}), 404

        data = request.get_json() or {}
        response_type = data.get('status') # 'Availability Confirmed', 'Not Available', 'More Information Required', 'Acknowledged'
        available_units = data.get('available_units_reported')
        note = data.get('response_note', '').strip()

        valid_statuses = [
            ResponseStatus.CONFIRMED,
            ResponseStatus.NOT_AVAILABLE,
            ResponseStatus.MORE_INFO_REQUIRED,
            ResponseStatus.ACKNOWLEDGED
        ]
        if response_type not in valid_statuses:
            return jsonify({'error': f"Invalid response status. Must be one of: {valid_statuses}"}), 400

        recipient.status = response_type
        recipient.available_units_reported = int(available_units) if available_units is not None else None
        recipient.response_note = note
        recipient.action_by_name = user.name
        recipient.responded_at = datetime.now(timezone.utc)

        # Update overall request state if at least one bank confirmed
        if response_type == ResponseStatus.CONFIRMED:
            blood_req.status = RequestStatus.CONFIRMED
        elif blood_req.status == RequestStatus.ACTIVE:
            blood_req.status = RequestStatus.PARTIALLY_RESPONDED

        # Record audit event
        inst_name = user.institution.name if user.institution else 'Blood Centre'
        db.session.add(RequestEvent(
            request_id=blood_req.id,
            event_type='BANK_RESPONDED',
            institution_name=inst_name,
            actor_name=user.name,
            details=f"Response: '{response_type}'. Reported Units: {available_units or 0}. Note: {note or 'None'}. Transfusion verification & sample crossmatch required upon physical collection."
        ))

        # Notify hospital / requester
        db.session.add(Notification(
            user_id=blood_req.created_by_user_id,
            title=f"Response Update: {inst_name}",
            message=f"{inst_name} updated status to '{response_type}' for Ref {blood_req.reference_no}.",
            channel='IN_APP'
        ))

        db.session.commit()
        log_audit('RESPOND_REQUEST', 'REQUEST_RECIPIENT', actor=user, resource_id=recipient.id, details=f"Status: {response_type}")

        return jsonify({
            'message': 'Blood bank response recorded in event timeline.',
            'recipient': recipient.to_dict(),
            'request': blood_req.to_dict()
        })

    # ----------------------------------------------------
    # HOSPITAL SELECTING A BANK FOR CONTACT / FOLLOW-UP
    # ----------------------------------------------------
    @app.route('/api/hospital/requests/<int:req_id>/select-bank', methods=['POST'])
    @token_required
    @roles_required(Role.HOSPITAL, Role.ADMIN)
    def hospital_select_bank(user, req_id):
        blood_req = BloodRequest.query.get_or_404(req_id)
        data = request.get_json() or {}
        bank_id = data.get('bank_id')

        bank = Institution.query.get(bank_id)
        if not bank or bank.institution_type != 'blood_bank':
            return jsonify({'error': 'Selected institution is not a valid blood bank.'}), 400

        blood_req.selected_bank_id = bank.id
        db.session.add(RequestEvent(
            request_id=blood_req.id,
            event_type='BANK_SELECTED_FOR_FOLLOWUP',
            institution_name=blood_req.hospital_name,
            actor_name=user.name,
            details=f"Hospital transfusion team selected {bank.name} for official phone/transport coordination. (Units are not automatically deducted; physical pilot tube crossmatching is mandatory)."
        ))

        db.session.commit()
        log_audit('SELECT_BANK_COORDINATION', 'BLOOD_REQUEST', actor=user, resource_id=blood_req.id, details=f"Selected bank {bank.name}")

        return jsonify({
            'message': f"Selected {bank.name} for follow-up coordination.",
            'request': blood_req.to_dict()
        })

    # ----------------------------------------------------
    # BLOOD INVENTORY (BLOOD BANK SPECIFIC)
    # ----------------------------------------------------
    @app.route('/api/inventory', methods=['GET'])
    @token_required
    def get_inventory(user):
        stale_hours = app.config.get('STALE_INVENTORY_HOURS', 6)
        query = BloodInventory.query

        if user.role == Role.BLOOD_BANK and user.institution_id:
            query = query.filter_by(institution_id=user.institution_id)

        items = query.all()
        return jsonify({
            'inventory': [i.to_dict(hours_threshold=stale_hours) for i in items],
            'stale_threshold_hours': stale_hours
        })

    @app.route('/api/inventory/update', methods=['POST'])
    @token_required
    @roles_required(Role.BLOOD_BANK)
    def update_inventory(user):
        if not user.institution_id:
            return jsonify({'error': 'User not associated with a blood centre institution.'}), 403

        data = request.get_json() or {}
        component = data.get('component')
        blood_group = data.get('blood_group')
        available_units = data.get('available_units')
        reserved_units = data.get('reserved_units', 0)
        notes = data.get('notes', '')

        if not component or not blood_group or available_units is None:
            return jsonify({'error': 'Component, blood group and available units are required.'}), 400

        try:
            available_units = int(available_units)
            reserved_units = int(reserved_units)
            if available_units < 0 or reserved_units < 0:
                raise ValueError()
        except ValueError:
            return jsonify({'error': 'Units must be non-negative integers.'}), 400

        inv = BloodInventory.query.filter_by(
            institution_id=user.institution_id,
            component=component,
            blood_group=blood_group
        ).first()

        now = datetime.now(timezone.utc)
        if inv:
            inv.available_units = available_units
            inv.reserved_units = reserved_units
            inv.notes = notes
            inv.last_updated = now
        else:
            inv = BloodInventory(
                institution_id=user.institution_id,
                component=component,
                blood_group=blood_group,
                available_units=available_units,
                reserved_units=reserved_units,
                notes=notes,
                last_updated=now
            )
            db.session.add(inv)

        db.session.commit()
        log_audit('UPDATE_INVENTORY', 'INVENTORY', actor=user, resource_id=inv.id, details=f"{blood_group} {component}: {available_units} units")

        return jsonify({
            'message': 'Inventory status updated successfully.',
            'inventory_item': inv.to_dict(hours_threshold=app.config.get('STALE_INVENTORY_HOURS', 6))
        })

    # ----------------------------------------------------
    # DONOR DIRECTORY & SETTINGS (OPT-IN ONLY)
    # ----------------------------------------------------
    @app.route('/api/donor/profile', methods=['GET', 'POST'])
    @token_required
    @roles_required(Role.DONOR)
    def manage_donor_profile(user):
        profile = user.donor_profile
        if request.method == 'GET':
            return jsonify({
                'profile': profile.to_dict() if profile else None,
                'disclaimer': 'Voluntary donor registration. No clinical suitability guarantee. Donors are not paid and cannot be sold. Final physical screening by blood bank staff is required.'
            })

        data = request.get_json() or {}
        if not profile:
            profile = DonorProfile(user_id=user.id)
            db.session.add(profile)

        if 'blood_group' in data:
            profile.blood_group = data['blood_group']
        if 'district' in data:
            profile.district = data['district']
        if 'suburb' in data:
            profile.suburb = data['suburb']
        if 'willing_to_donate' in data:
            profile.willing_to_donate = bool(data['willing_to_donate'])
        if 'notify_email' in data:
            profile.notify_email = bool(data['notify_email'])
        if 'notify_sms' in data:
            profile.notify_sms = bool(data['notify_sms'])
        if 'last_donation_date' in data:
            profile.last_donation_date = data['last_donation_date']

        db.session.commit()
        log_audit('UPDATE_DONOR_PROFILE', 'DONOR', actor=user, details='Updated voluntary preferences')

        return jsonify({
            'message': 'Donor preferences updated.',
            'profile': profile.to_dict()
        })

    # ----------------------------------------------------
    # PLATFORM ADMIN DASHBOARD & VERIFICATION QUEUE
    # ----------------------------------------------------
    @app.route('/api/admin/overview', methods=['GET'])
    @token_required
    @roles_required(Role.ADMIN)
    def admin_overview(user):
        total_users = User.query.count()
        total_hospitals = Institution.query.filter_by(institution_type='hospital').count()
        total_blood_banks = Institution.query.filter_by(institution_type='blood_bank').count()
        pending_verifications = Institution.query.filter_by(verification_status=VerificationStatus.PENDING).count()
        total_requests = BloodRequest.query.count()
        active_requests = BloodRequest.query.filter_by(status=RequestStatus.ACTIVE).count()

        recent_audits = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(20).all()
        institutions = Institution.query.all()

        return jsonify({
            'stats': {
                'total_users': total_users,
                'total_hospitals': total_hospitals,
                'total_blood_banks': total_blood_banks,
                'pending_verifications': pending_verifications,
                'total_requests': total_requests,
                'active_requests': active_requests
            },
            'institutions': [inst.to_dict() for inst in institutions],
            'recent_audits': [a.to_dict() for a in recent_audits],
            'stale_threshold_hours': app.config.get('STALE_INVENTORY_HOURS', 6)
        })

    @app.route('/api/admin/institutions/<int:inst_id>/verify', methods=['POST'])
    @token_required
    @roles_required(Role.ADMIN)
    def verify_institution(user, inst_id):
        inst = Institution.query.get_or_404(inst_id)
        data = request.get_json() or {}
        new_status = data.get('status') # 'verified', 'rejected', 'suspended'

        if new_status not in [VerificationStatus.VERIFIED, VerificationStatus.REJECTED, VerificationStatus.SUSPENDED]:
            return jsonify({'error': 'Invalid status'}), 400

        inst.verification_status = new_status
        db.session.commit()
        log_audit('VERIFY_INSTITUTION', 'INSTITUTION', actor=user, resource_id=inst.id, details=f"Status set to {new_status}")

        return jsonify({
            'message': f"Institution status updated to {new_status}.",
            'institution': inst.to_dict()
        })

    @app.route('/api/admin/config/stale-threshold', methods=['POST'])
    @token_required
    @roles_required(Role.ADMIN)
    def update_stale_threshold(user):
        data = request.get_json() or {}
        hours = data.get('hours')
        try:
            hours = int(hours)
            if hours < 1 or hours > 48:
                return jsonify({'error': 'Hours must be between 1 and 48.'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid number'}), 400

        app.config['STALE_INVENTORY_HOURS'] = hours
        log_audit('UPDATE_CONFIG', 'SYSTEM', actor=user, details=f"Stale inventory threshold changed to {hours} hours")

        return jsonify({
            'message': f"Stale threshold updated to {hours} hours.",
            'stale_threshold_hours': hours
        })

    # ----------------------------------------------------
    # NOTIFICATIONS
    # ----------------------------------------------------
    @app.route('/api/notifications', methods=['GET'])
    @token_required
    def get_notifications(user):
        notifs = Notification.query.filter(
            (Notification.user_id == user.id) | (Notification.role_target == user.role)
        ).order_by(Notification.created_at.desc()).limit(30).all()

        return jsonify({
            'notifications': [n.to_dict() for n in notifs]
        })

    @app.route('/api/notifications/<int:notif_id>/read', methods=['POST'])
    @token_required
    def mark_notification_read(user, notif_id):
        notif = Notification.query.get_or_404(notif_id)
        notif.is_read = True
        db.session.commit()
        return jsonify({'message': 'Notification marked as read.'})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
