require("dotenv").config();
const app = require("./app");
const db = require("./utils/db_connections");

const PORT = process.env.PORT || 3000;

db.sync()
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));
