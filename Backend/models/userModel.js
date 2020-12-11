const pool = require("../config/helpers");
const bcrypt = require("bcryptjs");

function User() {}

User.prototype = {
  // Find user by id or username
  find: function (user = null, callback) {
    // if user = Number return field = id. If user = string return fisld = username
    if (user) {
      var field = Number.isInteger(user) ? "id" : "email";
    }
    let sql = `SELECT * FROM users WHERE ${field} = ?`;

    pool.query(sql, user, (err, result) => {
      if (err) {
        console.log(error);
      }
      if (result.length > 0) {
        // console.log(result[0]);
        callback(result[0]);
      }
    });
  },

  create: function (body, callback) {
    let pwd = body.password;

    // user.find(body.email, (result) => {
    //   console.log(result);
    // });
    body.password = bcrypt.hashSync(pwd, 9);

    let sql = "INSERT INTO users SET ?";

    pool.query(sql, body, (err, lastId) => {
      //   console.log(bind);
      if (err) throw err;
      //   console.log(lastId);
      callback(lastId);
    });
  },

  login: function (email, password, callback) {
    this.find(email, (user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          callback(user);
          return;
        }
      }
      callback(null);
    });
  },
};

module.exports = User;
