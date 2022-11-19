let db = require("../db/index.js");
let sql1 = "select * from ev_article_cate where is_delete=0 order by id asc";
let sql2 = "select * from  ev_article_cate where name=? or alias=? ";
let sql3 = `insert into ev_article_cate set ?`;
let sql4 = `update ev_article_cate set is_delete=1 where id=?`;
let sql5 = `select * from ev_article_cate where id=?`;
let sql6 = `update ev_article_cate set ? where Id=?`

getArticleCates = (req, res) => {
  db.query(sql1, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取文章分类列表成功！",
      data: results
    });
  });
};
addArticleCates = (req, res) => {
  let { name, alias } = req.body;
  if (!name || !alias) {
    return res.cc("分类名称或别名为空");
  }
  db.query(sql2, [req.body.name, req.body.alias], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length === 2 || results.length === 1) {
      return res.cc("分类名称或别名被占用，请更换后重试！");
    }
  });
  db.query(sql3, req.body, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc("新增文章分类失败！");
    }
    res.cc("新增文章分类成功！", 0);
  });
};
deleteCateById = (req, res) => {
  db.query(sql4, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc("删除文章分类失败！");
    }
    res.cc("删除文章分类成功！", 0);
  });
};
getArticleCateById = (req, res) => {
  db.query(sql5, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("获取文章分类失败！");
    }

    res.send({
      status: 0,
      message: "获取文章分类数据成功！",
      data: results[0]
    });
  });
};
updateCateById = (req, res) => {
 let {Id,name,alias}=req.body
 if(!Id || !name || !alias){
     return res.cc("信息有错误")
 }
  db.query(sql6, [req.body, req.body.Id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
    res.cc('更新文章分类成功！')
    })
    
 
};
module.exports = {
  getArticleCates,
  addArticleCates,
  deleteCateById,
  getArticleCateById,
  updateCateById
};
