document.addEventListener('DOMContentLoaded', projectInit);

function projectInit(): void {
    const tableTask = new Table("listaTareas", "agregarTarea", "nuevaTarea", "nuevoEncargado", "prioridadTarea");
    const tasksList = new TasksList(tableTask);
}

class Task {
    taskName: string;
    author: string;
    priority: string;
    edit: HTMLElement = document.createElement('i');
    delete: HTMLElement = document.createElement('i');
    up: HTMLElement = document.createElement('i');
    down: HTMLElement = document.createElement('i');

    constructor(taskName: string, priority: string, author: string) {
        this.author = author;
        this.taskName = taskName;
        this.priority = priority;
        this.setAttributeElement(this.edit, 'fas fa-edit');
        this.setAttributeElement(this.delete, 'fas fa-trash');
        this.setAttributeElement(this.up, 'fas fa-arrow-up');
        this.setAttributeElement(this.down, 'fas fa-arrow-down');
    }

    private setAttributeElement(element: HTMLElement, icon: string): void {
        element.className = icon;
        element.style.padding = '5px';
        element.style.margin = '3px';
        element.style.cursor = 'pointer';
    }
}

class TasksList {
    tasks: Task[] = [];
    tableTasks: Table;

    constructor(tableTasks: Table) {
        this.tableTasks = tableTasks;
        this.tableTasks.tableAddButton.addEventListener('click', () => this.addTask(this.tableTasks.getInputValue()
            , this.tableTasks.getSelectValue(),this.tableTasks.getInputValueEncargado()));
    }

    sendFunctionalities(): EventListenerOrEventListenerObject[]{
        return [
            (event) => this.updateTask(event),
            (event) => this.deleteTask(event),
            (event) => this.moveUpTask(event),
            (event) => this.moveDownTask(event)
        ];
    }

    addTask(inputValue: string, inputValueEncargado: string, selectPrioridad: string): void {
        if (inputValue !== null && inputValue !== "") {
            const newTask = new Task(inputValue, selectPrioridad, inputValueEncargado);
            this.tasks.push(newTask);
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        } else console.log("Ingrese un nombre para su tarea.");
    }

    deleteTask(event: Event): void {
        const position = (event.target as HTMLElement).getAttribute("position");
        if(position){
            this.tasks.splice(parseInt(position), 1);
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        }
    }

    moveUpTask(event: Event): void {
        const position = (event.target as HTMLElement).getAttribute("position");
        if(position){
            if(parseInt(position) > 0){
                const targetTask = this.tasks[parseInt(position) - 1];
                this.tasks[parseInt(position) - 1] = this.tasks[parseInt(position)];
                this.tasks[parseInt(position)] = targetTask;
                this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
            }
        }
    }

    moveDownTask(event: Event): void {
        const position = (event.target as HTMLElement).getAttribute("position");
        if(position){
            if(parseInt(position) < this.tasks.length - 1){
                const targetTask = this.tasks[parseInt(position) + 1];
                this.tasks[parseInt(position) + 1] = this.tasks[parseInt(position)];
                this.tasks[parseInt(position)] = targetTask;
                this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
            }
        }
    }

    updateTask(event: Event): void {
        const position = (event.target as HTMLElement).getAttribute("position");
        if(position){
            this.tasks[parseInt(position)].taskName = this.tableTasks.getInputValue();
            this.tasks[parseInt(position)].author = this.tableTasks.getSelectValue();
            this.tasks[parseInt(position)].priority = this.tableTasks.getInputValueEncargado();
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        }
    }
}

class Table {
    tableBody: HTMLTableSectionElement;
    tableAddButton: HTMLButtonElement;
    tableAddInput: HTMLInputElement;
    tableAddInputEncargado: HTMLInputElement;
    tableAddSelect: HTMLSelectElement;

    constructor(tableBody: string, tableAddButton: string, tableAddInput: string, tableAddInputEncargado: string, tableAddSelect: string) {
        this.tableBody = document.getElementById(tableBody) as HTMLTableSectionElement;
        this.tableAddButton = document.getElementById(tableAddButton) as HTMLButtonElement;
        this.tableAddInput = document.getElementById(tableAddInput) as HTMLInputElement;
        this.tableAddInputEncargado = document.getElementById(tableAddInputEncargado) as HTMLInputElement;
        this.tableAddSelect = document.getElementById(tableAddSelect) as HTMLSelectElement;
    }

    getInputValue(): string {
        return this.tableAddInput.value;
    }
    getInputValueEncargado(): string{
        return this.tableAddInputEncargado.value;
    }
    getSelectValue(): string{
        return this.tableAddSelect.value;
    }

    renderTableTasks(tasks: Task[], functionalities: EventListenerOrEventListenerObject[]): void {
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

    setChildTr(field: HTMLElement, element: HTMLElement, position: string, functionality: EventListenerOrEventListenerObject): void {
        element.setAttribute("position", position)
        const newElement = element.cloneNode(true) as HTMLElement;
        newElement.addEventListener('click', functionality);
        field.appendChild(newElement);
    }
}