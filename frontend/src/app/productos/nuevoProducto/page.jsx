"use client"
import axios from "axios";
import { useState, useEffect } from "react";

// Función para guardar el nuevo producto
async function guardarProducto(e) {
    e.preventDefault();
    console.log("Función guardar producto");

    const url = "http://localhost:3000/producto/nuevoProducto";
    const datos = {
        nombre: document.getElementById("nombre").value,
        precio: document.getElementById("precio").value,
        cantidad: document.getElementById("cantidad").value,
    };

    try {
        const respuesta = await axios.post(url, datos);
        console.log(respuesta);
        location.replace("/productos/mostrar");
    } catch (error) {
        console.error("Error al guardar el producto:", error);
    }
}

// Componente principal para crear un nuevo producto
export default function Nuevo() {
    const [productos, setProductos] = useState([]); // Estado para la lista de productos
    const [searchProducto, setSearchProducto] = useState(""); // Estado para el término de búsqueda

    // Cargar todos los productos cuando el componente se monta
    useEffect(() => {
        async function fetchProductos() {
            try {
                const respuesta = await axios.get("http://localhost:3000/productos");
                setProductos(respuesta.data); // Asumimos que el endpoint retorna una lista de productos
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            }
        }

        fetchProductos();
    }, []);

    // Filtrar productos por nombre (empieza con el texto de búsqueda)
    const productosFiltrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().startsWith(searchProducto.toLowerCase())
    );

    return (
        <div className="m-0 row justify-content-center">
            <form className="text-center col-6 mt-5" onSubmit={guardarProducto}>
                <div className="card">
                    <div className="card-header">
                        <h1>Nuevo producto</h1>
                    </div>
                    <div className="card-body">
                        {/* Campo de nombre del producto */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            style={{ height: "50px" }}
                            id="nombre"
                            value={searchProducto} // Asigna el valor de búsqueda
                            onChange={(e) => setSearchProducto(e.target.value)} // Actualiza el valor de búsqueda
                            list="datalistOptions-Productos" // Asociar al datalist
                            placeholder="Buscar producto"
                            autoFocus
                        />
                        <datalist id="datalistOptions-Productos">
                            {productosFiltrados.map((producto) => (
                                <option key={producto.id} value={producto.nombre} />
                            ))}
                        </datalist>

                        {/* Campo de precio */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            style={{ height: "50px" }}
                            id="precio"
                            placeholder="Precio"
                        />

                        {/* Campo de cantidad */}
                        <input
                            type="text"
                            className="form-control"
                            style={{ height: "50px" }}
                            id="cantidad"
                            placeholder="Cantidad"
                        />
                    </div>
                    <div className="card-footer">
                        <button style={{ height: "50px" }} className="btn btn-primary col w-100">
                            Guardar nuevo Producto
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
