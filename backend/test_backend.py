import unittest
import json
from app import create_app
from models import db, User, Institution, BloodRequest, BloodInventory, Role, VerificationStatus, RequestStatus, ResponseStatus

class BloodLinkTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()
            from seed import seed_database
            seed_database()

    def get_token(self, email, password='demo123'):
        res = self.client.post('/api/auth/login', json={'email': email, 'password': password})
        data = json.loads(res.data)
        return data.get('token')

    def test_authentication_and_demo_switch(self):
        """Test authentication for different roles."""
        res = self.client.post('/api/auth/demo-switch', json={'role': 'hospital'})
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn('token', data)
        self.assertEqual(data['user']['role'], Role.HOSPITAL)

    def test_role_permissions_guard(self):
        """Public caregiver cannot perform hospital-specific actions."""
        public_token = self.get_token('public@bloodlink.org')
        headers = {'Authorization': f'Bearer {public_token}'}

        # Try to update blood inventory (should be restricted to blood_bank only)
        res = self.client.post('/api/inventory/update', json={
            'component': 'PRBC',
            'blood_group': 'O+',
            'available_units': 10
        }, headers=headers)
        self.assertEqual(res.status_code, 403)

    def test_request_creation_and_routing(self):
        """Hospital creates emergency request and it routes to verified blood banks."""
        hospital_token = self.get_token('hospital@bloodlink.org')
        headers = {'Authorization': f'Bearer {hospital_token}'}

        payload = {
            'patient_ref': 'PAT-TEST-101',
            'blood_group': 'AB+',
            'component': 'Platelet Concentrate (RDP)',
            'quantity': 2,
            'urgency': 'critical',
            'required_by': 'Immediate (1 Hr)',
            'clinical_notes': 'Test unit emergency'
        }
        res = self.client.post('/api/requests', json=payload, headers=headers)
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertTrue(data['dispatched_banks_count'] > 0)
        req_id = data['request']['id']

        # Duplicate detection test
        res_dup = self.client.post('/api/requests', json=payload, headers=headers)
        self.assertEqual(res_dup.status_code, 409)
        self.assertIn('DUPLICATE_SUSPECTED', json.loads(res_dup.data).get('warning', ''))

    def test_bank_response_flow(self):
        """Blood bank responds independently and updates status."""
        bank_token = self.get_token('bank@bloodlink.org')
        headers = {'Authorization': f'Bearer {bank_token}'}

        # Respond to seed request BL-MUM-2026-8812 (id: 1)
        res = self.client.post('/api/blood-bank/requests/1/respond', json={
            'status': 'Availability Confirmed',
            'available_units_reported': 3,
            'response_note': 'Units cross-checked on shelf.'
        }, headers=headers)
        self.assertEqual(res.status_code, 200)

    def test_stale_inventory_flagging(self):
        """Check stale inventory calculations."""
        with self.app.app_context():
            inv = BloodInventory.query.filter_by(blood_group='AB+').first()
            if inv:
                # AB+ FFP was seeded with stale timestamp > 6 hours
                self.assertTrue(inv.is_stale(hours_threshold=6))

if __name__ == '__main__':
    unittest.main()
