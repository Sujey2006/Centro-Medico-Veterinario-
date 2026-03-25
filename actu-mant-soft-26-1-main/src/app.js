const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Sesiones (para login y roles).
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'pelucan-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
  })
);

// Disponible en todas las vistas para mostrar estado del usuario.
app.use((req, res, next) => {
  res.locals.currentUser = req.session?.user || null;
  next();
});

// Routes
app.use('/', appointmentRoutes);
app.use('/', authRoutes);

module.exports = app;