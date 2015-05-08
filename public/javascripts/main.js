$(document).ready(function(){
  $(".delete a").click(function(){
    $(this).remove();
    var url = "/tasks/" + $(this).data('taskId');
    var data = {
      _csrf : $(this).data("csrf")
    };
    $.ajax({
      url: url,
      type: "DELETE",
      data : data
    }).done(function(){
      document.location.reload(true);
    }).fail(function(){
      console.log("Sorry failed to delete the task");
    });
  });
});
