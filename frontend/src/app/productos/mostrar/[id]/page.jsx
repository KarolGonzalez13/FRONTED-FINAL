"use client"
import axios from "axios";
import { useState, useEffect } from "react";

// Función para guardar los cambios del producto
async function guardarProducto(e) {
    e.preventDefault();
    console.log("Función guardar producto");

    const url = "http://localhost:3000/producto/updateProducto";
    const datos = {
        id: document.getElementById("id").value,
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

// Componente principal para editar el producto
export default function EditarProducto({ params }) {
    const [producto, setProducto] = useState(null); // Estado para almacenar el producto
    const [searchProducto, setSearchProducto] = useState(""); // Estado para almacenar el término de búsqueda

    // Cargar el producto desde la API cuando el componente se monta
    useEffect(() => {
        async function fetchProducto() {
            try {
                const response = await fetch(`http://localhost:3000/producto/buscarPorId/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProducto(data); // Establecer el producto encontrado
                } else {
                    console.error("Producto no encontrado");
                }
            } catch (error) {
                console.error("Error al cargar el producto:", error);
            }
        }

        fetchProducto();
    }, [params.id]); // Se vuelve a ejecutar si el id cambia

    // Filtrar productos por nombre (empieza con el texto de búsqueda)
    const handleSearchChange = (e) => {
        setSearchProducto(e.target.value);
    };

    return (
        <div className="m-0 row justify-content-center">
            {producto ? (
                <form className="text-center col-6 mt-5" onSubmit={guardarProducto}>
                    <div className="card">
                        <div className="card-header">
                            <h1>Editar producto</h1>
                        </div>
                        <div className="card-body">
                            {/* Campo de ID (solo lectura) */}
                            <input
                                type="text"
                                className="form-control mb-3"
                                style={{ height: "50px" }}
                                id="id"
                                value={producto.id}
                                placeholder="ID"
                                readOnly
                            />

                            {/* Campo de nombre del producto */}
                            <input
                                type="text"
                                className="form-control mb-3"
                                style={{ height: "50px" }}
                                id="nombre"
                                defaultValue={producto.nombre}
                                placeholder="Nombre"
                                autoFocus
                            />

                            {/* Campo de precio */}
                            <input
                                type="text"
                                className="form-control mb-3"
                                style={{ height: "50px" }}
                                id="precio"
                                defaultValue={producto.precio}
                                placeholder="Precio"
                            />

                            {/* Campo de cantidad */}
                            <input
                                type="text"
                                className="form-control"
                                style={{ height: "50px" }}
                                id="cantidad"
                                defaultValue={producto.cantidad}
                                placeholder="Cantidad"
                            />
                        </div>
                        <div className="card-footer">
                            <button style={{ height: "50px" }} className="btn btn-primary col w-100">
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <p>Cargando producto...</p> // Mientras se carga el producto
            )}
        </div>
    );
}
