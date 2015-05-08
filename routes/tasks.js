exports.list = function(req, res, next){
  req.db.tasks.find({
    completed: false
  }).toArray(function(error, tasks){
    if (error) {
      return next(error);
    }

    res.render("tasks", {
      title: 'Todo list',
      tasks: tasks || []
    });
  });
};


exports.add = function(req, res, next){
  if (!req.body || !req.body.name){
    return next(new Error("No Data Provided!"));
  }

  req.db.tasks.save({
    name: req.body.name,
    completed: false
  }, function(error, task){
    if (error){
      return next(error);
    }

    if (!task){
      return next(new Error("Failed To Save"));
    }
    console.info('Added %s with id=%s', task.name, task._id);
    res.redirect('/tasks');
  });
};

exports.markAllCompleted = function(req, res, next){
  if (!req.body.all_done || req.body.all_done !== 'true'){
    return next();
  }

  req.db.tasks.update({
    completed: false
  }, {$set: {completed: true}}, {multi: true}, function(err, count){
    if (err){
      return next(error);
    }
    console.info('Marked %s tasks(s) completed', count);
    res.redirect("/tasks");
  });
};

exports.completed = function(req, res, next){
  req.db.tasks.find({
    completed: true
  }).toArray(function(err, tasks){
    res.render("tasks_completed", {
      title: 'Completed',
      tasks: tasks || []
    });
  });
};

exports.markCompleted = function(req, res, next){
  if (!req.body.completed){
    return next(new Error("Param is missing"));
  }
  req.db.tasks.updateById(req.task._id, {
    $set: {completed: req.body.completed === 'true'}
  }, function(error, count){
    if (error) return next(error);

    if (count !== 1){
      return next(new Error("Something went wrong."));
    }
    console.info("marked task %s with id=%s completed.", req.task.name, req.task.id);
    res.redirect("/tasks");
  });
};

exports.del = function (req, res, next){
  req.db.tasks.removeById(req.task._id, function(error, count){
    if (error) return next(error);
    if (count !== 1) return next(new Error("Something went wrong..."));
    console.info("Deleted task %s with id=%s completed", req.task.name, req.task._id);
    res.status(200).send("DONE");

  });
};
