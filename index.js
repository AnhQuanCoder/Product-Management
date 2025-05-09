const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");
const http = require("http");
const { Server } = require("socket.io");
const app = express();

app.use(methodOverride("_method"));

require("dotenv").config();
const port = process.env.PORT;

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

const database = require("./config/database.js");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

const systemConfig = require("./config/system.js");

// connect database
database.connect();

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End SocketIO

// Flash
app.use(cookieParser("ANHQUANCODERBODOITHIENHA"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

// Tiny MCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End Tiny MCE

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

// Route
route(app);
routeAdmin(app);
// Các trường hợp lỗi còn lại vào trang 404
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// day la test
