const express = require("express");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const educationalFieldRoutes = require("./routes/educationalFieldRoutes");
const projectRoutes = require("./routes/projectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const educationalResourceRoutes = require("./routes/educationalResourceRoutes");
const testRoutes = require("./routes/testRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const chatRoutes = require("./routes/chatRoutes");
const chatMessageRoutes = require("./routes/chatMessageRoutes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "API LearningKids disponible" });
});

app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/educational-fields", educationalFieldRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/educational-resources", educationalResourceRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chat-messages", chatMessageRoutes);

app.use((req, res) => {
  return res.status(404).json({ message: "Ruta no encontrada" });
});

module.exports = app;
