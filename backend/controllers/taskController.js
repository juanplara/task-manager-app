const Task = require('../models/task');

// Obtener todas las tareas del usuario autenticado con filtro, paginación y ordenamiento
const getTasks = async (req, res) => {
  try {
    const query = { user: req.user._id };

    // Filtro por estado completado
    if (req.query.completed !== undefined) {
      const completedValue = req.query.completed.toLowerCase();
      if (completedValue === 'true' || completedValue === 'false') {
        query.completed = completedValue === 'true';
      } else {
        return res.status(400).json({ message: 'El valor de completed debe ser true o false' });
      }
    }

    // Filtro por prioridad
    if (req.query.priority) {
      const priorityValue = req.query.priority.toLowerCase();
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priorityValue)) {
        return res.status(400).json({ message: 'La prioridad debe ser low, medium o high' });
      }
      query.priority = priorityValue;
    }

    // Filtro por título parcial (case-insensitive)
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }

    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Ordenamiento
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const tasks = await Task.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: order });

    const total = await Task.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      limit,
      totalTasks: total,
      totalPages,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
  }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
  const { title, description, completed, priority } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'El título es obligatorio' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      completed, // si viene en el body, lo usa. Si no, se aplica el default.
      priority, // ¡Asegúrate de incluir esto!
      user: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
};

// Actualizar una tarea existente
const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Validaciones antes de actualizar
    if (req.body.title && typeof req.body.title !== 'string') {
      return res.status(400).json({ message: 'El título debe ser texto' });
    }

    if (req.body.completed !== undefined && typeof req.body.completed !== 'boolean') {
      return res.status(400).json({ message: 'El campo completed debe ser booleano' });
    }

    if (req.body.priority !== undefined) {
      const allowedPriorities = ['low', 'medium', 'high'];
      if (!allowedPriorities.includes(req.body.priority)) {
        return res.status(400).json({ message: 'El campo priority debe ser: low, medium o high' });
      }
    }

    // Aplicar los cambios y guardar
    Object.assign(task, req.body);
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea', error: error.message });
  }
};


// Eliminar una tarea
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(200).json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};