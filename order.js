//VARIABLES
const finalCart = JSON.parse(localStorage.getItem("Carrito"));

//LLAMADO/CREACIÓN DE ELEMENTOS DEL DOM
const finalOrder = document.getElementById("finalOrder");

const backToHomepage = document.getElementById("backToHomepage");

//FUNCIONES DEL CARRITO
const totalOrder = () => {
    const total = finalCart.reduce((acumulador, cartItem) => acumulador + cartItem.price, 0);
    return total;
};

//FUNCIONES DEL RENDERIZADO
const showFinalOrder = () => {
    finalCart.forEach((cartItem) => {
        const orderedItems = document.createElement("div");
        orderedItems.innerHTML = `Producto: <strong>${cartItem.name}</strong> - Precio: <strong>$${cartItem.price}</strong>\n`;
        finalOrder.appendChild(orderedItems);
    });
    const totalPaid = document.createElement("p");
    totalPaid.innerHTML = `Pago total: <strong>$${totalOrder()}</strong>`;
    finalOrder.appendChild(totalPaid);
}

showFinalOrder();

//EVENTOS
backToHomepage.addEventListener("click", () => localStorage.clear());
