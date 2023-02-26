//Select elements

const form = document.getElementById('todo-form'); 
const todoInput = document.getElementById('todo-input');
const todosListEle = document.getElementById('todo-items');
const notificationEl = document.querySelector('.notification');
const delete_All_todo = document.getElementById('delete-all');


delete_All_todo.addEventListener('click', deleteAll);


// to save todo we use array 
// and initial it store in localStorage so that our todo should not lost after refreshing 

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;//global variable 
renderTodos();

//Form submits 
//this is for hit on ENTER button event start
form.addEventListener('submit',function (event) {
    showNotification("New Todo-item added");
    event.preventDefault();//this will don't make my form refresh again and again
    // console.log(event);
    // to save todo function save todo 
    saveTodo();
    renderTodos();
    //for storing to the local storage in the form of String Json
    localStorage.setItem('todos', JSON.stringify(todos));
});
    

//this is for when we click on + icon button on todo-list event start
function i(event){
    showNotification("New Todo-item added");
    event.preventDefault();//this will don't make my form refresh again and again
    // console.log(event);
    // to save todo function save todo 
    saveTodo();
    renderTodos();
    //for storing to the local storage in the form of String Json
    localStorage.setItem('todos', JSON.stringify(todos));
}


//saveTodo function for storing todo into the array
function saveTodo(){
    const todoValue = todoInput.value;
    
    //check for the duplicate Todos then popup msg came and alert
    const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());


    //check if the todo is empty then pop msg showing
    const isEmpty = todoValue ==='';

    if(isEmpty){
        showNotification(`You have to enter some todo-items`);
    }else if(isDuplicate){
        showNotification(`In Todo-LisT item is already present`)
    }else{
        //update todos
        if(EditTodoId >= 0){
            //update the edited todos
            //here basically if we click edit todo, and then click on delete button then edit todo will now change into the new todo
            //for that i use map concept in javascript
            todos = todos.map((todo,index)=>({
                    ...todo,
                    value : index === EditTodoId ? todoValue : todo.value,
                }));
            EditTodoId = -1;//next time if user want to then for that need to change value -1 again
        }else{

            //create a object to store todoInputs
            const todo = { 
                value:todoValue,
                checked: false,
                item:'active',
                color:'#'+ Math.floor(Math.random()*16777215).toString(16) //this will create random color
            }
        
            // pass todo object value to an array  
            todos.push(todo);
            
        
            // console.log(todos);

        }
        todoInput.value = '';//every time after entering todo we need to clear the input box 
       
    }

  
}


//RENDER TODO 
//this renderTodos function will play a key role  as manipulating the HTML file
function renderTodos() {
    if(todos.length === 0){
        todosListEle.innerHTML = `<div class="sty"> Noting to do! </div>`;
        return;
    }

    //clear element before the re-render
    todosListEle.innerHTML ="";
  //this is activating the HTML file
    todos.forEach((todo,index)=>{
        todosListEle.innerHTML +=`
            <div class="todo-item " id=${index}>
                <div  class="fine left checked" id=${index}>
                    <div class="fine check" id=${index} data-action="check">
                        <div class="check-mark checked " data-action="check">
                            <i 
                            class="fa-duotone fa-regular ${todo.checked ? 'fa-circle-check':'fa-circle'}"
                            style="color : ${todo.color} "
                            data-action="check"
                            ></i>
                        </div>
                    </div>
                    <div class="todo-text ${todo.checked ? 'mark':''}" data-action="check">
                        ${todo.value}
                    </div>
                </div>
                <div  class="right">
                    <div class=" fine edit" data-action="edit" id=${index}>
                        <i class="fa-solid fa-pen-to-square" data-action="edit" ></i>
                    </div>
                    <div class="fine del" data-action="delete" id=${index} >
                        <i class="fa-solid fa-trash" data-action="delete"></i>
                    </div>
                </div>
            </div>
        `;
    });
    updateTask();//here todo task update
}


//CLICK EVENTS LISTENER FOR ALL THE TODOs
todosListEle.addEventListener('click', (event) => {
        const target = event.target;

        // console.log(target);
        const parentEl = target.parentNode;
        
        if(!parentEl.classList.contains('fine')) return; 
        //todo
        const todo = parentEl;
        // console.log(todo);
        const todoId = Number(todo.id);
        // console.log(todoId);

        //target action 
        const action = target.dataset.action;

        // console.log(todoId , action);

        action === 'check' && checkTodo(todoId);//all the action hit here and reflected in the todo list
        action === "edit" && editTodo(todoId);
        action === "delete" && deleteTodo(todoId);
        
        // console.log(todoId,action);
        // console.log(parentEl);

        // console.log(target);
})


// CHECK A TODO

function checkTodo(todoId){
    //here we check you todo all click functionality perform here
    todos = todos.map((todo,index) => ({
                ...todo,
                 checked : index === todoId ? !todo.checked:(todo.checked),
             }));

    // todos = newArr;

    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
    updateTask();
}


//EDIT TODO FUNCTION
function editTodo(todoId){
    // fetch the todoId then value of it 
    todoInput.value = todos[todoId].value;

    //add the edit function into the todo-list
    EditTodoId = todoId;
}

//DELETE TODO FUNCTION
function deleteTodo(todoId){

    //this will help in editing the todo list
    todos = todos.filter((todo,index)=> index!=todoId);
    EditTodoId = -1;
    // re-render todo after deleting 
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
    updateTask();
}


// SHOW NOTIFICATION DISPLAY 

function showNotification(msg){
    //change the inner html mean change msg
    notificationEl.innerHTML = msg;

    //notification enter
    notificationEl.classList.add('notif-enter');
    
    //notification disappear after sometime so use setTimeout cllBack function
    setTimeout(()=>{
        notificationEl.classList.remove('notif-enter');
    },2500);
}

//deletes all the tasks
function deleteAll(todo) {
    todos = [];
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
    showNotification("ALL Todo-item has deleted by YOU");//giving popup alert msg
    

}
function updateTask() {
    //this will update my total task on todo
    const total = document.querySelector(".items-left");
    const completedT = document.querySelector(".completedT");
    completedT.innerText = ` (${todos.length})`;
  }
