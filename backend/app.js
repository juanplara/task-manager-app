// ───────────────────────────────────────────────
// 📦 Importaciones
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig'); // asumo que aquí tienes tu spec

// 📄 Cargar variables de entorno
dotenv.config();

// ⚙️ Inicializar app
const app = express();

// ───────────────────────────────────────────────
// 🛠️ Middlewares globales
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// 📑 Documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🛣️ Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 🚀 Conexión a la base de datos y servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Servidor en puerto ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error(err));
