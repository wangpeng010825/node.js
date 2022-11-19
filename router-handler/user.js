let db = require("../db/index.js");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let config = require("../config.js");
let sql1 = "select * from ev_users where username=?";
let sql2 = "insert into ev_users set? ";

regUser = (req, res) => {
  let userinfo = req.body;
  if (!userinfo.username || !userinfo.password) {
    return res.cc("你所输入的用户名或密码不合法");
  }
  db.query(sql1, userinfo.username, (err, data) => {
    if (err) {
      return res.cc(err.message);
    }
    if (data.length > 0) {
      return res.cc("用户名被占用，请更换用户名");
    }
  });
  userinfo.password = bcrypt.hashSync(userinfo.password, 10);
  db.query(
    sql2,
    { username: userinfo.username, password: userinfo.password },
    (err, data) => {
      if (err) {
        return res.cc(err.message);
      }
      if (data.affectedRows !== 1) {
        return res.cc("注册用户失败，请稍后再试");
      }
      return res.send("注册成功");
    }
  );
};
login = (req, res) => {
  let userinfo = req.body;
  if (!userinfo.username || !userinfo.password) {
    return res.cc("你所输入的用户名或密码不合法");
  }
  db.query(sql1, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("用户名不存在");
    }

    let compareresult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );
    if (!compareresult) {
      return res.cc("密码错误");
    }

    let user = { ...results[0], password: "", user_pic: "" };
    let tokenstr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.realexpiresIn
    });
    return res.send({
      status: 0,
      message: "登录成功！",
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: "Bearer " + tokenstr
    });
  });
};
module.exports = {
  regUser,
  login
};
