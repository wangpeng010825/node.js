let express = require("express");
let app = express();
let cors = require("cors");
//导入路由区域
let userRouter = require("./router/user.js");
let userinfoRouter = require("./router/userinfo.js");
let artCateRouter = require("./router/artcate.js");
let articleRouter = require("./router/article.js");

//自定义全局中间件方便抛出错误
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.json({
      status,
      message: err instanceof Error ? err.message : err
    });
  };
  next();
});

let config = require("./config.js");
let expressjwt = require("express-jwt");
app.use(
  expressjwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })
);
app.use("/uploads", express.static("./uploads"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
//注册路由区域
app.use("/api", userRouter);
app.use("/my", userinfoRouter);
app.use("/my/article", artCateRouter);
app.use("/my/article", articleRouter);

//错误中间件
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败！");
});

let port = 8080;

app.listen(port, err => {
  if (err) {
    console.log(err);
  }
  console.log(
    `web server 已经在port${port}运行，地址为http://127.0.0.1:${port} `
  );
});
