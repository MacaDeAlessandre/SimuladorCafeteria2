// VARIABLES
// Array que guarda los productos de café disponibles
let coffeeMenu = [];

// Array que guarda los productos de comidas disponibles
let foodMenu = [];

// ID que se incrementa automáticamente para cada producto agregado al carrito
let lastId = 1;

// Array que guarda los productos agregados por el usuario a su carrito
let cart = [];

// LLAMADO/CREACIÓN DE ELEMENTOS DEL DOM
// Contenedor donde se mostrarán las cartas de productos de café
const coffeeList = document.getElementById("coffeeList");

// Contenedor donde se mostrarán las cartas de productos de comida
const foodList = document.getElementById("foodList");

// Contenedor que agrupa toda la información del carrito
const productsContainer = document.getElementById("productsContainer");
productsContainer.style.display = 'none';

// Párrafo que se mostrará una vez que el usuario haya agregado al menos un producto a su carrito
const cartSummaryText = document.createElement("p");
cartSummaryText.id = 'cartSummaryText';
productsContainer.appendChild(cartSummaryText);

// Contenedor donde se mostrarán los productos agregados al carrito por el usuario
const productsOrderedInfo = document.createElement("div");
productsOrderedInfo.id = "productsOrderedInfo";
productsContainer.appendChild(productsOrderedInfo);

// Botón para finalizar la compra
const finishOrderButton = document.createElement("button");
finishOrderButton.id = "finishOrderButton";
finishOrderButton.textContent = "Finalizar compra";
productsContainer.appendChild(finishOrderButton);
finishOrderButton.style.display = 'none';   

// NOTIFICACIONES
// Notificación que muestra al usuario que el producto se agregó exitosamente al carrito
function showToastAddedToCart() {
    Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        text: "Producto agregado al carrito",
        showConfirmButton: false,
        timer: 2000,
    });
}

// Notificación que muestra al usuario que el producto se eliminó exitosamente del carrito
function showToastDeletedFromCart() {
    Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'info',
        text: "Producto eliminado del carrito",
        showConfirmButton: false,
        timer: 2000,
    });
}

// Alert que pregunta al usuario si desea eliminar el producto
function confirmDeleteProduct(name) {
    return Swal.fire({
        title: '¿Eliminar producto?',
        text: `¿Deseas eliminar "${name}" del carrito?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
    });
}

// Alert que pregunta al usuario si desea finalizar la compra
function confirmFinishOrder() {
    return Swal.fire({
        title: '¿Finalizar compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#a5dc87',
        cancelButtonColor: '#95a5a6',
    });
}

// FUNCIONES DE AGREGADO DE PRODUCTOS AL STOCK
// Realiza una request a la API y trae los datos deseados
async function getProducts() {
    const response = await fetch("./products.json");
    const data = await response.json();

    return data;
}

// Obtiene los productos desde la API y los renderiza en el DOM
async function showProducts() {
    try {
        const productsMenu = await getProducts();
        coffeeMenu = productsMenu.coffees;
        foodMenu = productsMenu.food;
        createProductElement(coffeeMenu, coffeeList);
        createProductElement(foodMenu, foodList);
    } catch (error) {
        showErrorMessage(coffeeList);
        showErrorMessage(foodList);
    }
}

showProducts();

// FUNCIONES DEL CARRITO
// Agrega un producto al carrito, actualiza el almacenamiento en localStorage y actualiza la renderización de productos agregados al carrito
const addToCart = (name, price) => {
    cart.push({
        id: lastId++,
        name: name,
        price: price,
    });
    localStorage.setItem("Carrito", JSON.stringify(cart));
    showToastAddedToCart();
    showCartSummaryText();
    renderCart();
    showFinishOrderButton();
};

// Elimina un producto del carrito, actualiza el almacenamiento en localStorage y actualiza la renderización de productos agregados al carrito
const deleteProduct = (id) => {
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("Carrito", JSON.stringify(cart));
    renderCart();
    showFinishOrderButton();    
};

// Suma el total de los productos agregados al carrito
const calculateTotalOrder = () => {
    const total = cart.reduce((acumulador, cartItem) => acumulador + cartItem.price, 0);
    return total;
};

// FUNCIONES DE CREACIÓN DE ELEMENTOS DEL DOM
// Crea las cards para los productos obtenidos de la API, y añade el botón para agregarlos al carrito
const createProductCard = (item, list) => {
        const productCard = document.createElement("div");
        productCard.className = "productCard";
        list.appendChild(productCard);
        const productInfo = document.createElement("div");
        productInfo.className = "productInfo";
        productInfo.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="productImage">
        `;
        productCard.appendChild(productInfo);
        const infoProduct = document.createElement("div");
        infoProduct.className = "infoProduct";
        infoProduct.innerHTML = `
            <h4>${item.name}</h4>
            <p class="productPrice">$${item.price}</p>
        `;
        productInfo.appendChild(infoProduct);
        createBtnAddToCart(item, productCard);
}

// Crea un botón para añadir un producto al carrito
const createBtnAddToCart = (item, card) => {
        const btnAddToCart = document.createElement("button");
        btnAddToCart.className = "btnAddToCart";
        btnAddToCart.innerHTML = `
            Agregar al carrito
        `;
        card.appendChild(btnAddToCart);
        btnAddToCart.addEventListener("click", function () {
            addToCart(item.name, item.price)
    });
}

// Crea y muestra un producto agregado al carrito en el DOM
const createAddedItemToCart = (item) => {
    const newAddedItem = document.createElement("div");
    newAddedItem.className = "newAddedItem";
    newAddedItem.innerHTML = `Producto: <strong>${item.name}</strong> - Precio: <strong>$${item.price}</strong>\n`;
    productsOrderedInfo.appendChild(newAddedItem);
    createDeleteButton(newAddedItem, item);
}

// Crea un botón para eliminar un producto del carrito
const createDeleteButton = (addedItem, item) => {
    const deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton";
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", async function () {
        const res = await confirmDeleteProduct(item.name);
        if (res.isConfirmed) {
            deleteProduct(item.id);
            showToastDeletedFromCart();
        }
    });
    addedItem.appendChild(deleteButton);
}

