//VARIABLES
let coffeeMenu = [];

let foodMenu = [];

let lastId = 1;

let cart = [];

//LLAMADO/CREACIÓN DE ELEMENTOS DEL DOM
const coffeeList = document.getElementById("coffeeList");

const foodList = document.getElementById("foodList");

const productsContainer = document.getElementById("productsContainer");

const cartSummaryText = document.createElement("p");
cartSummaryText.id = 'cartSummaryText';
productsContainer.appendChild(cartSummaryText);

const productsOrderedInfo = document.createElement("div");
productsOrderedInfo.id = "productsOrderedInfo";
productsContainer.appendChild(productsOrderedInfo);

const finishOrderButton = document.createElement("button");
finishOrderButton.id = "finishOrderButton";

//FUNCIONES DE AGREGADO DE PRODUCTOS AL STOCK
async function getProducts() {
    const response = await fetch("./productos.json");
    const data = await response.json();

    return data;
}

async function showProducts() {
    try {
        const productsMenu = await getProducts();
        coffeeMenu = productsMenu.coffees;
        foodMenu = productsMenu.food;
        createProductElement(coffeeMenu, coffeeList);
        createProductElement(foodMenu, foodList);
    } catch (error) {
        showErrorMesage(coffeeList);
        showErrorMesage(foodList);
    }
}

showProducts();

//NOTIFICACIONES
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

//FUNCIONES DEL CARRITO
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
async function createProductElement(menu, productsList) {
    menu.forEach((menuItem) => {
        const productCard = document.createElement("div");
        productCard.className = "productCard";
        productsList.appendChild(productCard);
        const productInfo = document.createElement("div");
        productInfo.className = "productInfo";
        productInfo.innerHTML = `
            <img src="${menuItem.image}" alt="${menuItem.name}" class="productImage">
        `;
        productCard.appendChild(productInfo);
        const infoProduct = document.createElement("div");
        infoProduct.className = "infoProduct";
        infoProduct.innerHTML = `
            <h4>${menuItem.name}</h4>
            <p class="productPrice">$${menuItem.price}</p>
        `;
        productInfo.appendChild(infoProduct);
        const btnAddToCart = document.createElement("button");
        btnAddToCart.className = "btnAddToCart";
        btnAddToCart.innerHTML = `
            Agregar al carrito
        `;
        productCard.appendChild(btnAddToCart);
        btnAddToCart.addEventListener("click", function () {
            addToCart(menuItem.name, menuItem.price)
        });
    });
}

async function showErrorMesage(menu) {
        const errorMessage = document.createElement("p");
        errorMessage.className = "errorMessage";
        errorMessage.innerHTML = `No se ha podido cargar la información del producto. Vuelva a intentarlo más tarde.`;
        menu.appendChild(errorMessage); 
}

const showCartSummaryText = () => {
    if (cart) {
        cartSummaryText.innerHTML = "Productos agregados al carrito";
    }
}

const renderCart = () => {
    productsOrderedInfo.innerHTML = "";
    cart.forEach((cartItem) => {
        const newAddedItem = document.createElement("div");
        newAddedItem.id = "newAddedItem";
        newAddedItem.innerHTML = `Producto: <strong>${cartItem.name}</strong> - Precio: <strong>$${cartItem.price}</strong>\n`;
        productsOrderedInfo.appendChild(newAddedItem);

        const deleteButton = document.createElement("button");
        deleteButton.id = "deleteButton";
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", async function() {
            const res = await confirmDeleteProduct(cartItem.name);
            if(res.isConfirmed) {
                deleteProduct(cartItem.id);
                showToastDeletedFromCart();
            }
        });
        newAddedItem.appendChild(deleteButton);
    });
    const showTotalOrder = document.createElement("p");
    showTotalOrder.id = "showTotalOrder";
    showTotalOrder.innerHTML = `El total de tu pedido es de: <strong>$${totalOrder()}</strong>`;
    productsOrderedInfo.appendChild(showTotalOrder);
};

const showFinishOrderButton = () => {
    if (cart) {
        finishOrderButton.textContent = "Finalizar compra";
        productsContainer.appendChild(finishOrderButton);
        finishOrderButton.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "./pages/order.html";
        });
    }
};

