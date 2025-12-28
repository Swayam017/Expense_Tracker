const express = require("express");
const app = express();
const db = require("./utils/db_connections");
const aiRoutes = require("./routes/aiRoutes");
const passwordRoutes = require("./routes/password");
// built-in middleware of express converts json from res.body to javascript object
app.use(express.json());
app.use(express.static("public"));
// routes
app.use("/password", passwordRoutes);
app.use("/api/ai", aiRoutes);
app.use("/", require("./routes/authRoutes"));
app.use("/expenses", require("./routes/expenseRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));
app.use("/premium",require("./routes/premium"));

// Sync database
db.sync({alter:true})
  .then(() => console.log("Database synced"))
  .catch(err => console.log(err));


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
