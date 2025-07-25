const User = require('../models/User');

// Registrar nuevo usuario
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validar campos
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar si el usuario ya existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Este correo ya está registrado' });
  }

  try {
    // Crear nuevo usuario
    const user = await User.create({ name, email, password });

    // Respuesta sin enviar la contraseña
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar contraseña
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si todo está bien, devolver usuario (sin contraseña)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

module.exports = {
  registerUser,
  loginUser
};
