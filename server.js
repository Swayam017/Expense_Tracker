require("dotenv").config();
const app = require("./app");
const connectDB = require("./utils/db_connections");
// Connect MongoDB

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));
