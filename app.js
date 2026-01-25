require("dotenv").config({ quiet: true });

const express = require("express");
const app = express();

const aiRoutes = require("./routes/aiRoutes");
const passwordRoutes = require("./routes/password");
const incomeRoutes = require("./routes/incomeRoutes");


// built-in middleware of express converts json from res.body to javascript object
app.use(express.json());
app.use(express.static("public"));

// routes
app.use("/income", incomeRoutes);
app.use("/password", passwordRoutes);
app.use("/api/ai", aiRoutes);
app.use("/", require("./routes/authRoutes"));
app.use("/expenses", require("./routes/expenseRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));
app.use("/premium",require("./routes/premium"));
app.use("/api/report", require("./routes/reportRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));


console.log("ENV CHECK:", {
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  JWT: !!process.env.JWT_SECRET
});

module.exports = app;