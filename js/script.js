const form = document.getElementById('form');
const name = document.getElementById('name');
const price = document.getElementById('price');
const heat = document.getElementById('heat');
const toppings = document.getElementById('toppings');
const photo = document.getElementById('photo');

const pizzaTable = document.getElementById('pizza-table');

let messages = [];

let pizza = {}

function checkName() {
    let nameValue = name.value.trim();
    if (nameValue === '' || nameValue === null) {
        setError(name, 'Pizza should be named');
        messages.push('Pizza should be named');
        return false;
    }
    if (nameValue.length > 30) {
        setError(name, 'Pizza name should be under 30 characters');
        messages.push('Pizza name should be under 30 characters');
        return false;
    }
    if (sessionStorage.getItem(nameValue) !== null) {
        setError(name, 'Pizza with this name already exists');
        messages.push('Pizza with this name already exists');
        return false;
    }
    pizza["name"] = nameValue;
    setSucess(name);
    return true;
}

function checkPrice() {
    let priceValue = price.value.trim();
    if (priceValue.length === 0) {
        setError(price, 'A price is required');
        messages.push('A price is required');
        return false;
    }
    if (!/^[+-]?\d+(\.\d{0,2})?$/.test(priceValue)) {
        setError(price, 'A numeric price with up to two decimal places must be entered');
        messages.push('A numeric price with up to two decimal places must be entered');
        price.value = '';
        return false;
    }
    let priceValueFloat = parseFloat(priceValue);
    if (priceValueFloat <= 0) {
        setError(price, 'Price must be higher than 0');
        messages.push('Price must be higher than 0');
        price.value = '';
        return false;
    }
    pizza["price"] = priceValueFloat;
    setSucess(price);
    return true;
}

function checkHeat() {
    let heatValue = heat.value.trim();
    console.log('this is the heat value ', heat.value.trim())
    let heatValueInt = 0;
    if (heatValue.length === 0) {
        setSucess(heat);
        return true;
    }
    if (!/^[+-]?\d+$/.test(heatValue)) {
        setError(heat, 'Heat should be expressed in integer values');
        messages.push('Heat should be expressed in integer values');
        heat.value = '';
        return false;
    }
    heatValueInt = parseInt(heatValue);
    if (heatValueInt < 1 || heatValueInt > 3) {
        setError(heat, 'Heat should be expressed in scale of 1 to 3');
        messages.push('Heat should be expressed in scale of 1 to 3');
        heat.value = '';
        return false;
    }
    pizza["heat"] = heatValueInt;
    setSucess(heat);
    return true;
}

function checkToppings() {
    let toppingsValue = toppings.value.trim();
    let toppingsValueArray = toppingsValue.split(',').filter(function (e) {
        return e != '';
    });
    if (toppingsValueArray.length < 2) {
        setError(toppings, 'There should be at least two toppings entered');
        messages.push('There should be at least two toppings entered');
        toppings.value = '';
        return false;
    }
    pizza["toppings"] = toppingsValueArray;
    setSucess(toppings);
    return true;
}

function checkPhoto() {
    let photoValue = photo.value.trim();
    let allowedValues = ['', '1', '2', '3', '4'];
    if (!allowedValues.includes(photoValue)) {
        setError(photo, 'Please enter number corresponding with provided photo');
        messages.push('Please enter number corresponding with provided photo');
        photo.value = '';
        return false;
    }
    pizza["photo"] = photoValue;
    setSucess(photo);
    return true;
}

function setError(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    small.innerText = message;
    formControl.className = 'form-control error';
}

function setSucess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function checkInputs() {
    checkName();
    checkPrice();
    checkHeat();
    checkToppings();
    checkPhoto();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    messages = []
    checkInputs();
    if (messages.length > 0) {
        console.log(messages);
    }
    if (messages.length === 0) {
        sessionStorage.setItem(name.value.trim(), JSON.stringify(pizza));
        console.log(pizza);
        pizza = {};
        clearPizzaForm();
    }
})

function addPizza() {
    document.getElementById('table-container').style.display = "none";
    document.getElementById('form-container').style.display = "block";
}

function checkSize(pizzas) {
    if (pizzas.length === 0) {
        document.getElementById('viewPizzaHeader').innerText = "There are currently no pizzas";
        return false;
    }
    document.getElementById('viewPizzaHeader').innerText = "Here are the pizzas";
    return true;
}

