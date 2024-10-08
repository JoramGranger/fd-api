const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
      contact: {
        name: 'Joram Granger',
      },
      servers: [
        {
          url: 'http://localhost:5000',
        },
      ],
    },
  },
  apis: ['./routes/apiRoutes.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

console.log(swaggerDocs); // Add this line

module.exports = { swaggerUi, swaggerDocs };
