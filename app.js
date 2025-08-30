//VARIABLES
let coffeeMenu = [];

let foodMenu = [];

let lastId = 1;

let cart = [];

//LLAMADO/CREACIÓN DE ELEMENTOS DEL DOM
const coffeeList = document.getElementById("coffeeList");

const foodList = document.getElementById("foodList");

const productForm = document.getElementById("productForm");

const productsContainer = document.getElementById("productsContainer");

const cartSummaryText = document.createElement("p");
productsContainer.appendChild(cartSummaryText);

const productsOrderedInfo = document.createElement("div");
productsContainer.appendChild(productsOrderedInfo);

const finishOrderButton = document.createElement("button");

//FUNCIONES PARA AGREGAR AL MENÚ
const addProductsToMenu = (productName, productPrice, menu) => {
    menu.push ({
        productName: productName,
        productPrice: productPrice,
    });
}

addProductsToMenu("Vainilla Latte", 2500, coffeeMenu);
addProductsToMenu("Caramel Macchiato", 3000, coffeeMenu);
addProductsToMenu("Café con leche", 2000, coffeeMenu);

addProductsToMenu("Medialuna de manteca", 3500, foodMenu);
addProductsToMenu("Tostada con palta y huevo", 6000, foodMenu);
addProductsToMenu("Porción de torta de zanahoria", 5000, foodMenu);

//FUNCIONES DEL CARRITO
const addItemToCart = (name, price) => {
    cart.push({
        id: lastId++,
        name: name,
        price: price,
    })
}

const addToCart = (item) => {
    let correctInput;

    const cleanInput = (input) =>
        input
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");    
    
    coffeeMenu.forEach((coffeeItem) => {
        if (cleanInput(coffeeItem.productName) === cleanInput(item)) {
            correctInput = coffeeItem;
        }
    })
    foodMenu.forEach((foodItem) => {
        if (cleanInput(foodItem.productName) === cleanInput(item)) {
            correctInput = foodItem;
        }
    })
    if (correctInput) {
        addItemToCart(correctInput.productName, correctInput.productPrice);
        localStorage.setItem("Carrito", JSON.stringify(cart));
    } else {
        alert("Por favor, ingresá un producto válido");
    }
    return 
}

const deleteProduct = (id) => {
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("Carrito", JSON.stringify(cart));
    renderCart();
};

const totalOrder = () => {
    const total = cart.reduce((acumulador, cartItem) => acumulador + cartItem.price, 0);
    return total;
};

//FUNCIONES DE RENDERIZADO
const showProductsInMenu = (menu, productsList) => {
    menu.forEach((menuItem) => {
        const newRow = document.createElement("tr");
        productsList.appendChild(newRow);
        const newCell1 = document.createElement("td");
        const newCell2 = document.createElement("td");
        newCell1.textContent = `${menuItem.productName}`
        newCell2.textContent = `$${menuItem.productPrice}`
        productsList.appendChild(newCell1);
        productsList.appendChild(newCell2);
    });
}

const showCartSummaryText = () => {
    if(cart) {
        cartSummaryText.innerHTML = "Productos agregados al carrito";
    }
}

const renderCart = () => {
    productsOrderedInfo.innerHTML = "";
    cart.forEach((cartItem) => {
        const newAddedItem = document.createElement("div");
        newAddedItem.innerHTML = `Producto: <strong>${cartItem.name}</strong> - Precio: <strong>$${cartItem.price}</strong>\n`;
        productsOrderedInfo.appendChild(newAddedItem);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => deleteProduct(cartItem.id));
        newAddedItem.appendChild(deleteButton);
    });
    const showTotalOrder = document.createElement("p");
    showTotalOrder.innerHTML = `El total de tu pedido es de: <strong>$${totalOrder()}</strong>`;
    productsOrderedInfo.appendChild(showTotalOrder);
};

const showFinishOrderButton = () => {
    if (cart) {
        finishOrderButton.textContent = "Finalizar compra";
        productsContainer.appendChild(finishOrderButton);
        finishOrderButton.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "./pages/order.html";
        });
    }
};

//EVENTOS
productForm.addEventListener("submit",function(event){
    const orderedProduct = document.getElementById("orderedProduct").value;
    event.preventDefault();
    addToCart(orderedProduct);
    showCartSummaryText();
    renderCart();   
    showFinishOrderButton();
    productForm.reset();
});

//INICIALIZACIÓN
showProductsInMenu(coffeeMenu, coffeeList);
showProductsInMenu(foodMenu, foodList);
