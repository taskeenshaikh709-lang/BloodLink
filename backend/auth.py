import jwt
from functools import wraps
from datetime import datetime, timezone, timedelta
from flask import request, jsonify, current_app
from models import User, AuditLog, db

def generate_token(user):
    payload = {
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'institution_id': user.institution_id,
        'name': user.name,
        'exp': datetime.now(timezone.utc) + timedelta(hours=current_app.config.get('JWT_EXPIRATION_HOURS', 24))
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            parts = auth_header.split(' ')
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]

        if not token:
            return jsonify({'error': 'Authentication token is missing. Please log in.'}), 401

        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user = User.query.get(payload['user_id'])
            if not user or not user.is_active:
                return jsonify({'error': 'Account inactive or user not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Session expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid authentication token.'}), 401

        return f(user, *args, **kwargs)
    return decorated

def roles_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(user, *args, **kwargs):
            if user.role not in allowed_roles:
                return jsonify({
                    'error': f"Access restricted. Role '{user.role}' is not authorized to perform this operation.",
                    'required_roles': list(allowed_roles)
                }), 403
            return f(user, *args, **kwargs)
        return decorated
    return decorator

def log_audit(action, resource_type, actor=None, resource_id=None, details=None):
    try:
        actor_id = actor.id if actor else None
        actor_email = actor.email if actor else 'SYSTEM'
        actor_role = actor.role if actor else 'SYSTEM'
        ip = request.remote_addr if request else '127.0.0.1'

        log_entry = AuditLog(
            action=action,
            actor_id=actor_id,
            actor_email=actor_email,
            actor_role=actor_role,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            details=details,
            ip_address=ip
        )
        db.session.add(log_entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to write audit log: {e}")
