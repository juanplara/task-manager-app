const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Task Manager API',
        version: '1.0.0',
        description: 'API para gestionar tareas con autenticación de usuarios',
        },
        servers: [
        {
            url: 'http://localhost:5000/api', // cambia el puerto si es distinto
        },
        ],
    },
    apis: ['./routes/*.js'], // buscará la documentación en los archivos de rutas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
