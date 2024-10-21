"use strict";
let assists = [];
document.addEventListener('DOMContentLoaded', projectInit);
function projectInit() {
    const assistanceElements = new AssistanceElements('fields', 'tablaAsistencia');
    if (localStorage.getItem('assists')) {
        assists = JSON.parse(localStorage.getItem('assists'));
    }
    const assistanceSystem = new AssistanceSystem(assists, assistanceElements);
    assistanceSystem.renderAssistsSystem();
}
class Assistance {
    constructor(name, date, typeAssistance) {
        this.name = name;
        this.date = date;
        this.typeAssistance = typeAssistance;
    }
}
class AssistanceElements {
    constructor(fieldsAttributes, table) {
        this.fieldName = document.createElement('input');
        this.fieldDate = document.createElement('input');
        this.fieldDate.type = 'date';
        this.fieldTypeAssistance = document.createElement('select');
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
            }
        ];
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.icon + '.' + option.color;
            optionElement.textContent = option.text;
            this.fieldTypeAssistance.appendChild(optionElement);
        });
        this.buttonAssists = document.createElement('button');
        this.buttonAssists.innerHTML = 'Añadir';
        this.buttonAssists.classList.add('field');
        const theadFields = ['Nombre y Apellido', 'Fecha', 'Asistencia', 'Actions'];
        const fields = document.getElementById(fieldsAttributes);
        fields.className = fieldsAttributes;
        fields.appendChild(this.createFieldAttribute(this.fieldName, theadFields[0]));
        fields.appendChild(this.createFieldAttribute(this.fieldDate, theadFields[1]));
        fields.appendChild(this.createFieldAttribute(this.fieldTypeAssistance, theadFields[2]));
        fields.appendChild(this.buttonAssists);
        this.theadFields = document.createElement('thead');
        this.tableAssists = document.createElement('tbody');
        const tableHtml = document.getElementById(table);
        const tr = document.createElement('tr');
        theadFields.forEach((fieldName) => {
            const th = document.createElement('th');
            th.innerHTML = fieldName;
            tr.appendChild(th);
        });
        this.theadFields.appendChild(tr);
        tableHtml.appendChild(this.theadFields);
        tableHtml.appendChild(this.tableAssists);
    }
    clearFields() {
        this.fieldName.value = '';
        this.fieldDate.value = '';
        this.fieldTypeAssistance.value = '';
    }
    clearTable() {
        this.tableAssists.innerHTML = '';
    }
    createFieldAttribute(field, label) {
        const fieldLabel = document.createElement('label');
        fieldLabel.innerHTML = label;
        const div = document.createElement('div');
        div.className = 'field';
        div.appendChild(fieldLabel);
        div.appendChild(field);
        return div;
    }
}
class AssistanceSystem {
    constructor(assists, assistanceElements) {
        this.assists = assists;
        this.assistanceElements = assistanceElements;
        this.assistanceElements.buttonAssists.addEventListener('click', () => {
            const assist = new Assistance(this.assistanceElements.fieldName.value, this.assistanceElements.fieldDate.value, this.assistanceElements.fieldTypeAssistance.value);
            this.addAssistance(assist);
            this.assistanceElements.clearFields();
        });
    }
    renderAssistsSystem() {
        this.assistanceElements.clearTable();
        this.assists.forEach((assistance, index) => {
            const tr = document.createElement('tr');
            tr.appendChild(this.createAssistanceField(assistance.name));
            const date = assistance.date ? new Date(assistance.date) : new Date();
            tr.appendChild(this.createAssistanceField(date.toLocaleDateString('en-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })));
            tr.appendChild(this.createAssistanceField(assistance.typeAssistance, true));
            console.log(assistance.typeAssistance);
            const fieldAction = this.createAssistanceField();
            const iconsAction = ['fas fa-edit', 'fas fa-trash', 'fas fa-arrow-up', 'fas fa-arrow-down'];
            iconsAction.forEach((icon, i) => {
                fieldAction.appendChild(this.createIconAction(icon, index, this.sendFunctionalities()[i]));
            });
            tr.appendChild(fieldAction);
            this.assistanceElements.tableAssists.appendChild(tr);
        });
        localStorage.setItem('assists', JSON.stringify(this.assists));
    }
    createIconAction(icon, position, functionality) {
        const i = document.createElement('i');
        i.className = icon;
        i.style.padding = '0 5px';
        i.style.margin = '3px';
        i.style.cursor = 'pointer';
        i.setAttribute("index", position.toString());
        i.addEventListener('click', functionality);
        return i;
    }
    createAssistanceField(content = '', select) {
        const element = document.createElement('td');
        if (select) {
            const classname = content.split('.');
            const i = document.createElement('i');
            i.className = classname[0];
            i.style.color = classname[1];
            element.appendChild(i);
        }
        else
            element.innerHTML = content;
        return element;
    }
    addAssistance(assistance) {
        if (!assistance.name)
            alert("El campo nombre no debe estar vació.");
        else if (!assistance.typeAssistance)
            alert("Debe seleccionar la asistencia.");
        else {
            this.assists.push(assistance);
            this.renderAssistsSystem();
        }
    }
    sendFunctionalities() {
        return [
            (event) => this.updateTask(event),
            (event) => this.deleteTask(event),
            (event) => this.moveUpTask(event),
            (event) => this.moveDownTask(event)
        ];
    }
    deleteTask(event) {
        const index = event.target.getAttribute("index");
        if (index) {
            this.assists.splice(parseInt(index), 1);
            this.renderAssistsSystem();
        }
    }
    moveUpTask(event) {
        const index = event.target.getAttribute("index");
        if (index) {
            if (parseInt(index) > 0) {
                const targetAssistance = this.assists[parseInt(index) - 1];
                this.assists[parseInt(index) - 1] = this.assists[parseInt(index)];
                this.assists[parseInt(index)] = targetAssistance;
                this.renderAssistsSystem();
            }
        }
    }
    moveDownTask(event) {
        const index = event.target.getAttribute("index");
        if (index) {
            if (parseInt(index) < this.assists.length - 1) {
                const targetAssistance = this.assists[parseInt(index) + 1];
                this.assists[parseInt(index) + 1] = this.assists[parseInt(index)];
                this.assists[parseInt(index)] = targetAssistance;
                this.renderAssistsSystem();
            }
        }
    }
    updateTask(event) {
        const index = event.target.getAttribute("index");
        if (index) {
            if (this.assistanceElements.fieldName.value != '')
                this.assists[parseInt(index)].name = this.assistanceElements.fieldName.value;
            this.assists[parseInt(index)].date = this.assistanceElements.fieldDate.value;
            if (this.assistanceElements.fieldTypeAssistance.value != this.assists[parseInt(index)].typeAssistance)
                this.assists[parseInt(index)].typeAssistance = this.assistanceElements.fieldTypeAssistance.value;
            this.renderAssistsSystem();
        }
    }
}
