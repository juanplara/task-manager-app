const Task = require('../models/task');

// Obtener todas las tareas del usuario autenticado con filtro y paginación
const getTasks = async (req, res) => {
  try {
    const query = { user: req.user._id };

    // Filtro por estado completado (true o false)
    if (req.query.completed !== undefined) {
      const completedValue = req.query.completed.toLowerCase();
      if (completedValue === 'true' || completedValue === 'false') {
        query.completed = completedValue === 'true';
      } else {
        return res.status(400).json({ message: 'El valor de completed debe ser true o false' });
      }
    }

    // Parámetros de paginación (por defecto: página 1, 10 tareas por página)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Opcional: ordena por fecha de creación (más recientes primero)

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
  const { title, description, completed } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'El título es obligatorio' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      completed, // si viene en el body, lo usa. Si no, se aplica el default.
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