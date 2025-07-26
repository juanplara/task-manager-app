const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Verifica si hay un token en el header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Obtiene el token sin el "Bearer"

      // Verifica y decodifica el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca el usuario autenticado y lo guarda en req.user (sin password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No estás autorizado, token faltante' });
  }
};

module.exports = { protect };
