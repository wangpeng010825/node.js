let db = require("../db/index.js");
let bcrypt = require("bcryptjs");
let sql1 = `select id, username, nickname, email, user_pic from ev_users where id=?`;
let sql2 = `update ev_users set ? where id=?`;
let sql3 = `select * from ev_users where id=?`;
let sql4 = `update ev_users set password=? where id=?`;
let sql5 = "update ev_users set user_pic=? where id=?";

getUserInfo = (req, res) => {
  db.query(sql1, req.user.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("获取用户信息失败！");
    }
    return res.send({
      status: 0,
      message: "获取用户基本信息成功！",
      data: results[0]
    });
  });
};
updateUserInfo = (req, res) => {
  let { id, nickname, email } = req.body;
  let emailtest = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (
    !id ||
    !nickname ||
    !emailtest.test(email) ||
    !(id == req.user.id)
  ) {
    return res.cc("你所输入的数据不合法");
  }
  db.query(sql2, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("修改用户基本信息失败！");
    return res.cc("修改用户基本信息成功！", 0);
  });
};
updatePassword = (req, res) => {
  let { oldPwd, newPwd } = req.body;
  if (oldPwd === newPwd) {
    return res.cc("新密码与旧密码相同，请重新输入");
  }
  db.query(sql3, req.user.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("旧密码错误！");
  });
  const newPwdBcrypt = bcrypt.hashSync(req.body.newPwd, 10);
  db.query(sql4, [newPwdBcrypt, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.cc("更新密码失败！");
    }
    res.cc("更新密码成功！", 0);
  });
};
updateAvatar = (req, res) => {
  let { avatar } = req.body;
  const avatartest = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
  if (!avatartest.test(avatar) ) {
    return res.cc("头像格式错误");
  }
  db.query(sql5, [avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.cc("更新头像失败！");
    }
    return res.cc("更新头像成功！", 0);
  });
};
module.exports = {
  getUserInfo,
  updateUserInfo,
  updatePassword,
  updateAvatar
};
