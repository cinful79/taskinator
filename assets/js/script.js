console.dir(window.document);


//assigning variables to the HTML DOM elements by their assigned id's within the HTML
var formEl = document.querySelector("#task-form");
var buttonEl = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");//main section
var taskNameInput = document.querySelector("input[name='task-name']");
var taskIdCounter = 0;
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

//creating an empty array in which task data
//can be stored later as objects in the array
//will include id and statuses
var tasks = [];//SEMICOLON!!!

//taskNameInput = "here is the string stored in taskNameInput variable";
//check if its working  
//console.log(taskNameInput);

//function that handles the event of clicking which injects the content into a section
function taskFormHandler(event){
    event.preventDefault();
    
    //cool it works. this will store whatever value we type into the text field to be stored into this variable.
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    //checking if its working
    console.log("taskNameInput has been assigned a value!!");
    console.dir(taskNameInput);
    //this is attaching the task type that we select from the dropdown menu 
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    console.log("taskTypeInput has been assigned a value!!");
    console.log(taskTypeInput);//check if its storing correctly
    
    
    
    //checking if the form is in edit mode true or false
    var isEdit = formEl.hasAttribute("data-task-id");
    //console.log("below this log is saying its true or false that we are in EDIT MODE:")
    //console.log(isEdit);
    if(isEdit){//if true we are in EDIT MODE
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    //if no data attribute, create the object as normal and pass to createTaskEl() function
    } else {// if isEdit is false we are NOT in EDIT MODE 
        //package up data as an object
        //this is passed into the parameter (event) from the function argument below (taskDataObj)
        var taskDataObj =
        {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
            
        };
        //checking to see if the Object is being displayed correctly
        console.log("checking if object is being stored correctly");
        console.log(taskDataObj);
        //console.log(taskDataObj.status);
        createTaskEl(taskDataObj);
        //ORDER IS IMPORTANT AND SPELLING TOO
        console.log(event);
    }
    //check if input values are empty strings
    //if the strings entered are NOT filled out or empty it is considered a falsy value
    //if its NOT true that a string is entered essentially
    if(!taskNameInput || !taskTypeInput){
        alert("You need to enter something to submit into the task form.")
        formEl.reset();//this must be placed before the return statement!!`
        return false;
    }
}

function taskStatusChangeHandler(event){
    //get the task items id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //if the item inside the dropdown menu is selected then...
    //append the children elements with the data inside to the parent element specified
    if(statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress"){
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed"){
        tasksCompletedEl.appendChild(taskSelected);
    }

    //updatting the status of the task item in the tasks array
    for (var i = 0; i < tasks.length; i++){
        if(tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }
    //checking if the statusValue is updated into the tasks array after selecting the status from the dropdown menu
    console.log("check if the statusValue is updated in the tasks array after selecting from dropdown menu!!!");
    console.log(tasks);

    //save tasks array into localStorage
    console.log("executing saveTasks(); after updating the status in the array from selecting the dropdown menu!!");
    saveTasks();
}

function completeEditTask(taskName, taskType, taskId){
    //making sure that this function is getting the data it needs
    //console.log("making sure that this complete edit function is getting the data it needs:")
    //console.log(taskName, taskType, taskId);

    //find the matching task list item by its CSS class name and task id number
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values to the textContent in the dynamically generated HTML elements with their JS assigned class names
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }
    console.log("checking if edited task is changed in tasks array after pushing save task button!!!");//have to include this into completeEditTask to fully edit the array wherever im moving it to or from so that the save task ACTUALLY saves the task
    console.log(tasks);

    alert("Task Updated!");
    console.log("Task Updated!");

    //saving tasks array into localStorage after the task is edited and updated
    console.log("executed saveTasks() function inside the completeEditTask function!!!");
    saveTasks();


    //reset the form by removing the task ID and changing the button text back to normal after Saving the task
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

}

