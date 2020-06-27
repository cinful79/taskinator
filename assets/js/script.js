taskListEl.removeAttribute("style");
}
}

function saveTasks(){
//have to use JavaScript Object Notation to display array values in
//local storage as strings. local storage can only display string values
//so we convert the objects into the strings that are contained in the objects
localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){
//new steps to loadTasks
//1. get task items from localStorage need to create a new variable 
//to set the array we are getting from localStorage
var getTasks = localStorage.getItem("tasks");
if (getTasks === null){//or we can say if(!getTasks){}
    getTasks = [];
    console.log("nothing was in storage (null) so we set the array to empty []");
    return false;
}
//2. convert tasks from the stringified format back into an array of objects
getTasks = JSON.parse(getTasks);
console.log("here is the task we got from storage: ");
console.log(getTasks);

//3. iterates through tasks array and creates task elements on the page from it.
console.log("checking if iterating through the array works");
for (var i = 0; i < getTasks.length; i++){
    console.log(getTasks[i]);

    //creating the task elements by their HTML DOM element, and their attributes: class, id, and draggable
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", getTasks[i].id);//using just i works here but maybe its different??? the other way is grabbing the id number from the object i guess
    listItemEl.setAttribute("draggable", "true");
    //console.log(listItemEl);

    //create <div> element and store it in a variable called taskInfoEl
    var taskInfoEl = document.createElement("div");
    taskInfoEl.classname = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + getTasks[i].name + "</h3><span class='task-type'>" + getTasks[i].type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    //console.log(taskInfoEl);
    var taskActionsEl = createTaskActions(getTasks[i].id);
    listItemEl.appendChild(taskActionsEl);
    //console.log(listItemEl);

    //check if the status values match and then append accordingly
    if(getTasks[i].status === "to do"){
        listItemEl.querySelector("select[name='status-change']").statusIndex = 0;
        tasksToDoEl.appendChild(listItemEl);
    } else if (getTasks[i].status === "in progress"){
        listItemEl.querySelector("select[name='status-change']").statusIndex = 1;
        tasksInProgressEl.appendChild(listItemEl);
    } else if (getTasks[i].status === "completed"){
        listItemEl.querySelector("select[name='status-change']").statusIndex = 2;
        tasksCompletedEl.appendChild(listItemEl);
    }


    //taskIdCounter++;
    console.log(listItemEl);

}
console.log("created the elements after iterating through the array thats inside storage!!");

}

//make sure the function calls inside the eventListener are placed ABOVE the eventListener!! or you will get uncaught reference error
//submit the task into the main section via clicking the Add Task button
formEl.addEventListener("submit", taskFormHandler);
