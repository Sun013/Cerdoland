document.addEventListener("DOMContentLoaded", () => {
  // Carrito desde localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Elementos del DOM
  const contenedorProductos = document.getElementById("contenedor-productos");
  const contenedorCarrito = document.getElementById("contenedor-carrito");
  const contadorCarrito = document.getElementById("contador-carrito");
  const btnVaciar = document.getElementById("vaciar-carrito");
  const btnFinalizar = document.getElementById("finalizar-compra");

  // Función para actualizar el contador visual del carrito
  const actualizarContador = () => {
    if (contadorCarrito) {
      contadorCarrito.textContent = `(${carrito.length})`;
    }
  };

  // Función para guardar el carrito en localStorage
  const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  };

  // Renderiza los productos en la tienda
  const renderProductos = () => {
    if (!contenedorProductos) return;

    fetch("https://dummyjson.com/products")
      .then(res => res.json())
      .then(data => {
        contenedorProductos.innerHTML = "";

        let productosAleatorios = data.products.sort(() => 0.5 - Math.random()).slice(0,12);

        productosAleatorios.forEach(prod => {
          const article = document.createElement("article");

          const imagen = document.createElement("img");
          imagen.src = prod.images[0];
          imagen.alt = prod.title;
          imagen.classList.add("producto-img");

          const titulo = document.createElement("h2");
          titulo.textContent = prod.title;

          const precio = document.createElement("p");
          precio.textContent = `$${prod.price}`;

          const btnAgregar = document.createElement("button");
          btnAgregar.textContent = "Agregar";
          btnAgregar.addEventListener("click", () => {
            carrito.push(prod);
            guardarCarrito();
            actualizarContador();
            renderCarrito();
          });

          article.append(imagen, titulo, precio, btnAgregar);
          contenedorProductos.appendChild(article);
        });
      })
      .catch(err => console.error("ERROR:", err));
  };

  // Renderiza el carrito de compras
  const renderCarrito = () => {
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
      contenedorCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
      return;
    }

    carrito.forEach((prod, index) => {
      const article = document.createElement("article");
      article.classList.add("productoCarrito");

      const imagen = document.createElement("img");
          imagen.src = prod.images[0];
          imagen.alt = prod.title;
          imagen.classList.add("img-carrito");

      const titulo = document.createElement("h2");
      titulo.textContent = prod.title;

      const precio = document.createElement("p");
      precio.textContent = `$${prod.price}`;

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () => {
        carrito.splice(index, 1);
        guardarCarrito();
        renderCarrito();
        actualizarContador();
      });

      article.appendChild(imagen)
      article.append(titulo, precio, btnEliminar);
      
      contenedorCarrito.appendChild(article);
    });
  };

  // Vaciar carrito
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (carrito.length === 0) return;

      if (confirm("¿Seguro que querés vaciar el carrito?")) {
        carrito = [];
        guardarCarrito();
        renderCarrito();
        actualizarContador();
      }
    });
  }

  // Finalizar compra
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      if (carrito.length === 0) return;

      if (confirm("¿Confirmás la compra?")) {
        localStorage.removeItem("carrito");
        carrito = [];
        renderCarrito();
        actualizarContador();
        window.location.href = "index.html"; // o podés redirigir donde quieras
      }
    });
  }

  // Inicialización
  renderProductos();
  renderCarrito();
  actualizarContador();
});
