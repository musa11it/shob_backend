import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for the E-Commerce backend. Includes authentication, product, order, and subscription endpoints with JWT-based security.",
      contact: {
        name: "ITANGISHATSE Musa",
        email: "itangishatsemusa@gmail.com",
      },
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:5000/api",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your access token in the format **Bearer &lt;token&gt;**. Example: `Bearer eyJhbGci...`",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // make sure this path matches your folder structure
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Application) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(
    `📘 Swagger docs available at: ${
      process.env.BASE_URL || "http://localhost:5000"
    }/api/docs`
  );
};