function createTaskEl(taskDataObj){
    //dynamically creates a new <li> element inside existing HTML code
    var listItemEl = document.createElement("li");
    //assigning the CSS class to HTML element we created <li>
    listItemEl.className = "task-item";//not entering any text here just creating the list item to contain something inside it
    //add task id as a custom attribute as if you're writing it as inline HTML styling
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    //adding the draggable attribute to the dynamically generated list items as if we are writing it as inline HTML styling
    listItemEl.setAttribute("draggable", "true");
    //listItemEl.textContent = "Task # " + taskIdCounter;
    console.log("task Id: " + taskIdCounter);

    //create a <div> container in the HTML to store the task type 
    var taskInfoEl = document.createElement("div");
    //class for the <div> we created
    taskInfoEl.className = "task-info";
    //this will set up the dynamic injection of the HTML content into the newly created div to contain the tasktype
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    //inject the innerHTML stored inside the variable taskInfoEl
    listItemEl.appendChild(taskInfoEl);

    //adding the id of the task into the object
    taskDataObj.id = taskIdCounter;
    //push the object into the tasks array to be stored
    tasks.push(taskDataObj);
    console.log("here is the tasks array with the newly stored object(s)");
    //but if edited this is not updated in this array yet
    console.log(tasks);

    //saving tasks array into localStorage
    console.log("save tasks was executed here in createTaskEl function after creating a task!!!");
    saveTasks();
    
    var taskActionsEl = createTaskActions(taskIdCounter);
    console.log(taskActionsEl);
    listItemEl.appendChild(taskActionsEl);
    //finally inject the <div> that contains all of the items that consist of the task-type that we want to inject
    //this will push the new list item Child element that we generated above into the HTML Parent element that we want it in.
    tasksToDoEl.appendChild(listItemEl);

    //increase task counter for next unique id
    taskIdCounter++;
}

function createTaskActions(taskId){
    //create container for these new task actions
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    
    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //creating something to make the select dropdown menu link to the actual button that changes the status of the list item we have selected
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"]

    for (var i = 0; i < statusChoices.length; i++){
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
}

//handles checking the target clicking of the different target elements by their css class name 
function taskButtonHandler(event){
    //check if the event of clicking the button works
    console.log(event.target);

    //get target element from an event
    var targetEl = event.target;

    //check if edit button was clicked, if true was clicked run editTask function on the taskId
    if (targetEl.matches(".edit-btn")){
        console.log("you clicked an edit button!");
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    //check if delete button was clicked, if true was clicked run deleteTask function on the taskId 
    else if (event.target.matches(".delete-btn")){
        console.log("you clicked a delete button!");
        //get the element's task id and print it to the console
        var taskId = event.target.getAttribute("data-task-id");
        //console.log("task button handler is showing this element's task id: " + taskId);
        //call delete task function
        deleteTask(taskId);
        
    }
}

function editTask(taskId){
    //get task list item element to edit
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //check to see if function is getting the task id by clicking the edit button
    console.log("editing task #: " + taskId);
    //get our javascript defined textContent from task name and type based on their CSS class selector name that we assigned it previously
    //keep in mind the <h3> and <span> were dynamically generated in JavaScript! These are not natively in the HTML!
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log("editing taskName: ");
    console.log(taskName);
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log("editing taskType: ");
    console.log(taskType);

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].name = taskName;
            tasks[i].type = taskType;
            //tasks[i].status = statusValue
        }
    }
    console.log("Currently in EDIT MODE here is your array you are editing: ");//task will be edited after clicking the edit button
    console.log(tasks);
    

    //make it clear to the user that the form is now in "edit mode"
    //changing the textContent within the element of the native HTML document that has the id="#save-task"
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);

}

//function handles deleting the task
function deleteTask(taskId){
    //get the task list item element to delete
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    //console.log("console logging the taskSelected which to delete: ");
    //have to console log this separately otherwise chrome shows taskSelected as HTMLLIObject if concatted with the string in the same console log
    //console.log(taskSelected);
    //this is simply getting the attribute to display the data-task-id of the task item's delete button
    //var taskId = event.target.getAttribute("data-task-id");
    //console.log("called the function delete task for the task id: " + taskId);
    
    //this will remove the task-item but the next item that gets created after this one will have the next incremented id number I guess its not a huge deal.
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i = 0; i < tasks.length; i++){
        //if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if(tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    console.log("you deleted an item from the tasks array!!");
    console.log("tasks array currently has: ");
    console.log(tasks);

    //save tasks array after deleting a task item from the array
    console.log("executing saveTasks() function after deleting a task item from the array!!");
    saveTasks();
}

