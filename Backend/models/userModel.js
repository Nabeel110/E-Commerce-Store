const pool = require("../config/helpers");
const bcrypt = require("bcryptjs");

function User() {}

User.prototype = {
  // Find user by id or username
  find: function (user = null, callback) {
    // if user = Number return field = id. If user = string return fisld = username
    if (user) {
      let isEmail = user.indexOf("@");

      var field = Number(isEmail) !== -1 ? "email" : "id";
      // console.log(field);
    }
    if (field) {
      var sql = `SELECT * FROM users WHERE ${field} = ?`;
    } else {
      callback(user);
    }

    pool.query(sql, user, (err, result) => {
      if (err) {
        console.log(err);
        callback(err);
      }
      if (result.length > 0) {
        // console.log(result[0]);
        callback(result[0]);
      }
    });
  },

  create: function (body, callback) {
    let pwd = body.password;

    body.password = bcrypt.hashSync(pwd, 9);

    let sql = "INSERT INTO users SET ?";

    pool.query(sql, body, (err, lastId) => {
      //   console.log(bind);
      if (err) throw err;
      //   console.log(lastId);
      callback(lastId);
    });
  },

  update: function (body, callback) {
    let id = body[0].toString();
    // console.log("My ID", id);
    this.find("" + id, (user) => {
      if (user) {
        let pwd = body[5];

        // console.log("This is update method", body.id);
        body.password = bcrypt.hashSync(pwd, 9);

        let sql = `update users SET username=?, fname=?, lname=?, email=?, password=? where id= ${body[0]}`;

        pool.query(
          sql,
          [body[1], body[2], body[3], body[4], body[5]],
          (err, lastId) => {
            //   console.log(bind);
            if (err) throw err;
            //   console.log(lastId);
            callback(lastId);
          }
        );
        return;
      } else {
        callback(null);
      }
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
