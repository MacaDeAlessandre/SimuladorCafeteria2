// VARIABLES
// Obtiene los datos almazenados en el localStorage (los productos agregados al carrito) y los trae en formato JSON
const finalCart = JSON.parse(localStorage.getItem("Carrito") || []);

// LLAMADO/CREACIÓN DE ELEMENTOS DEL DOM
// Contenedor que agrupa toda la información del carrito
const finalOrder = document.getElementById("finalOrder");

// Botón para volver a la Homepage
const backToHomepage = document.getElementById("backToHomepage");

// FUNCIONES DEL CARRITO
// Suma el total del carrito almazenado en el localStorage
const calculateTotalOrder = () => {
    const total = finalCart.reduce((acumulador, item) => acumulador + item.price, 0);
    return total;
};

// FUNCIONES DE CREACIÓN DE ELEMENTOS DEL DOM
// Crea y muestra cada producto de la orden de manera individual
const purchasedItem = (item) => {
        const orderedItems = document.createElement("div");
        orderedItems.id = "orderedItems";
        orderedItems.innerHTML = `Producto: <strong>${item.name}</strong> - Precio: <strong>$${item.price}</strong>\n`;
        finalOrder.appendChild(orderedItems);
}

// Crea y muestra el total pagado por todos los productos del carrito
const showTotalPaid = () => {
    const totalPaid = document.createElement("p");
    totalPaid.id = "totalPaid";
    totalPaid.innerHTML = `Pago total: <strong>$${calculateTotalOrder()}</strong>`;
    finalOrder.appendChild(totalPaid);
}

// FUNCIONES DEL RENDERIZADO
// Renderiza en el DOM todos los productos comprados y el total de la compra
const showFinalOrder = () => {
    finalCart.forEach((item) => {
        purchasedItem(item);
    });
    showTotalPaid();
}

showFinalOrder();

// FUNCIONES PARA VOLVER A LA HOMEPAGE
// Función para volver a la Homepage y limpiar "Carrito" del localStorage al volver
const goToHomePage = () => {
    localStorage.removeItem("Carrito");
    window.location.href = "../index.html";
}

// Función que vuelve a la Homepage después de cierto tiempo de manera automática
const timeout = setTimeout(() => {
    goToHomePage();
}, 6000);

// EVENTOS
// Evento del boton 'backToHomepage' que permite volver a la Homepage y anula el setTimeOut en caso de clickear en el botón antes
backToHomepage.addEventListener("click", () => {
    clearTimeout(timeout);
    goToHomePage();
});
