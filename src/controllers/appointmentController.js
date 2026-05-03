const appointmentModel = require('../models/appointmentModel');

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.getAllAppointments();
        res.render('index', { title: 'Panel de Citas', appointments });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getCreateForm = (req, res) => {
    res.render('create', { title: 'Agendar Nueva Cita' });
};

exports.createAppointment = async (req, res) => {
    try {
        const { pet_name, owner_name, service, appointment_date } = req.body;
        await appointmentModel.createAppointment({ pet_name, owner_name, service, appointment_date });
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getEditForm = async (req, res) => {
    try {
        const id = req.params.id;
        const appointment = await appointmentModel.getAppointmentById(id);
        if (!appointment) {
            return res.status(404).send('Cita no encontrada');
        }
        res.render('edit', { title: 'Editar Cita', appointment });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const id = req.params.id;
        const { pet_name, owner_name, service, appointment_date, status } = req.body;
        await appointmentModel.updateAppointment(id, { pet_name, owner_name, service, appointment_date, status });
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const id = req.params.id;
        await appointmentModel.deleteAppointment(id);
        res.redirect('/');
    } catch (err) { 
        res.status(500).send(err.message);
    }
};
