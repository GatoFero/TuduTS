"use strict";
class Task {
    constructor(taskName, author, priority, expiration) {
        this.edit = document.createElement('i');
        this.delete = document.createElement('i');
        this.up = document.createElement('i');
        this.down = document.createElement('i');
        this.author = author;
        this.taskName = taskName;
        this.priority = priority;
        this.expiration = expiration;
        this.setAttributeElement(this.edit, 'fas fa-edit');
        this.setAttributeElement(this.delete, 'fas fa-trash');
        this.setAttributeElement(this.up, 'fas fa-arrow-up');
        this.setAttributeElement(this.down, 'fas fa-arrow-down');
    }
    setAttributeElement(element, icon) {
        element.className = icon;
        element.style.padding = '0 5px';
        element.style.margin = '3px';
        element.style.cursor = 'pointer';
    }
}
class TasksList {
    constructor(tableTasks, tasks) {
        this.tasks = tasks;
        this.tableTasks = tableTasks;
        this.tableTasks.tableButton.addEventListener('click', () => this.addTask(this.tableTasks.getName(), this.tableTasks.getEncargado(), this.tableTasks.getSelect(), this.tableTasks.getDate()));
        this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
    }
    sendFunctionalities() {
        return [
            (event) => this.updateTask(event),
            (event) => this.deleteTask(event),
            (event) => this.moveUpTask(event),
            (event) => this.moveDownTask(event)
        ];
    }
    addTask(nameTask, encargado, prioridad, expiration) {
        if (nameTask !== '' && encargado != '' && prioridad != '' && expiration != '') {
            const newTask = new Task(nameTask, encargado, prioridad, expiration);
            this.tasks.push(newTask);
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        }
    }
    deleteTask(event) {
        const position = event.target.getAttribute("position");
        if (position) {
            this.tasks.splice(parseInt(position), 1);
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        }
    }
    moveUpTask(event) {
        const position = event.target.getAttribute("position");
        if (position) {
            if (parseInt(position) > 0) {
                const targetTask = this.tasks[parseInt(position) - 1];
                this.tasks[parseInt(position) - 1] = this.tasks[parseInt(position)];
                this.tasks[parseInt(position)] = targetTask;
                this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
            }
        }
    }
    moveDownTask(event) {
        const position = event.target.getAttribute("position");
        if (position) {
            if (parseInt(position) < this.tasks.length - 1) {
                const targetTask = this.tasks[parseInt(position) + 1];
                this.tasks[parseInt(position) + 1] = this.tasks[parseInt(position)];
                this.tasks[parseInt(position)] = targetTask;
                this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
            }
        }
    }
    updateTask(event) {
        const position = event.target.getAttribute("position");
        if (position) {
            this.tasks[parseInt(position)].taskName = this.tableTasks.getName();
            this.tasks[parseInt(position)].author = this.tableTasks.getEncargado();
            this.tasks[parseInt(position)].priority = this.tableTasks.getSelect();
            this.tasks[parseInt(position)].expiration = this.tableTasks.getDate();
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        }
    }
}
class Table {
    constructor(tableBody, tableButton, tableInputName, tableInputEncargado, tableSelect, tableDate) {
        this.tableBody = document.getElementById(tableBody);
        this.tableButton = document.getElementById(tableButton);
        this.tableInputName = document.getElementById(tableInputName);
        this.tableInputEncargado = document.getElementById(tableInputEncargado);
        this.tableSelect = document.getElementById(tableSelect);
        this.tableDate = document.getElementById(tableDate);
    }
    getName() {
        return this.tableInputName.value;
    }
    getEncargado() {
        return this.tableInputEncargado.value;
    }
    getSelect() {
        return this.tableSelect.value;
    }
    getDate() {
        return this.tableDate.value;
    }
    renderTableTasks(tasks, functionalities) {
        this.tableBody.innerHTML = '';
        this.tableInputEncargado.value = '';
        this.tableInputName.value = '';
        this.tableDate.value = '';
        tasks.forEach((task, index) => {
            const tr = document.createElement('tr');
            const fieldAction = this.setFieldsTask();
            const elementsFunctionality = [task.edit, task.delete, task.up, task.down];
            elementsFunctionality.forEach((element, idx) => {
                this.setChildTr(fieldAction, element, index.toString(), functionalities[idx]);
            });
            tr.appendChild(this.setFieldsTask((index + 1).toString(), 'fieldId'));
            tr.appendChild(this.setFieldsTask(task.taskName));
            tr.appendChild(this.setFieldsTask(task.author));
            tr.appendChild(this.setFieldsTask(task.priority, task.priority.toLowerCase()));
            const date = new Date(task.expiration);
            tr.appendChild(this.setFieldsTask(date.toLocaleDateString('en-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })));
            tr.appendChild(fieldAction);
            this.tableBody.appendChild(tr);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });
    }
    setFieldsTask(content, className) {
        const element = document.createElement('td');
        if (content)
            element.innerHTML = content;
        if (className)
            element.classList.add(className);
        return element;
    }
    setChildTr(field, element, position, functionality) {
        element.setAttribute("position", position);
        const newElement = element.cloneNode(true);
        newElement.addEventListener('click', functionality);
        field.appendChild(newElement);
    }
}
let tasks = [];
document.addEventListener('DOMContentLoaded', projectInit);
function projectInit() {
    const tableTask = new Table("listaTareas", "agregarTarea", "nuevaTarea", "nuevoEncargado", "prioridadTarea", "dateTask");
    if (localStorage.getItem('tasks')) {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));
        tasks = savedTasks.map((taskData) => new Task(taskData.taskName, taskData.author, taskData.priority, taskData.expiration));
        const taskList = new TasksList(tableTask, tasks);
        taskList.tableTasks.renderTableTasks(taskList.tasks, taskList.sendFunctionalities());
    }
}
