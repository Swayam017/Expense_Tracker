const express = require("express");
const app = express();
const db = require("./utils/db_connections");

app.use(express.json());
app.use(express.static("public"));
// Sync database
db.sync({alter:true})
  .then(() => console.log("Database synced"))
  .catch(err => console.log(err));

app.use("/", require("./routes/authRoutes"));
app.use("/expenses", require("./routes/expenseRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));
app.use("/premium",require("./routes/premium"));




app.listen(3000, () => {
    console.log("Server running on port 3000");
});
