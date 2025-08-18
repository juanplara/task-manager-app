const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Task Manager API',
        version: '1.0.0',
        description: 'API para gestionar tareas con autenticación de usuarios, filtros, paginación y seguridad.',
        },
        servers: [
        {
            url: 'http://localhost:5000/api',
            description: 'Servidor local',
        },
        ],
        components: {
        securitySchemes: {
            bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            },
        },
        },
        security: [
        {
            bearerAuth: [],
        },
        ],
    },
    apis: ['./routes/*.js'], // Rutas donde Swagger buscará la documentación
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