function sortByNameAscending() {
    let pizzas = deserializeData().sort((a, b) => (a.name > b.name) ? 1 : -1);
    if (checkSize(pizzas)) {
        clearTable();
        populateTable(pizzaTable, pizzas);
    }
}

function sortByNameDescending() {
    let pizzas = deserializeData().sort((a, b) => (a.name < b.name) ? 1 : -1);
    if (checkSize(pizzas)) {
        clearTable();
        populateTable(pizzaTable, pizzas);
    }
}

function sortByPriceAscending() {
    let pizzas = deserializeData().sort((a, b) => (a.price > b.price) ? 1 : -1);
    if (checkSize(pizzas)) {
        clearTable();
        populateTable(pizzaTable, pizzas);
    }
}

function sortByPriceDescending() {
    let pizzas = deserializeData().sort((a, b) => (a.price < b.price) ? 1 : -1);
    if (checkSize(pizzas)) {
        clearTable();
        populateTable(pizzaTable, pizzas);
    }
}

function sortByHeatAscending() {
    let pizzas = deserializeData().sort((a, b) => (a.heat > b.heat) ? 1 : -1);
    if (checkSize(pizzas)) {
        clearTable();
        populateTable(pizzaTable, pizzas);
    }
}

function sortByHeatDescending() {
    let pizzas = deserializeData().sort((a, b) => (a.heat < b.heat) ? 1 : -1);
    if (checkSize(pizzas)) {
        clearTable();
        populateTable(pizzaTable, pizzas);
    }
}

function deserializeData() {
    let pizzas = [];
    let keys = Object.keys(sessionStorage);
    let i;
    let pizza;
    for (i = 0; i < keys.length; i++) {
        pizza = JSON.parse(sessionStorage.getItem(keys[i]));
        pizzas.push(pizza);
    }
    return pizzas;

}

function clearPizzaForm() {
    document.getElementById("form").reset();
    let formControls = document.querySelectorAll(".form-control");
    console.log("this is formcontrols ", formControls);
    document.querySelectorAll('.form-control').forEach(function (formControl) {
        formControl.className = 'form-control';
    });
}

function viewPizza() {
    document.getElementById('form-container').style.display = "none";
    document.getElementById('table-container').style.display = "block";
    clearPizzaForm();
    sortByNameAscending();
}

function populateTable(table, data) {
    for (let element of data) {
        console.log("This is the element ", element);
        let row = table.insertRow();
        let cell = row.insertCell();
        let nameValue = element['name'];
        cell.appendChild(document.createTextNode(nameValue));
        cell = row.insertCell();
        let heatNumber = element['heat'];
        console.log("This is number heat ", heatNumber);
        let heatInsert = '';
        let heatImage = '<img class="heat-image" src="img/pepper.png"/>';
        for (i = 0; i < heatNumber; i++) {
            heatInsert += heatImage;
        }
        cell.innerHTML = heatInsert;
        cell = row.insertCell();
        cell.appendChild(document.createTextNode(element['price']));
        cell = row.insertCell();
        cell.appendChild(document.createTextNode(element['toppings'].sort().join(', ')));
        cell = row.insertCell();
        let pizzaImage = '';
        let photoSelected = element['photo'];
        if (photoSelected !== '') {
            pizzaImage = '<img src="img/' + photoSelected + '.jpg"/>';
        }
        cell.innerHTML = pizzaImage;
        cell = row.insertCell();
        cell.innerHTML = '<button onclick="initiateRowDeletion(this)">Delete Pizza</button>'
    }
}

function initiateRowDeletion(e) {
    let row = e.closest('tr');
    let name = row.firstChild.innerText;
    let rowIndex = e.parentNode.parentNode.rowIndex;
    console.log('this is rowindex ' + rowIndex);
    let result = confirm("Are you sure you want to delete " + name);
    if (result) {
        pizzaTable.deleteRow(rowIndex);
        sessionStorage.removeItem(name);
        if (pizzaTable.rows.length === 1) {
            document.getElementById("viewPizzaHeader").innerText = "There are currently no pizzas";
        }
    }
}

function clearTable() {
    for (let rowIndex = 1; rowIndex < pizzaTable.rows.length;) {
        pizzaTable.deleteRow(rowIndex);
    }
}