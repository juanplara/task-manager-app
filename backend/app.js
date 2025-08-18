const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // 👈 Importar

dotenv.config();      
connectDB();          

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API Task Manager funcionando ✅');
});

// Rutas
app.use('/api', authRoutes);            // POST /api/register, /api/login
app.use('/api/tasks', taskRoutes);      // GET/POST /api/tasks

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

