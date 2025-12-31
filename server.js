const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const studentRouter = require("./studentRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---- SWAGGER SETUP (before routes + listen) ----
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student API",
      version: "1.0.0",
      description: "Student CRUD API with Image Upload",
    },
    servers: [{ url: "http://localhost:8080" }],
  },
  apis: [path.join(__dirname, "studentRoutes.js")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ------------------------------------------------

// ROUTES
app.use("/api/students", studentRouter);

// DB + SERVER
mongoose
  .connect("mongodb://localhost:27017/studentdb")
  .then(() => console.log("MongoDb Connected"))
  .catch(console.error);

app.listen(8080, () => console.log("Server started on port 8080"));