function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

function requireRole(role) {
  return function (req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect('/auth/login');
    }
    if (req.session.user.role !== role) {
      return res.status(403).render('forbidden', { title: 'Acceso denegado' });
    }
    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};

