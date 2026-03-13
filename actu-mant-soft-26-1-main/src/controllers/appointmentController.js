const db = require('../config/db');

exports.getAllAppointments = (req, res) => {
    db.all("SELECT * FROM appointments ORDER BY appointment_date DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.render('index', { title: 'Panel de Citas', appointments: rows });
    });
};

exports.getCreateForm = (req, res) => {
    res.render('create', { title: 'Agendar Nueva Cita' });
};

exports.createAppointment = (req, res) => {
    const { pet_name, owner_name, service, appointment_date } = req.body;
    const sql = "INSERT INTO appointments (pet_name, owner_name, service, appointment_date) VALUES (?, ?, ?, ?)";
    const params = [pet_name, owner_name, service, appointment_date];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.redirect('/');
    });
};

exports.deleteAppointment = (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM appointments WHERE id = ?", id, function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.redirect('/');
    });
};