//function to handle the drag attribute
function dragTaskHandler(){
    //check to see if the function is targeting the correct HTML DOM element
    //console.log("we are targeting this DOM element: ", event.target);
    //console.log("we are targeting this event type: ", event.type);
    //console.log("we are targeting this event: ", event);

    //create variable to store the task id of the element we are targeting and then console log it.
    var taskId = event.target.getAttribute("data-task-id");
    //check to see if we are dragging the correct taskId
    console.log("dragTaskHandler is simply reading the Task ID of this DOM element: ", taskId);

    //store the taskId in the dataTransfer property of the event
    //set data recieves two arguments, first states the format of the data, second states the value of the data
    event.dataTransfer.setData("text/plain", taskId);
    //check to see if we are getting the correct data that we set in the data transfer
    var getId = event.dataTransfer.getData("text/plain");
    console.log("dragTaskHandler is getting the data from the getId variable that we set!!!: ");
    console.log("task ID that dragTaskHandler is getting: ", getId);
    console.log("data type of the ID dragTaskHandler is getting: ", typeof getId);
}

//function handles the dragging movement of the DOM HTML element
function dropZoneDragHandler(event){
    //this event.preventDefault function allows the element to be dropped!
    //but you need to specify where in a separate function that will "drop" it in the specified place
    //event.preventDefault();
    
    //this logs for every pixel instance that the DOM element is moving over...logs a lot!!!
    //console.log("Targeting the Dragover event on this HTML DOM element: ", event.target);

    //need this to specify which query selector we are searching which is the closest
    //in this case we are using the CSS class for the query selector
    //the event of dragging is targeting the closest element by the CSS class name .task-list
    event.target.closest(".task-list");
    //store the value of the event targeting the closest element with the same class name
    var taskListEl = event.target.closest(".task-list");
    //if the value is true its the closest - do these things.
    //also doesn't allow the element to be dropped anywhere except the closest!!!
    if (taskListEl){//true
        event.preventDefault();//make sure we can drop it somewhere and doesn't default back to original place
        //console dir to verify the element dropzone is what we want!!
        //console.dir(taskListEl);//if true also print to console which element it is which is closest based on the CSS class selector argument
        
        //adding some dynamically generated inline HTML styling which shows 
        //that a dragged element is being dragged over the task list element
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
    //******** REFERENCE CODE COMMENT ******* */
    //*******the function below checks to see if the dragging DOM element is a descendent element of the task list 
    //or the task list element itself
    //originates a search from the target element for an element that contains the selector
    //if the element with the selector is found, its returned as a DOM element, 
    //if not this function will return null
    //******targetElement.closest(selector); this is the example format DO NOT USE THIS WE DID NOT DEFINE targetElement
}

function dropTaskHandler(event){

    //checking to see if the element we are dropping onto is receiving the correct data
    //we also previously handled the closest element so that anything we drop onto we will not transfer data to any element except the closest()
    var dropId = event.dataTransfer.getData("text/plain");
    //console.log("Result of the dropTaskHandler getting the data from our event: ");
    //console.log("Event drop target: ", event.target);
    //console.log("Event drop DataTransfer: ", event.dataTransfer);
    //console.log("Element id string value which we received from the drop data transfer: ", id);

    //storing the element specified with the element from the DOM using the querySelector to specify 
    //the element by the HTML attribute text which we previously dynamically generated as "data-task-id="
    //id number from the getData transfer into a var as the draggableElement we want to drop
    var draggableElement = document.querySelector("[data-task-id='" + dropId + "']");
    //checking to see if what we dropped onto is what we want
    console.log("Logging HTML DOM element we dragged: ", draggableElement);
    console.log("Logging the HTML DOM directory we dragged: ");
    //**this will show a directory and make sure that the parent element we want to append onto
    //**is the one we dropped onto!! search into the dir and check parentElement
    console.dir(draggableElement);

    //store the element name that is closest which has the same CSS selector as ".task-list"
    var dropZoneEl = event.target.closest(".task-list");
    //store the id string associated with our closest identified parent element as statusType
    var statusType = dropZoneEl.id;
    console.log("Logging the parent element that we want to append to: ");
    console.log(statusType);
    console.log("Logging the parent element directory that we want to append to displayed as the id='string' in the native HTML document: ");
    console.dir(dropZoneEl);

    //set HTML status element as the document object which is the same as
    //the previously dynamically created attribute to be the same as our draggableElement
    //so that dragging the element does the same as selecting the status from the dropdown menu
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    //check to see if the function call dropTaskHandler() is producing the same result as selecting the status change
    //in the status change dropdown menu

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(dropId)){
            //tasks[i].name = taskName;
            //tasks[i].type = taskType;
            tasks[i].status = statusType
        }
    }
    console.log("updating status in the array by dropping!!! here is your array  you are editing: ");
    console.log(tasks);

    console.log("Element Dropped!! Status changed!!");
    console.log(statusSelectEl);
    console.dir(statusSelectEl);
    //**NOTE** */
    //querySelector traverses down form the reference point
    //while closest() traverses up to ancestor elements
    //to the root document from the reference element.

    //check to see if the dragged element is dropped into
    //one of these parent elements according to their names
    //which matches the id string associated with the native HTML <ul> parent element
    //so we know what parent element we want to append to
    if(statusType === "tasks-to-do"){
        statusSelectEl.selectedIndex = 0;
    } else if (statusType === "tasks-in-progress"){
        statusSelectEl.selectedIndex = 1;
    } else if (statusType === "tasks-completed"){
        statusSelectEl.selectedIndex = 2;
    }//NOTE selectedIndex: allows us to set the displayed option in a list by specifying
    //the option's 0-based position in the list (where 0 is the first list option etc.)
    //By assigning a number to selectedIndex, we're selecting the option that we want to display
    // in the <select> element. our code maps the statusType's id string values to option
    //numbers, and sets the selectedIndex value appropriately.

    //final step: appendchild(draggableElement);
    //we are appending our draggablechild element into
    //the parent element which is the dropZone
    dropZoneEl.appendChild(draggableElement);
    //remove the dynamic styling from the parent element after
    //the child element is appended into the dropped on parent element
    dropZoneEl.removeAttribute("style");

    //loop through tasks array to find and update the updated task's status
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].dropId === parseInt(dropId)){
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    console.log("Checking tasks array status change after dragging and dropping!!!");
    console.log(tasks);

    //save tasks into localStorage after dragging and dropping
    console.log("saveTask() function executed after dragging and dropping!!");
    saveTasks();

}

function dragLeaveHandler(){
    //checking the target DOM directory which the item is being dragged over
    //console.dir(event.target);

    //here the purpose is to remove the styling from previous element
    //from which the dragged element was last dragged from
    //targeting the closest() parent element specified by selector .task-list
    var taskListEl = event.target.closest(".task-list");
    //if the value is true its the closest parent element - do these things.
    if (taskListEl){
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

//handles the buttons inside the task box containing the task name and the buttons for edit delete 
pageContentEl.addEventListener("click", taskButtonHandler);

//listens for the event to change based on the result from the taskStatusChangeHandler() function
pageContentEl.addEventListener("change", taskStatusChangeHandler);

//listens for the event to start the dragging based on the result from dragTaskHandler() function
pageContentEl.addEventListener("dragstart", dragTaskHandler);

//listens for the event to start the dragover based on the result from dropZoneDragHandler() function
pageContentEl.addEventListener("dragover", dropZoneDragHandler);

//listens for the event to start the dropping of DOM element based on the result of the dropTaskHandler() function
pageContentEl.addEventListener("drop", dropTaskHandler);

//listens for the event of the item leaving an element and manage the removal of styling
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

//buttonEl.addEventListener("click", createTaskHandler);
//console.log(buttonElement);
