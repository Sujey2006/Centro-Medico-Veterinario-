const userModel = require('../models/userModel');
const { verifyPassword } = require('../utils/password');

exports.getLoginForm = (req, res) => {
  res.render('login', { title: 'Iniciar sesión', error: null });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.getUserByUsername(username);

    if (!user) {
      return res
        .status(401)
        .render('login', { title: 'Iniciar sesión', error: 'Credenciales inválidas' });
    }

    const ok = verifyPassword(password, user.password_salt, user.password_hash);
    if (!ok) {
      return res
        .status(401)
        .render('login', { title: 'Iniciar sesión', error: 'Credenciales inválidas' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return res.redirect('/');
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};

