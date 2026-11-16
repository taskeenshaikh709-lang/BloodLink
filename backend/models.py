from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Role:
    PUBLIC = 'public'
    HOSPITAL = 'hospital'
    BLOOD_BANK = 'blood_bank'
    DONOR = 'donor'
    ADMIN = 'admin'
    ALL_ROLES = [PUBLIC, HOSPITAL, BLOOD_BANK, DONOR, ADMIN]

class VerificationStatus:
    PENDING = 'pending'
    VERIFIED = 'verified'
    REJECTED = 'rejected'
    SUSPENDED = 'suspended'

class RequestStatus:
    DRAFT = 'draft'
    PENDING = 'pending'
    ACTIVE = 'active'
    PARTIALLY_RESPONDED = 'partially_responded'
    CONFIRMED = 'confirmed'
    CANCELLED = 'cancelled'
    CLOSED = 'closed'

class ResponseStatus:
    SENT = 'Sent'
    DELIVERED = 'Delivered'
    ACKNOWLEDGED = 'Acknowledged'
    CONFIRMED = 'Availability Confirmed'
    NOT_AVAILABLE = 'Not Available'
    MORE_INFO_REQUIRED = 'More Information Required'
    CANCELLED = 'Cancelled'
    CLOSED = 'Closed'

class UrgencyLevel:
    CRITICAL = 'critical' # within 1-2 hours
    HIGH = 'high'         # within 4-6 hours
    STANDARD = 'standard' # within 12-24 hours

class BloodComponent:
    WHOLE_BLOOD = 'Whole Blood'
    PRBC = 'Packed Red Blood Cells (PRBC)'
    PLATELETS = 'Platelet Concentrate (RDP)'
    SDP = 'Single Donor Platelets (SDP)'
    FFP = 'Fresh Frozen Plasma (FFP)'
    CRYOPRECIPITATE = 'Cryoprecipitate'
    ALL = [WHOLE_BLOOD, PRBC, PLATELETS, SDP, FFP, CRYOPRECIPITATE]

class BloodGroup:
    A_POS = 'A+'
    A_NEG = 'A-'
    B_POS = 'B+'
    B_NEG = 'B-'
    AB_POS = 'AB+'
    AB_NEG = 'AB-'
    O_POS = 'O+'
    O_NEG = 'O-'
    ALL = [A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG]

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(32), nullable=False, default=Role.PUBLIC)
    phone_masked = db.Column(db.String(32), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relations
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=True)
    institution = db.relationship('Institution', back_populates='users')
    donor_profile = db.relationship('DonorProfile', back_populates='user', uselist=False, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'phone_masked': self.phone_masked,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'institution_id': self.institution_id,
            'institution_name': self.institution.name if self.institution else None
        }

