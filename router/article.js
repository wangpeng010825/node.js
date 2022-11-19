const multer = require("multer");
// 导入处理路径的核心模块
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "../uploads") });
const express = require("express");
let articleHandler = require("../router-handler/article.js");
const router = express.Router();
router.post("/add", upload.single("cover_img"), articleHandler.addArticle);
router.get("/delete/:id", articleHandler.deleteArticle);
router.get("/get/:id", articleHandler.getArticlebyid);
router.post(
  "/update",
  upload.single("cover_img"),
  articleHandler.updateArticle
);

module.exports = router;
