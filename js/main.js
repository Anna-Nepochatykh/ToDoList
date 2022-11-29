function zero_first_format(value) {
    if (value < 10)
    {
        value='0'+value;
    }
    return value;
}

function getTime() {
    var time = new Date();
    var hours = zero_first_format(time.getHours());
    var minutes = zero_first_format(time.getMinutes());
    var seconds = zero_first_format(time.getSeconds());
    document.getElementById('header__time').innerHTML = hours + ':' + minutes + ':' + seconds;
}
setInterval(getTime, 0);

function getDate() {
    var date = new Date();
    var day = zero_first_format(date.getDate());
    var month = zero_first_format(date.getMonth());
    var year = date.getFullYear();
    document.getElementById('header__data').innerHTML = day + '.' + month + '.' + year + " г.";
}
setInterval(getDate, 0);

//Находим элемент на странице
const form = document.querySelector('#addTask__form'); //Нашли форму
const taskInput = document.querySelector('#taskInput'); //Нашли поле для ввода задач
const tasksList = document.querySelector('#tasksList'); //Нашли список задач
const emptyList = document.querySelector('#emptyList'); //Нашли список дел пуст

let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();


form.addEventListener('submit', addTask);//Добавление задачи
tasksList.addEventListener('click', deleteTask);//Удаление задачи
tasksList.addEventListener('click', doneTask);//Выполнение задачи

function addTask(event) {
    //Отменяем отправку формы
    event.preventDefault();
    
    //Достаем текст задачи из поля вводв
    const taskText = taskInput.value;

    //Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    //Добавляем задачу в массив с задачами
    tasks.push(newTask);
    saveToLocalStorage();
    renderTask(newTask);

    //Очищаем поле ввода и возвращаем на него фокус
    taskInput.value = "";
    taskInput.focus();
    
    checkEmptyList();
}

function deleteTask(event) {
    //Если клик был не по кнопке удалить задачу
    if(event.target.dataset.action !== "delete") return;

    //Клик был по кнопке удалить задачу
    const parentNode = event.target.closest('.addTask__listItem');

    //Определяем ID задачи
    const id = Number(parentNode.id);

    //Удаляем задачу через фильтрацию массива
    tasks = tasks.filter((task) => task.id !== id);
    saveToLocalStorage();

    //Удаляем задачу из разметки
    parentNode.remove();

    checkEmptyList();
}

function doneTask(event) {
    //Если клик был не по кнопке задача выполнена
    if(event.target.dataset.action !== "done") return;

    //Клик был по кнопке задача выполнена
    const parentNode = event.target.closest('.addTask__listItem');

    //Определяем ID задачи
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.addTask__listTitle');
    taskTitle.classList.toggle('addTask__listTitle--done');
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="addTask__listEmpty">
            <img src="./img/icons/leaf.svg" alt="Empty" width="50">
            <div class="addTask__listEmpty-title">Список дел пуст</div>
        </li>`;

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    //Формируем css класс
    const cssClass = task.done ? "addTask__listTitle addTask__listTitle--done" : "addTask__listTitle";

    //Формируем разметку для новой задачи
    const taskHTML = `
    <li id="${task.id}" class="addTask__listItem">
        <span class="${cssClass}">${task.text}</span>
        <div class="addTask__listBtn">
            <button type="button" data-action="done" class="addTask__listBtn">
                <img src="./img/icons/tick.svg" alt="Done">
            </button>
            <button type="button" data-action="delete" class="addTask__listBtn">
                <img src="./img/icons/delete.svg" alt="Done">
            </button>
        </div>
    </li>`;
    
    //Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}