class Institution(db.Model):
    __tablename__ = 'institutions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, index=True)
    institution_type = db.Column(db.String(32), nullable=False) # 'hospital' or 'blood_bank'
    license_number = db.Column(db.String(64), nullable=True) # Demo SBTC/FDA license format
    verification_status = db.Column(db.String(32), default=VerificationStatus.PENDING)
    district = db.Column(db.String(64), nullable=False) # Mumbai City, Mumbai Suburban, Thane, Navi Mumbai
    suburb = db.Column(db.String(64), nullable=False) # e.g. Dadar, Andheri, Bandra, Vashi, Parel
    address = db.Column(db.String(255), nullable=False)
    contact_phone = db.Column(db.String(32), nullable=False)
    emergency_contact = db.Column(db.String(32), nullable=True)
    contact_email = db.Column(db.String(120), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    is_demo = db.Column(db.Boolean, default=True)
    operating_hours = db.Column(db.String(64), default='24 Hours Emergency')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relations
    users = db.relationship('User', back_populates='institution')
    inventory = db.relationship('BloodInventory', back_populates='institution', cascade='all, delete-orphan')
    documents = db.relationship('InstitutionDocument', back_populates='institution', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'institution_type': self.institution_type,
            'license_number': self.license_number,
            'verification_status': self.verification_status,
            'district': self.district,
            'suburb': self.suburb,
            'address': self.address,
            'contact_phone': self.contact_phone,
            'emergency_contact': self.emergency_contact,
            'contact_email': self.contact_email,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'is_demo': self.is_demo,
            'operating_hours': self.operating_hours,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class InstitutionDocument(db.Model):
    __tablename__ = 'institution_documents'

    id = db.Column(db.Integer, primary_key=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=False)
    doc_type = db.Column(db.String(64), nullable=False) # Form 28C, SBTC NOC, Fire Safety, Clinical Establishment Reg
    doc_reference = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(32), default='Verified Demo')
    submitted_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    institution = db.relationship('Institution', back_populates='documents')

    def to_dict(self):
        return {
            'id': self.id,
            'institution_id': self.institution_id,
            'doc_type': self.doc_type,
            'doc_reference': self.doc_reference,
            'status': self.status,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None
        }

class BloodInventory(db.Model):
    __tablename__ = 'blood_inventory'

    id = db.Column(db.Integer, primary_key=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=False, index=True)
    component = db.Column(db.String(64), nullable=False)
    blood_group = db.Column(db.String(16), nullable=False)
    available_units = db.Column(db.Integer, nullable=False, default=0)
    reserved_units = db.Column(db.Integer, nullable=False, default=0) # Internal physical hold
    last_updated = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    notes = db.Column(db.String(255), nullable=True)

    institution = db.relationship('Institution', back_populates='inventory')

    def is_stale(self, hours_threshold=6):
        if not self.last_updated:
            return True
        diff = datetime.now(timezone.utc) - self.last_updated.replace(tzinfo=timezone.utc if self.last_updated.tzinfo is None else None)
        return diff.total_seconds() > (hours_threshold * 3600)

    def to_dict(self, hours_threshold=6):
        stale = self.is_stale(hours_threshold)
        return {
            'id': self.id,
            'institution_id': self.institution_id,
            'institution_name': self.institution.name if self.institution else None,
            'district': self.institution.district if self.institution else None,
            'suburb': self.institution.suburb if self.institution else None,
            'contact_phone': self.institution.contact_phone if self.institution else None,
            'component': self.component,
            'blood_group': self.blood_group,
            'available_units': self.available_units,
            'reserved_units': self.reserved_units,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'is_stale': stale,
            'notes': self.notes
        }

class BloodRequest(db.Model):
    __tablename__ = 'blood_requests'

    id = db.Column(db.Integer, primary_key=True)
    reference_no = db.Column(db.String(32), unique=True, nullable=False, index=True) # e.g. BL-REQ-2026-8812
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    hospital_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=True)
    hospital_name = db.Column(db.String(150), nullable=False)
    hospital_location = db.Column(db.String(150), nullable=False)
    treating_department = db.Column(db.String(100), default='Emergency / ICU')
    patient_ref = db.Column(db.String(64), nullable=False) # Fictional MRN or Code e.g. EM-7492
    
    blood_group = db.Column(db.String(16), nullable=False)
    component = db.Column(db.String(64), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    urgency = db.Column(db.String(32), nullable=False, default=UrgencyLevel.CRITICAL)
    required_by = db.Column(db.String(64), nullable=False)
    
    clinical_notes = db.Column(db.String(255), nullable=True) # e.g. Post-op massive blood loss protocol
    contact_person = db.Column(db.String(100), nullable=False)
    contact_phone_masked = db.Column(db.String(32), nullable=False)
    
    status = db.Column(db.String(32), default=RequestStatus.PENDING)
    selected_bank_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=True)
    
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    recipients = db.relationship('RequestRecipient', back_populates='request', cascade='all, delete-orphan')
    events = db.relationship('RequestEvent', back_populates='request', cascade='all, delete-orphan', order_by='RequestEvent.timestamp.desc()')

    def to_dict(self):
        return {
            'id': self.id,
            'reference_no': self.reference_no,
            'created_by_user_id': self.created_by_user_id,
            'hospital_id': self.hospital_id,
            'hospital_name': self.hospital_name,
            'hospital_location': self.hospital_location,
            'treating_department': self.treating_department,
            'patient_ref': self.patient_ref,
            'blood_group': self.blood_group,
            'component': self.component,
            'quantity': self.quantity,
            'urgency': self.urgency,
            'required_by': self.required_by,
            'clinical_notes': self.clinical_notes,
            'contact_person': self.contact_person,
            'contact_phone_masked': self.contact_phone_masked,
            'status': self.status,
            'selected_bank_id': self.selected_bank_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'responses_summary': [r.to_dict() for r in self.recipients]
        }

