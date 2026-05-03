// Datos Iniciales / Persistencia
let appointments = JSON.parse(localStorage.getItem('vet_pro_appointments')) || [
    { id: 'VET-001', petName: 'Toby', ownerName: 'Carlos Ruiz', service: 'Vacunación', date: '2026-02-25 10:00', status: 'Confirmada' },
    { id: 'VET-002', petName: 'Luna', ownerName: 'Ana López', service: 'Estética', date: '2026-02-25 11:30', status: 'En Proceso' },
    { id: 'VET-003', petName: 'Thor', ownerName: 'Marcos Soler', service: 'Consulta General', date: '2026-02-25 12:15', status: 'Pendiente' },
    { id: 'VET-004', petName: 'Mora', ownerName: 'Elena G.', service: 'Desparasitación', date: '2026-02-25 13:00', status: 'Confirmada' }
];

let patients = JSON.parse(localStorage.getItem('vet_pro_patients')) || [
    { id: 1, name: 'Toby', species: 'Perro', breed: 'Golden Retriever', age: 3, owner: 'Carlos Ruiz' },
    { id: 2, name: 'Luna', species: 'Gato', breed: 'Siamés', age: 2, owner: 'Ana López' },
    { id: 3, name: 'Thor', species: 'Perro', breed: 'Bulldog', age: 5, owner: 'Marcos Soler' }
];

// Navegación Profesional
function showSection(sectionId, element) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la seleccionada
    document.getElementById(sectionId).style.display = 'block';

    // Actualizar estado activo en el sidebar
    if(element) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }

    // Recargar datos específicos de la sección
    if(sectionId === 'dashboard') renderDashboard();
    if(sectionId === 'appointments') renderFullAppointments();
    if(sectionId === 'patients') renderPatientsGrid();
}

// Modales
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Renderizar Dashboard (Mini tabla)
function renderDashboard() {
    const list = document.getElementById('dashboardAppointmentsList');
    if(!list) return;
    list.innerHTML = '';

    appointments.slice(0, 5).forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${app.petName}</strong></td>
            <td>${app.ownerName}</td>
            <td>${app.service}</td>
            <td>${app.date.split(' ')[1]}</td>
            <td><span class="status-tag ${getStatusClass(app.status)}">${app.status}</span></td>
        `;
        list.appendChild(row);
    });
}

// Renderizar Tabla Completa de Citas
function renderFullAppointments() {
    const list = document.getElementById('fullAppointmentsList');
    if(!list) return;
    list.innerHTML = '';

    appointments.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${app.id}</td>
            <td><strong>${app.petName}</strong></td>
            <td>${app.ownerName}</td>
            <td>${app.service}</td>
            <td>${app.date}</td>
            <td><span class="status-tag ${getStatusClass(app.status)}">${app.status}</span></td>
            <td>
                <button class="btn-text" onclick="deleteAppointment('${app.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        list.appendChild(row);
    });
}

// Renderizar Cuadrícula de Pacientes
function renderPatientsGrid() {
    const grid = document.getElementById('patientsGrid');
    if(!grid) return;
    grid.innerHTML = '';

    patients.forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        card.innerHTML = `
            <i class="fas fa-paw"></i>
            <h3>${p.name}</h3>
            <p>${p.species} • ${p.breed}</p>
            <p><small>Dueño: ${p.owner}</small></p>
            <button class="btn-text" style="margin-top:10px">Ver Historial</button>
        `;
        grid.appendChild(card);
    });
}

function getStatusClass(status) {
    if(status === 'Confirmada') return 'success';
    if(status === 'En Proceso') return 'info';
    if(status === 'Pendiente') return 'warning';
    return '';
}

// Lógica de Formularios
document.getElementById('appointmentForm').onsubmit = function(e) {
    e.preventDefault();
    const newApp = {
        id: 'VET-' + Math.floor(Math.random()*900 + 100),
        petName: document.getElementById('petName').value,
        ownerName: document.getElementById('ownerName').value,
        service: document.getElementById('service').value,
        date: document.getElementById('appDate').value.replace('T', ' '),
        status: 'Confirmada'
    };

    appointments.unshift(newApp);
    localStorage.setItem('vet_pro_appointments', JSON.stringify(appointments));

    renderDashboard();
    renderFullAppointments();
    closeModal('appointmentModal');
    this.reset();
};

document.getElementById('patientForm').onsubmit = function(e) {
    e.preventDefault();
    const newPatient = {
        id: Date.now(),
        name: document.getElementById('pName').value,
        species: document.getElementById('pSpecies').value,
        breed: document.getElementById('pBreed').value,
        age: document.getElementById('pAge').value,
        owner: 'Registrado hoy'
    };

    patients.unshift(newPatient);
    localStorage.setItem('vet_pro_patients', JSON.stringify(patients));

    renderPatientsGrid();
    closeModal('patientModal');
    this.reset();
};

function deleteAppointment(id) {
    if(confirm('¿Seguro que deseas eliminar esta cita?')) {
        appointments = appointments.filter(a => a.id !== id);
        localStorage.setItem('vet_pro_appointments', JSON.stringify(appointments));
        renderFullAppointments();
        renderDashboard();
    }
}

// Inicialización al cargar
window.onload = () => {
    renderDashboard();
    renderFullAppointments();
    renderPatientsGrid();
};
