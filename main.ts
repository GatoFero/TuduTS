let assists: Assistance[] = [];
document.addEventListener('DOMContentLoaded', projectInit);

function projectInit(): void {
    const assistanceElements = new AssistanceElements('fields', 'tablaAsistencia');
    if (localStorage.getItem('assists')){
        assists = JSON.parse(<string>localStorage.getItem('assists'));
    }
    const assistanceSystem = new AssistanceSystem(assists, assistanceElements);
    assistanceSystem.renderAssistsSystem();
}

class Assistance {
    name: string;
    date: string;
    typeAssistance: string;

    constructor(name: string, date: string, typeAssistance: string) {
        this.name = name;
        this.date = date;
        this.typeAssistance = typeAssistance;
    }
}

class AssistanceElements {
    fieldName: HTMLInputElement;
    fieldDate: HTMLInputElement;
    fieldTypeAssistance: HTMLSelectElement;
    theadFields: HTMLTableSectionElement;
    tableAssists: HTMLTableSectionElement;
    buttonAssists: HTMLButtonElement;

    constructor(fieldsAttributes: string, table: string) {
        this.fieldName = document.createElement('input') as HTMLInputElement;
        this.fieldDate = document.createElement('input') as HTMLInputElement;
        this.fieldDate.type = 'date';
        this.fieldTypeAssistance = document.createElement('select') as HTMLSelectElement;
        const options = [
            {
                'icon': 'fa-solid fa-user-check',
                'color': '#00e6a4',
                'text': 'Presente'
            },
            {
                'icon': 'fa-solid fa-user-clock',
                'color': '#FFD43B',
                'text': 'Tardanza'
            },
            {
                'icon': 'fa-solid fa-user-xmark',
                'color': '#FF0033',
                'text': 'Falta'
            }];
        options.forEach(option => {
            const optionElement = document.createElement('option') as HTMLOptionElement;
            optionElement.value = option.icon + '.' + option.color;
            optionElement.textContent = option.text;
            this.fieldTypeAssistance.appendChild(optionElement);
        });
        this.buttonAssists = document.createElement('button') as HTMLButtonElement;
        this.buttonAssists.innerHTML = 'Añadir';
        this.buttonAssists.classList.add('field');
        const theadFields = ['Nombre y Apellido', 'Fecha', 'Asistencia', 'Actions'];
        const fields = document.getElementById(fieldsAttributes) as HTMLDivElement;
        fields.className = fieldsAttributes;
        fields.appendChild(this.createFieldAttribute(this.fieldName, theadFields[0]))
        fields.appendChild(this.createFieldAttribute(this.fieldDate, theadFields[1]))
        fields.appendChild(this.createFieldAttribute(this.fieldTypeAssistance, theadFields[2]));
        fields.appendChild(this.buttonAssists);
        this.theadFields = document.createElement('thead') as HTMLTableSectionElement;
        this.tableAssists = document.createElement('tbody') as HTMLTableSectionElement;
        const tableHtml = document.getElementById(table) as HTMLTableElement;
        const tr = document.createElement('tr');

        theadFields.forEach((fieldName: string) => {
            const th = document.createElement('th');
            th.innerHTML = fieldName;
            tr.appendChild(th);
        })
        this.theadFields.appendChild(tr);
        tableHtml.appendChild(this.theadFields);
        tableHtml.appendChild(this.tableAssists);
    }

    clearFields(): void {
        this.fieldName.value = '';
        this.fieldDate.value = '';
        this.fieldTypeAssistance.value = '';
    }

    clearTable(): void {
        this.tableAssists.innerHTML = '';
    }

    createFieldAttribute(field: HTMLElement, label: string): HTMLDivElement{
        const fieldLabel = document.createElement('label') as HTMLLabelElement;
        fieldLabel.innerHTML = label;
        const div = document.createElement('div') as HTMLDivElement;
        div.className = 'field';
        div.appendChild(fieldLabel);
        div.appendChild(field);
        return div;
    }
}

class AssistanceSystem {
    assists: Assistance[];
    assistanceElements: AssistanceElements;

