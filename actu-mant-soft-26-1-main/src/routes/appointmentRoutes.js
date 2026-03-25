const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Para HU 3: solo el rol "Veterinario" puede gestionar citas.
router.get('/', requireAuth, requireRole('Veterinario'), appointmentController.getAllAppointments);
router.get('/create', requireAuth, requireRole('Veterinario'), appointmentController.getCreateForm);
router.post('/create', requireAuth, requireRole('Veterinario'), appointmentController.createAppointment);
router.post('/delete/:id', requireAuth, requireRole('Veterinario'), appointmentController.deleteAppointment);

module.exports = router;