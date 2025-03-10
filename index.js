const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser')
const app = express();

app.use(methodOverride('_method'));

require('dotenv').config()
const port = process.env.PORT;

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

const database = require('./config/database.js');
const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const systemConfig = require('./config/system.js');

// connect database
database.connect();

app.set('views', './views');
app.set('view engine', 'pug');

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'))

// Route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})