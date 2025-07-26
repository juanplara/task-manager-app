const express = require('express');
const { getTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas protegidas
router.get('/', protect, getTasks);
router.post('/', protect, createTask);

module.exports = router;