    constructor(assists: Assistance[], assistanceElements: AssistanceElements) {
        this.assists = assists;
        this.assistanceElements = assistanceElements;
        this.assistanceElements.buttonAssists.addEventListener('click', () => {
            const assist = new Assistance(this.assistanceElements.fieldName.value,
                    this.assistanceElements.fieldDate.value,
                    this.assistanceElements.fieldTypeAssistance.value);
            this.addAssistance(assist);
            this.assistanceElements.clearFields();
        });
    }

    renderAssistsSystem(): void {
        this.assistanceElements.clearTable();
        this.assists.forEach((assistance, index) => {
            const tr = document.createElement('tr');
            tr.appendChild(this.createAssistanceField(assistance.name));
            const date = assistance.date? new Date(assistance.date) : new Date();
            tr.appendChild(this.createAssistanceField(
                date.toLocaleDateString('en-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })));
            tr.appendChild(this.createAssistanceField(assistance.typeAssistance, true));
            console.log(assistance.typeAssistance);
            const fieldAction = this.createAssistanceField();
            const iconsAction = ['fas fa-edit', 'fas fa-trash', 'fas fa-arrow-up', 'fas fa-arrow-down'];
            iconsAction.forEach((icon, i) => {
                fieldAction.appendChild(this.createIconAction(icon, index, this.sendFunctionalities()[i]))
            })
            tr.appendChild(fieldAction);
            this.assistanceElements.tableAssists.appendChild(tr);
        });
        localStorage.setItem('assists', JSON.stringify(this.assists));
    }

    createIconAction(icon: string, position: number, functionality: EventListenerOrEventListenerObject): HTMLElement{
        const i = document.createElement('i');
        i.className = icon;
        i.style.padding = '0 5px';
        i.style.margin = '3px';
        i.style.cursor = 'pointer';
        i.setAttribute("index", position.toString())
        i.addEventListener('click', functionality);
        return i;
    }

    createAssistanceField(content: string = '', select?: boolean): HTMLElement {
        const element = document.createElement('td');
        if (select) {
            const classname = content.split('.');
            const i = document.createElement('i');
            i.className = classname[0];
            i.style.color = classname[1];
            element.appendChild(i);

        } else element.innerHTML = content;
        return element;
    }

    addAssistance(assistance: Assistance): void {
        if (!assistance.name)
            alert("El campo nombre no debe estar vació.")
        else if (!assistance.typeAssistance)
            alert("Debe seleccionar la asistencia.")
        else{
            this.assists.push(assistance);
            this.renderAssistsSystem();
        }
    }

    sendFunctionalities(): EventListenerOrEventListenerObject[]{
        return [
            (event) => this.updateTask(event),
            (event) => this.deleteTask(event),
            (event) => this.moveUpTask(event),
            (event) => this.moveDownTask(event)
        ];
    }

    deleteTask(event: Event): void {
        const index = (event.target as HTMLElement).getAttribute("index");
        if(index){
            this.assists.splice(parseInt(index), 1);
            this.renderAssistsSystem()
        }
    }

    moveUpTask(event: Event): void {
        const index = (event.target as HTMLElement).getAttribute("index");
        if(index){
            if(parseInt(index) > 0){
                const targetAssistance = this.assists[parseInt(index) - 1];
                this.assists[parseInt(index) - 1] = this.assists[parseInt(index)];
                this.assists[parseInt(index)] = targetAssistance;
                this.renderAssistsSystem();
            }
        }
    }

    moveDownTask(event: Event): void {
        const index = (event.target as HTMLElement).getAttribute("index");
        if(index){
            if(parseInt(index) < this.assists.length - 1){
                const targetAssistance = this.assists[parseInt(index) + 1];
                this.assists[parseInt(index) + 1] = this.assists[parseInt(index)];
                this.assists[parseInt(index)] = targetAssistance;
                this.renderAssistsSystem()
            }
        }
    }

    updateTask(event: Event): void {
        const index = (event.target as HTMLElement).getAttribute("index");
        if(index){
            if (this.assistanceElements.fieldName.value != '')
                this.assists[parseInt(index)].name = this.assistanceElements.fieldName.value;
            this.assists[parseInt(index)].date = this.assistanceElements.fieldDate.value;
            if (this.assistanceElements.fieldTypeAssistance.value != this.assists[parseInt(index)].typeAssistance)
                this.assists[parseInt(index)].typeAssistance = this.assistanceElements.fieldTypeAssistance.value;
            this.renderAssistsSystem();
        }
    }
}