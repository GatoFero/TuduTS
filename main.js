"use strict";
document.addEventListener('DOMContentLoaded', projectInit);
function projectInit() {
    const tableTask = new Table("listaTareas", "agregarTarea", "nuevaTarea", "nuevoEncargado", "prioridadTarea");
    const tasksList = new TasksList(tableTask);
}
class Task {
    constructor(taskName, priority, author) {
        this.edit = document.createElement('i');
        this.delete = document.createElement('i');
        this.up = document.createElement('i');
        this.down = document.createElement('i');
        this.author = author;
        this.taskName = taskName;
        this.priority = priority;
        this.setAttributeElement(this.edit, 'fas fa-edit');
        this.setAttributeElement(this.delete, 'fas fa-trash');
        this.setAttributeElement(this.up, 'fas fa-arrow-up');
        this.setAttributeElement(this.down, 'fas fa-arrow-down');
    }
    setAttributeElement(element, icon) {
        element.className = icon;
        element.style.padding = '5px';
        element.style.margin = '3px';
        element.style.cursor = 'pointer';
    }
}
class TasksList {
    constructor(tableTasks) {
        this.tasks = [];
        this.tableTasks = tableTasks;
        this.tableTasks.tableAddButton.addEventListener('click', () => this.addTask(this.tableTasks.getInputValue(), this.tableTasks.getSelectValue(), this.tableTasks.getInputValueEncargado()));
    }
    sendFunctionalities() {
        return [
            (event) => this.updateTask(event),
            (event) => this.deleteTask(event),
            (event) => this.moveUpTask(event),
            (event) => this.moveDownTask(event)
        ];
    }
    addTask(inputValue, inputValueEncargado, selectPrioridad) {
        if (inputValue !== null && inputValue !== "") {
            const newTask = new Task(inputValue, selectPrioridad, inputValueEncargado);
            this.tasks.push(newTask);
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        }
        else
            console.log("Ingrese un nombre para su tarea.");
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
            this.tasks[parseInt(position)].taskName = this.tableTasks.getInputValue();
            this.tasks[parseInt(position)].author = this.tableTasks.getSelectValue();
            this.tasks[parseInt(position)].priority = this.tableTasks.getInputValueEncargado();
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        }
    }
}
class Table {
    constructor(tableBody, tableAddButton, tableAddInput, tableAddInputEncargado, tableAddSelect) {
        this.tableBody = document.getElementById(tableBody);
        this.tableAddButton = document.getElementById(tableAddButton);
        this.tableAddInput = document.getElementById(tableAddInput);
        this.tableAddInputEncargado = document.getElementById(tableAddInputEncargado);
        this.tableAddSelect = document.getElementById(tableAddSelect);
    }
    getInputValue() {
        return this.tableAddInput.value;
    }
    getInputValueEncargado() {
        return this.tableAddInputEncargado.value;
    }
    getSelectValue() {
        return this.tableAddSelect.value;
    }
    renderTableTasks(tasks, functionalities) {
        this.tableBody.innerHTML = '';
        tasks.forEach((task, index) => {
            const tr = document.createElement('tr');
            const fieldId = document.createElement('td');
            const fieldTaskName = document.createElement('td');
            const fieldTaskEncargado = document.createElement('td');
            const fieldTaskPrioridad = document.createElement('td');
            const fieldAction = document.createElement('td');
            fieldId.innerHTML = (index + 1).toString();
            fieldTaskName.innerHTML = task.taskName;
            fieldTaskEncargado.innerHTML = task.author;
            fieldTaskPrioridad.innerHTML = task.priority;
            const elementsFunctionality = [task.edit, task.delete, task.up, task.down];
            elementsFunctionality.forEach((element, idx) => {
                this.setChildTr(fieldAction, element, index.toString(), functionalities[idx]);
            });
            tr.appendChild(fieldId);
            tr.appendChild(fieldTaskName);
            tr.appendChild(fieldTaskPrioridad);
            tr.appendChild(fieldTaskEncargado);
            tr.appendChild(fieldAction);
            this.tableBody.appendChild(tr);
        });
    }
    setChildTr(field, element, position, functionality) {
        element.setAttribute("position", position);
        const newElement = element.cloneNode(true);
        newElement.addEventListener('click', functionality);
        field.appendChild(newElement);
    }
}
