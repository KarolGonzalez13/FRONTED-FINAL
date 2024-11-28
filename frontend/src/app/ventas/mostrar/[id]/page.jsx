"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function EditarVenta({ params }) {
    const [venta, setVenta] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [cantidad, setCantidad] = useState(1); 
    const [total, setTotal] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [searchUsuario, setSearchUsuario] = useState(""); // Estado para la búsqueda del usuario
    const [searchProducto, setSearchProducto] = useState(""); // Estado para la búsqueda del producto

    useEffect(() => {
        async function fetchData() {
            try {
                const ventaResponse = await axios.get(`http://localhost:3000/ventas/buscarPorId/${params.id}`);
                const usuariosResponse = await axios.get("http://localhost:3000/");
                const productosResponse = await axios.get("http://localhost:3000/productos");

                const ventaData = ventaResponse.data;

                // Actualizar estados iniciales
                setVenta(ventaData);
                setUsuarios(usuariosResponse.data);
                setProductos(productosResponse.data);
                setCantidad(ventaData.cantidad); // Cantidad inicial de la venta
                setTotal(ventaData.total); // Total inicial de la venta
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        }

        fetchData();
    }, [params.id]);

    useEffect(() => {
        if (venta && productos.length > 0) {
            const productoSeleccionado = productos.find((p) => p.id === venta.idProducto);
            if (productoSeleccionado) {
                const nuevoTotal = cantidad * productoSeleccionado.precio; // Suponiendo que los productos tienen un campo "precio"
                setTotal(nuevoTotal);
            }
        }
    }, [cantidad, venta, productos]);

    async function guardarUsuario(e) {
        e.preventDefault();
        console.log("Función actualizar venta");

        const nombreUsuario = document.getElementById("idUsuario").value;
        const nombreProducto = document.getElementById("idProducto").value;

        const usuarioSeleccionado = usuarios.find((u) => u.nombre === nombreUsuario);
        const productoSeleccionado = productos.find((p) => p.nombre === nombreProducto);

        if (!usuarioSeleccionado || !productoSeleccionado) {
            alert("Por favor, selecciona un usuario y un producto válidos.");
            return;
        }

        const datos = {
            id: venta.id,
            idUsuario: usuarioSeleccionado.id,
            idProducto: productoSeleccionado.id,
            cantidad, // Cantidad seleccionada
            total, // Total calculado
        };

        try {
            const url = "http://localhost:3000/ventas/updateVentas";
            const respuesta = await axios.post(url, datos);
            location.replace("/ventas/mostrar");
        } catch (error) {
            console.error("Error al guardar la venta:", error);
        }
    }

    // Filtrar usuarios y productos según el término de búsqueda
    const usuariosFiltrados = usuarios.filter((usuario) =>
        usuario.nombre.toLowerCase().startsWith(searchUsuario.toLowerCase())
    );

    const productosFiltrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().startsWith(searchProducto.toLowerCase())
    );

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="m-0 row justify-content-center">
            <form className="text-center col-6 mt-5" onSubmit={guardarUsuario}>
                <div className="card">
                    <div className="card-header">
                        <h1>Editar Venta</h1>
                    </div>
                    <div className="card-body">
                        <input
                            type="text"
                            className="form-control mb-3"
                            style={{ height: "50px" }}
                            id="id"
                            value={venta.id}
                            readOnly
                        />
                        <div className="form-floating">
                            <input
                                required
                                className="form-control"
                                list="datalistOptions-Users"
                                style={{ height: "50px" }}
                                id="idUsuario"
                                defaultValue={usuarios.find((u) => u.id === venta.idUsuario)?.nombre || ""}
                                placeholder="Usuario..."
                                autoComplete="off"
                                value={searchUsuario} // Asignar valor de búsqueda
                                onChange={(e) => setSearchUsuario(e.target.value)} // Actualizar búsqueda
                            />
                            <datalist id="datalistOptions-Users">
                                {usuariosFiltrados.map((usuario) => (
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
                                defaultValue={productos.find((p) => p.id === venta.idProducto)?.nombre || ""}
                                placeholder="Producto..."
                                autoComplete="off"
                                required
                                value={searchProducto} // Asignar valor de búsqueda
                                onChange={(e) => setSearchProducto(e.target.value)} // Actualizar búsqueda
                            />
                            <datalist id="datalistOptions-Products">
                                {productosFiltrados.map((product) => (
                                    <option key={product.id} value={product.nombre} />
                                ))}
                            </datalist>
                            <label htmlFor="idProducto">Producto:</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input
                                type="number"
                                className="form-control"
                                style={{ height: "50px" }}
                                id="cantidad"
                                value={cantidad}
                                onChange={(e) => setCantidad(parseInt(e.target.value, 10) || 1)}
                                min="1"
                            />
                            <label htmlFor="cantidad">Cantidad:</label>
                        </div>
                        <div className="form-floating mt-3">
                            <div className="form-group mt-3">
                                <p>Total a pagar: <strong>${total}</strong></p> {/* Muestra el total en un párrafo */}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button
                            type="submit"
                            style={{ height: "50px" }}
                            className="btn btn-primary col w-100"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
