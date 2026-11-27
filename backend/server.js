const express = require("express");
const cors = require("cors");
const machineRoutes = require("./routes/machineRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // allow the React app (different port) to call this API
app.use(express.json()); // parse JSON request bodies into req.body

// Routes
app.use("/api/machines", machineRoutes);

// 404 handler for any route that doesn't exist
app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body must be valid JSON" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
