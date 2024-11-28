"use client"
import axios from "axios";
import { useState, useEffect } from "react";

// Función para guardar los cambios de usuario
async function guardarUsuario(e) {
    e.preventDefault();
    console.log("Función guardar usuario");

    const url = "http://localhost:3000/updateUsuario";
    const datos = {
        id: document.getElementById("id").value,
        nombre: document.getElementById("nombre").value,
        usuario: document.getElementById("usuario").value,
    };

    try {
        const respuesta = await axios.post(url, datos);
        console.log(respuesta);
        location.replace("/users/mostrar");
    } catch (error) {
        console.error("Error al guardar los cambios:", error);
    }
}

// Componente principal para actualizar los datos del usuario
export default function User({ params }) {
    const [usuario, setUsuario] = useState(null); // Estado para el usuario
    const [usuarios, setUsuarios] = useState([]); // Estado para la lista de usuarios
    const [searchUsuario, setSearchUsuario] = useState(""); // Estado para el término de búsqueda

    // Cargar los datos del usuario cuando se monta el componente
    useEffect(() => {
        async function fetchUsuario() {
            try {
                const url = await fetch(`http://localhost:3000/buscarPorId/${params.id}`);
                if (url.ok) {
                    const usuarioData = await url.json();
                    setUsuario(usuarioData);
                }
            } catch (error) {
                console.error("Error al cargar el usuario:", error);
            }
        }

        fetchUsuario();

        // Cargar todos los usuarios para filtrar
        async function fetchUsuarios() {
            try {
                const respuesta = await axios.get("http://localhost:3000/usuarios");
                setUsuarios(respuesta.data); // Asumimos que el endpoint retorna una lista de usuarios
            } catch (error) {
                console.error("Error al cargar los usuarios:", error);
            }
        }

        fetchUsuarios();
    }, [params.id]);

    // Filtrar usuarios por nombre (empieza con el texto de búsqueda)
    const usuariosFiltrados = usuarios.filter((usuario) =>
        usuario.nombre.toLowerCase().startsWith(searchUsuario.toLowerCase())
    );

    if (!usuario) {
        return <p>Cargando usuario...</p>;
    }

    return (
        <div className="m-0 row justify-content-center">
            <form className="text-center col-6 mt-5" onSubmit={guardarUsuario}>
                <div className="card">
                    <div className="card-header">
                        <h1>Cambiar datos de usuario</h1>
                    </div>
                    <div className="card-body">
                        {/* ID oculto, no editable */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            style={{ height: "50px" }}
                            id="id"
                            value={params.id}
                            readOnly
                        />

                        {/* Campo de nombre */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            style={{ height: "50px" }}
                            id="nombre"
                            defaultValue={usuario.nombre}
                            placeholder="Nombre"
                            autoFocus
                        />

                        {/* Campo de usuario con filtrado */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            style={{ height: "50px" }}
                            id="usuario"
                            value={searchUsuario} // Asigna el valor de búsqueda
                            onChange={(e) => setSearchUsuario(e.target.value)} // Actualiza el valor de búsqueda
                            list="datalistOptions-Usuarios" // Asociar al datalist
                            placeholder="Buscar usuario"
                        />
                        <datalist id="datalistOptions-Usuarios">
                            {usuariosFiltrados.map((usuario) => (
                                <option key={usuario.id} value={usuario.nombre} />
                            ))}
                        </datalist>
                    </div>
                    <div className="card-footer">
                        <button style={{ height: "50px" }} className="btn btn-primary col w-100">
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