class RequestRecipient(db.Model):
    __tablename__ = 'request_recipients'

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('blood_requests.id'), nullable=False, index=True)
    blood_bank_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=False, index=True)
    status = db.Column(db.String(64), default=ResponseStatus.SENT)
    available_units_reported = db.Column(db.Integer, nullable=True)
    response_note = db.Column(db.String(255), nullable=True)
    action_by_name = db.Column(db.String(100), nullable=True)
    responded_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    request = db.relationship('BloodRequest', back_populates='recipients')
    blood_bank = db.relationship('Institution')

    def to_dict(self):
        return {
            'id': self.id,
            'request_id': self.request_id,
            'blood_bank_id': self.blood_bank_id,
            'blood_bank_name': self.blood_bank.name if self.blood_bank else None,
            'blood_bank_district': self.blood_bank.district if self.blood_bank else None,
            'blood_bank_suburb': self.blood_bank.suburb if self.blood_bank else None,
            'blood_bank_phone': self.blood_bank.contact_phone if self.blood_bank else None,
            'status': self.status,
            'available_units_reported': self.available_units_reported,
            'response_note': self.response_note,
            'action_by_name': self.action_by_name,
            'responded_at': self.responded_at.isoformat() if self.responded_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class RequestEvent(db.Model):
    __tablename__ = 'request_events'

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('blood_requests.id'), nullable=False, index=True)
    event_type = db.Column(db.String(64), nullable=False) # REQUEST_CREATED, SENT_TO_BANKS, BANK_RESPONDED, BANK_SELECTED, STATUS_CHANGED, CANCELLED
    institution_name = db.Column(db.String(150), nullable=True)
    actor_name = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    request = db.relationship('BloodRequest', back_populates='events')

    def to_dict(self):
        return {
            'id': self.id,
            'request_id': self.request_id,
            'event_type': self.event_type,
            'institution_name': self.institution_name,
            'actor_name': self.actor_name,
            'details': self.details,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

class DonorProfile(db.Model):
    __tablename__ = 'donor_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    blood_group = db.Column(db.String(16), nullable=False)
    district = db.Column(db.String(64), nullable=False)
    suburb = db.Column(db.String(64), nullable=False)
    willing_to_donate = db.Column(db.Boolean, default=True)
    notify_sms = db.Column(db.Boolean, default=False)
    notify_email = db.Column(db.Boolean, default=True)
    last_donation_date = db.Column(db.String(32), nullable=True)
    consent_recorded_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='donor_profile')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'blood_group': self.blood_group,
            'district': self.district,
            'suburb': self.suburb,
            'willing_to_donate': self.willing_to_donate,
            'notify_sms': self.notify_sms,
            'notify_email': self.notify_email,
            'last_donation_date': self.last_donation_date,
            'consent_recorded_at': self.consent_recorded_at.isoformat() if self.consent_recorded_at else None
        }

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Null for role broadcast
    role_target = db.Column(db.String(32), nullable=True)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    channel = db.Column(db.String(32), default='IN_APP') # IN_APP, SIMULATED_SMS, SIMULATED_EMAIL
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'role_target': self.role_target,
            'title': self.title,
            'message': self.message,
            'channel': self.channel,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(100), nullable=False)
    actor_id = db.Column(db.Integer, nullable=True)
    actor_email = db.Column(db.String(120), nullable=True)
    actor_role = db.Column(db.String(32), nullable=True)
    resource_type = db.Column(db.String(64), nullable=False)
    resource_id = db.Column(db.String(64), nullable=True)
    details = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(64), default='127.0.0.1')
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'action': self.action,
            'actor_email': self.actor_email,
            'actor_role': self.actor_role,
            'resource_type': self.resource_type,
            'resource_id': self.resource_id,
            'details': self.details,
            'ip_address': self.ip_address,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
