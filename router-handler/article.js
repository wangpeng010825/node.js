let db = require("../db/index.js");
let path = require("path");
let sql1 = "insert into ev_articles set? ";
let sql2 = `update ev_articles set is_delete=1 where id=?`;
let sql3 = `select * from  ev_articles where id=? `;
let sql4 = `update ev_articles set ? where Id=?`;
addArticle = (req, res) => {
  let { title, cate_id, content, state } = req.body;
  if (
    !title ||
    !cate_id ||
    !content ||
    !state ||
    !req.file ||
    req.file.fieldname !== "cover_img"
  ) {
    res.cc("您输入的数据不合法");
  }
  let pub_data = new Date();
  let cover_img = path.join(__dirname, "../uploads", req.file.filename);
  let author_id = req.user.id;
  let insertobj = {
    ...req.body,
    pub_data,
    cover_img,
    author_id
  };
  db.query(sql1, insertobj, (err, results) => {
    if (err) {
      return res.cc(err.message);
    }
    if (results.affectedRows !== 1) {
      return res.cc("发布文章失败，请稍后再试");
    }
  });

  res.cc("发布文章成功", 0);
};
deleteArticle = (req, res) => {
  db.query(sql2, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc("删除文章失败！");
    }
    res.cc("删除文章成功！", 0);
  });
};
getArticlebyid = (req, res) => {
  db.query(sql3, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("获取文章失败！");
    }
    res.send({
      status: 0,
      message: "获取文章分类数据成功！",
      data: results[0]
    });
  });
};
updateArticle = (req, res) => {
  let { id, title, cate_id, content, state } = req.body;
  if (
    !id ||
    !title ||
    !cate_id ||
    !content ||
    !state ||
    !req.file ||
    req.file.fieldname !== "cover_img"
  ) {
    res.cc("您输入的数据不合法");
  }
  let pub_data = new Date();
  let cover_img = path.join(__dirname, "../uploads", req.file.filename);
  let author_id = req.user.id;
  let insertobj = {
    ...req.body,
    pub_data,
    cover_img,
    author_id
  };
  db.query(sql4, [insertobj, id], (err, results) => {
    if (err) {
      return res.cc(err.message);
    }
    if (results.affectedRows !== 1) {
      return res.cc("更新文章失败，请稍后再试");
    }
  });

  res.cc("更新文章成功", 0);
};

module.exports = {
  addArticle,
  deleteArticle,
  getArticlebyid,
  updateArticle
};
