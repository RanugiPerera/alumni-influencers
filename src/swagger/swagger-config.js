import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Secure-Auth API",
      version: "1.0.0",
      description: "API documentation for the Secure-Auth implementation for Alumni Influencers",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs (relative to project root)
  apis: [
    "./src/routes/*.js",
    "./src/controllers/*.js",
  ],
};



const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
