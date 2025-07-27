// backend/routes/taskRoutes.js
const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, validateTask, createTask);
router.put('/:id', protect, validateTask, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
