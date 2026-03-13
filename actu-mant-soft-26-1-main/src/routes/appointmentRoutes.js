<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAllAppointments);
router.get('/create', appointmentController.getCreateForm);
router.post('/create', appointmentController.createAppointment);
router.post('/delete/:id', appointmentController.deleteAppointment);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAllAppointments);
router.get('/create', appointmentController.getCreateForm);
router.post('/create', appointmentController.createAppointment);
router.post('/delete/:id', appointmentController.deleteAppointment);

module.exports = router;
>>>>>>> 0cffe9f33155ef4f0ecd21ecfc624089b2682cbc