// FUNCIONES DE RENDERIZADO
// Renderiza todos los productos de un menú en la página
const createProductElement = (menu, productsList) => {
    menu.forEach((menuItem) => {
        createProductCard(menuItem, productsList);
    });
}

// Crea un mensaje de error en caso de que la request a la API falle
function showErrorMessage(menu) {
        const errorMessage = document.createElement("p");
        errorMessage.className = "errorMessage";
        errorMessage.innerHTML = `No se ha podido cargar la información del producto. Vuelva a intentarlo más tarde.`;
        menu.appendChild(errorMessage); 
}

// Muestra la sección de los productos agregados al carrito al agregar al menos un producto a éste
const showProductsContainer = (cart) => {
    if (cart.length !== 0) {
        productsContainer.style.display = 'block';
    } else {
        productsContainer.style.display = 'none';
    };
}

// Renderiza el párrafo que se mostrará una vez que el usuario haya agregado al menos un producto a su carrito
const showCartSummaryText = () => {
    if (cart.length !== 0) {
        cartSummaryText.innerHTML = "Productos agregados al carrito";
    }
}

// Renderiza el total sumado del carrito
const showTotalOrder = () => {
    const showTotalOrder = document.createElement("p");
    showTotalOrder.id = "showTotalOrder";
    showTotalOrder.innerHTML = `El total de tu pedido es de: <strong>$${calculateTotalOrder()}</strong>`;
    productsOrderedInfo.appendChild(showTotalOrder);
}

// Renderiza los productos del carrito en la página
const renderCart = () => {
    productsOrderedInfo.innerHTML = "";
    cart.forEach((cartItem) => {
        showProductsContainer(cart);
        createAddedItemToCart(cartItem);        
    });
    showTotalOrder();
};

// Maneja la visibilidad y funcionalidad del botón "Finalizar compra"
const showFinishOrderButton = () => {
    if (cart.length !== 0) {
        finishOrderButton.style.display = 'block';
        finishOrderButton.addEventListener("click", async function (event) {
            event.preventDefault();
            const res = await confirmFinishOrder();
            if (res.isConfirmed) {
                window.location.href = "./pages/order.html";
            };
        })
    } else {
        finishOrderButton.style.display = 'none';
    };
};

