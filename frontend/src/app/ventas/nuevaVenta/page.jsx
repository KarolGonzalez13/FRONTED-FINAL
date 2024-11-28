"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Nuevo() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtroUsuarios, setFiltroUsuarios] = useState([]); // Para el filtrado dinámico de usuarios
    const [productos, setProductos] = useState([]);
    const [filtroProductos, setFiltroProductos] = useState([]); // Para el filtrado dinámico de productos
    const [cantidad, setCantidad] = useState(1); 
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function fetchData() {
            try {
                const usuariosData = await axios.get("http://localhost:3000/");
                const productosData = await axios.get("http://localhost:3000/productos");
                setUsuarios(usuariosData.data);
                setFiltroUsuarios(usuariosData.data); // Inicializa con todos los usuarios
                setProductos(productosData.data);
                setFiltroProductos(productosData.data); // Inicializa con todos los productos
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    function filtrarUsuarios(event) {
        const texto = event.target.value.trim().toLowerCase(); 
        if (texto.length > 0) {
            const usuariosFiltrados = usuarios.filter((user) =>
                user.nombre.toLowerCase().startsWith(texto) // Filtra solo por la primera letra
            );
            setFiltroUsuarios(usuariosFiltrados);
        } else {
            setFiltroUsuarios(usuarios); // Muestra todos los usuarios si el input está vacío
        }
    }

    function filtrarProductos(event) {
        const texto = event.target.value.trim().toLowerCase(); 
        if (texto.length > 0) {
            const productosFiltrados = productos.filter((product) =>
                product.nombre.toLowerCase().startsWith(texto) // Filtra solo por la primera letra
            );
            setFiltroProductos(productosFiltrados);
        } else {
            setFiltroProductos(productos); // Muestra todos los productos si el input está vacío
        }
    }

    function calcTotal(cantidadInput) {
        const productoSeleccionado = document.getElementById("idProducto").value;
        const productoEncontrado = productos.find(
            (product) => product.nombre === productoSeleccionado
        );
        if (productoEncontrado) {
            const nuevoTotal = productoEncontrado.precio * cantidadInput;
            setTotal(nuevoTotal); 
        }
    }

    async function guardarUsuario(e) {
        e.preventDefault();
        const datos = {
            idUsuario: document.getElementById("idUsuario").value,
            idProducto: document.getElementById("idProducto").value,
            cantidad: parseInt(document.getElementById("cantidad").value, 10) || 1,
            total,
        };

        const usuarioEncontrado = usuarios.find((user) => user.nombre === datos.idUsuario);
        if (usuarioEncontrado) {
            datos.idUsuario = usuarioEncontrado.id;
        }

        const productoEncontrado = productos.find(
            (product) => product.nombre === datos.idProducto
        );
        if (productoEncontrado) {
            datos.idProducto = productoEncontrado.id;
        }

        try {
            const url = "http://localhost:3000/ventas/nuevaVenta";
            await axios.post(url, datos); 
            location.replace("/ventas/mostrar");
        } catch (error) {
            console.error("Error al guardar la venta:", error);
        }
    }

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="m-0 row justify-content-center">
            <form className="text-center col-6 mt-5" onSubmit={guardarUsuario}>
                <div className="card">
                    <div className="card-header">
                        <h1>Nueva venta</h1>
                    </div>
                    <div className="card-body">
                        <div className="form-floating">
                            <input
                                className="form-control"
                                list="datalistOptions-Users"
                                style={{ height: "50px" }}
                                id="idUsuario"
                                placeholder="Usuario..."
                                required
                                onInput={filtrarUsuarios} // Llama a la función de filtrado
                            />
                            <datalist id="datalistOptions-Users">
                                {filtroUsuarios.map((usuario) => (
                                    <option key={usuario.id} value={usuario.nombre} />
                                ))}
                            </datalist>
                            <label htmlFor="idUsuario">Usuario:</label>
                        </div>
                        <div className="form-floating">
                            <input
                                className="form-control"
                                list="datalistOptions-Products"
                                style={{ height: "50px" }}
                                id="idProducto"
                                placeholder="Producto..."
                                required
                                onChange={() => calcTotal(cantidad)}
                                onInput={filtrarProductos} // Llama a la función de filtrado
                            />
                            <datalist id="datalistOptions-Products">
                                {filtroProductos.map((product) => (
                                    <option key={product.id} value={product.nombre} />
                                ))}
                            </datalist>
                            <label htmlFor="idProducto">Producto:</label>
                        </div>
                        <div className="form-floating">
                            <input
                                className="form-control"
                                type="number"
                                style={{ height: "50px" }}
                                id="cantidad"
                                placeholder="Cantidad"
                                value={cantidad}
                                onChange={(e) => {
                                    const nuevaCantidad = parseInt(e.target.value, 10) || 1;
                                    setCantidad(nuevaCantidad); 
                                    calcTotal(nuevaCantidad); 
                                }}
                            />
                            <label htmlFor="cantidad">Cantidad:</label>
                        </div>
                        <div className="form-group mt-3">
                            <p>Total a pagar: <strong>${total}</strong></p>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button
                            type="submit"
                            style={{ height: "50px" }}
                            className="btn btn-primary col w-100"
                        >
                            Guardar nueva venta
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
