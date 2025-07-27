const { body, validationResult } = require('express-validator');

// Validación al crear o actualizar tarea
const validateTask = [
  body('title')
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El título debe tener como máximo 100 caracteres'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción debe tener como máximo 500 caracteres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

module.exports = { validateTask }
