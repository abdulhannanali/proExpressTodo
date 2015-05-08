var express = require("express");
var routes = require("./routes/index");
var tasks = require("./routes/tasks");

var http = require("http");
var path = require("path");

var mongoskin = require("mongoskin");

var db = mongoskin.db("mongodb://localhost:27017/todoApp?auto_reconnect", {safe: true});

var bodyParser = require("body-parser");
var app = express();

var favicon = require("serve-favicon"),
    logger = require("morgan"),
    methodOverride = require("method-override"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    csrf = require("csurf"),
    errorHandler = require("error-handler");

var serveIndex = require("serve-index");

app.use(function(req, res, next){
  req.db = {};

  req.db.tasks = db.collection("tasks");
  next();
});


app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.use(favicon(path.join('public','favicon.png')));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride());

app.use(cookieParser('DNjcyiG0LS-3Zz81vyLDY-NDBifRJGae-QotgQ07ri1-sc9OjXvpgT'));
app.use(session({
  secret: "DNjcyiG0LS-3Zz81vyLDY-NDBifRJGae-QotgQ07ri1-sc9OjXvpgT",
  resave: true,
  saveUninitialized: true
}));

app.use(csrf());
app.use(require("less-middleware")(path.join(__dirname, 'public')));


app.use(function(req, res, next){
  res.locals._csrf = req.csrfToken();
  return next();
});

app.param("task_id", function(req, res, next, taskId){
  req.db.tasks.findById(taskId, function(error, task){
    if (error) {
      return next(error);
    }
    if (!task) {
      return next(new Error("Task is not found"));
    }

    req.task = task;
    return next();
  });
});



app.get("/", routes.index);
app.get("/tasks", tasks.list);
app.post("/tasks", tasks.markAllCompleted);
app.post('/tasks', tasks.add);
app.post("/tasks/:task_id", tasks.markCompleted);
app.delete("/tasks/:task_id", tasks.del);
app.get("/tasks/completed", tasks.completed);

app.use(express.static(path.join(__dirname, "public")));
app.use(serveIndex("./public", {}));


app.use(function(req, res, next){
  res.status(404).send("NOT FOUND!!!");
});

app.use(function(error, req, res, next){
  if (error){
    console.error(error);
  }
});


app.locals.appname = 'Express.js Todo App';
app.set("port", 4000);
app.listen(app.get("port"));
