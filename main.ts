class Task {
    taskName: string;
    author: string;
    priority: string;
    expiration: string;
    edit: HTMLElement = document.createElement('i');
    delete: HTMLElement = document.createElement('i');
    up: HTMLElement = document.createElement('i');
    down: HTMLElement = document.createElement('i');

    constructor(taskName: string, author: string, priority: string, expiration: string) {
        this.author = author;
        this.taskName = taskName;
        this.priority = priority;
        this.expiration = expiration;
        this.setAttributeElement(this.edit, 'fas fa-edit');
        this.setAttributeElement(this.delete, 'fas fa-trash');
        this.setAttributeElement(this.up, 'fas fa-arrow-up');
        this.setAttributeElement(this.down, 'fas fa-arrow-down');
    }

    private setAttributeElement(element: HTMLElement, icon: string): void {
        element.className = icon;
        element.style.padding = '0 5px';
        element.style.margin = '3px';
        element.style.cursor = 'pointer';
    }
}

class TasksList {
    tasks: Task[];
    tableTasks: Table;

    constructor(tableTasks: Table, tasks: Task[]) {
        this.tasks = tasks;
        this.tableTasks = tableTasks;
        this.tableTasks.tableButton.addEventListener('click', () => this.addTask(this.tableTasks.getName()
            , this.tableTasks.getEncargado(),this.tableTasks.getSelect(), this.tableTasks.getDate()));
        this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
    }

    sendFunctionalities(): EventListenerOrEventListenerObject[]{
        return [
            (event) => this.updateTask(event),
            (event) => this.deleteTask(event),
            (event) => this.moveUpTask(event),
            (event) => this.moveDownTask(event)
        ];
    }

    addTask(nameTask: string, encargado: string, prioridad: string, expiration: string): void {
        if (nameTask !== '' && encargado != '' && prioridad != '' && expiration != '') {
            const newTask = new Task(nameTask, encargado, prioridad, expiration);
            this.tasks.push(newTask);
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        }
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
            this.tasks[parseInt(position)].taskName = this.tableTasks.getName();
            this.tasks[parseInt(position)].author = this.tableTasks.getEncargado();
            this.tasks[parseInt(position)].priority = this.tableTasks.getSelect();
            this.tasks[parseInt(position)].expiration = this.tableTasks.getDate();
            this.tableTasks.renderTableTasks(this.tasks, this.sendFunctionalities());
        }
    }
}

class Table {
    tableBody: HTMLTableSectionElement;
    tableButton: HTMLButtonElement;
    tableInputName: HTMLInputElement;
    tableInputEncargado: HTMLInputElement;
    tableSelect: HTMLSelectElement;
    tableDate: HTMLInputElement;

    constructor(tableBody: string, tableButton: string,
                tableInputName: string, tableInputEncargado: string,
                tableSelect: string, tableDate: string) {
        this.tableBody = document.getElementById(tableBody) as HTMLTableSectionElement;
        this.tableButton = document.getElementById(tableButton) as HTMLButtonElement;
        this.tableInputName = document.getElementById(tableInputName) as HTMLInputElement;
        this.tableInputEncargado = document.getElementById(tableInputEncargado) as HTMLInputElement;
        this.tableSelect = document.getElementById(tableSelect) as HTMLSelectElement;
        this.tableDate = document.getElementById(tableDate) as HTMLInputElement;
    }

    getName(): string {
        return this.tableInputName.value;
    }
    getEncargado(): string{
        return this.tableInputEncargado.value;
    }
    getSelect(): string{
        return this.tableSelect.value;
    }
    getDate(): string{
        return this.tableDate.value;
    }

    renderTableTasks(tasks: Task[], functionalities: EventListenerOrEventListenerObject[]): void {
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

    setFieldsTask(content?: string, className?: string): HTMLElement {
        const element = document.createElement('td');
        if (content) element.innerHTML = content;
        if (className) element.classList.add(className);
        return element;
    }

    setChildTr(field: HTMLElement, element: HTMLElement, position: string, functionality: EventListenerOrEventListenerObject): void {
        element.setAttribute("position", position)
        const newElement = element.cloneNode(true) as HTMLElement;
        newElement.addEventListener('click', functionality);
        field.appendChild(newElement);
    }
}


let tasks: Task[] = [];

document.addEventListener('DOMContentLoaded', projectInit);

function projectInit(): void {
    const tableTask: Table = new Table("listaTareas", "agregarTarea", "nuevaTarea", "nuevoEncargado", "prioridadTarea", "dateTask");
    if (localStorage.getItem('tasks')) {
        const savedTasks = JSON.parse(<string>localStorage.getItem('tasks'));
        tasks = savedTasks.map((taskData: any) => new Task(taskData.taskName, taskData.author, taskData.priority, taskData.expiration));
        const taskList: TasksList = new TasksList(tableTask, tasks);
        taskList.tableTasks.renderTableTasks(taskList.tasks, taskList.sendFunctionalities());
    }
}
