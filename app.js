// <-------Carga de stock de productos------->

const menuCafes = [];

const agregarStockCafes = (nombre, precio) => {
    menuCafes.push ({
        nombre: nombre,
        precio: precio,
    });
};

agregarStockCafes("Caramel macchiato", 4500);
agregarStockCafes("Vainilla Latte", 3500);
agregarStockCafes("Capuchino", 5000);
agregarStockCafes("Café con leche", 3000);

console.log(menuCafes);

const menuComidas = [];

const agregarStockComida = (nombre, precio) => {
    menuComidas.push ({
        nombre: nombre,
        precio: precio,
    });
};

agregarStockComida("Medialuna", 3000);
agregarStockComida("Tostada con palta y huevo", 7000);
agregarStockComida("Tostada con huevo y tomatitos cherry", 7500);
agregarStockComida("Scon de queso", 5000);

console.log(menuComidas);

// <-------Mostrar listados------->

const mostrarListadoCafes = () => {
    let listadoCafes = `Menú de cafés\n`;

    for (let i=0; i < menuCafes.length; i++) {
    listadoCafes += `
    - ${menuCafes[i].nombre}
    - Precio: $${menuCafes[i].precio}
    `
    }
    return alert(listadoCafes);
};

const mostrarListadoComidas = () => {
    let listadoComidas = `Menú de comidas\n`;

    for (let i=0; i < menuComidas.length; i++) {
    listadoComidas += `
    - ${menuComidas[i].nombre}
    - Precio: $${menuComidas[i].precio}
    `
    }
    return alert(listadoComidas);
};

// <------Elección y carga de pedidos------->

let eleccionCafe = [];

do {
    mostrarListadoCafes();
    let cafe = prompt("Ingresá el café que querés pedir");
    if (cafe) {
        eleccionCafe.push({
            nombre: cafe,
        });
    } else {
        break;
    }
} while (confirm("¿Querés agregar otro café?"));

let consultaComida = confirm("¿Querés agregar algo para comer?");

const pedidoSoloCafe = () => {
    let mensajePedidoCafe = `Detalle de tu pedido:\n\n`;
    let totalPagoCafe = 0;

    for (i = 0; i < menuCafes.length; i++) {
        for (j = 0; j < eleccionCafe.length; j++) {
            if (menuCafes[i].nombre === eleccionCafe[j].nombre) {
                totalPagoCafe += menuCafes[i].precio;
                mensajePedidoCafe += `- Productos pedidos: ${menuCafes[i].nombre}\n`;
                mensajePedidoCafe += `- Precio: $${menuCafes[i].precio}\n\n`;
            }
        }
    }
    return alert(mensajePedidoCafe += `- Total a pagar: $${totalPagoCafe}`);
}

let eleccionComida = [];

if (consultaComida === true) {
    do {
        mostrarListadoComidas();
        let comida = prompt("Ingresá la comida que querés pedir");
        if (comida) {
            eleccionComida.push({
                nombre: comida,
            })
        } else {
            pedidoSoloCafe();
        }
    } while (confirm("¿Querés agregar más comida?"));
}

const obtenerPedido = (menu, eleccion) => {
    let eleccionFinal = [];
    
    for (i = 0; i < menu.length; i++) {
        for (j = 0; j < eleccion.length; j++) {
            if (menu[i].nombre === eleccion[j].nombre) {
                eleccionFinal.push ({
                    nombre: menu[i].nombre,
                    precio: menu[i].precio,
                })   
            }
        }
    }
    return eleccionFinal;
}

let pedidoCafe = obtenerPedido(menuCafes, eleccionCafe);

let pedidoComida = obtenerPedido(menuComidas, eleccionComida);

let pedidoTotal = [...pedidoCafe, ...pedidoComida];

const mensajeFinal = () => {
    let mensaje = `Detalle de tu pedido:\n\n`;

    let total = 0;

    for (let i = 0; i < pedidoTotal.length; i++) {
        total += pedidoTotal[i].precio;
        mensaje += `- Productos pedidos: ${pedidoTotal[i].nombre}\n`;
        mensaje += `- Precio: $${pedidoTotal[i].precio}\n\n`;
    }
    return alert(mensaje += `- Total a pagar: $${total}`);
}

mensajeFinal();
