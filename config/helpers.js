const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});

module.exports = {
  database: db,
};
