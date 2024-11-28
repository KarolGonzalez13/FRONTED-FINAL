"use client"
import axios from "axios";
import { useState, useEffect } from "react";

// Función para guardar un nuevo usuario
async function guardarUsuario(e) {
    e.preventDefault();
    console.log("Función guardar usuario");

    const url = "http://localhost:3000/nuevoUsuario";
    const datos = {
        nombre: document.getElementById("nombre").value,
        usuario: document.getElementById("usuario").value,
        password: document.getElementById("password").value,
    };

    try {
        const respuesta = await axios.post(url, datos);
        console.log(respuesta);
        location.replace("/users/mostrar");
    } catch (error) {
        console.error("Error al guardar el usuario:", error);
    }
}

// Componente principal para crear un nuevo usuario
export default function Nuevo() {
    const [usuarios, setUsuarios] = useState([]); // Estado para almacenar la lista de usuarios
    const [searchUsuario, setSearchUsuario] = useState(""); // Estado para el término de búsqueda

    useEffect(() => {
        async function fetchUsuarios() {
            try {
                const respuesta = await axios.get("http://localhost:3000/usuarios");
                setUsuarios(respuesta.data); // Asumimos que el endpoint retorna una lista de usuarios
            } catch (error) {
                console.error("Error al cargar los usuarios:", error);
            }
        }

        fetchUsuarios();
    }, []);

    // Filtrar usuarios por el nombre (empieza con el texto de búsqueda)
    const usuariosFiltrados = usuarios.filter((usuario) =>
        usuario.nombre.toLowerCase().startsWith(searchUsuario.toLowerCase())
    );

    return (
        <div className="m-0 row justify-content-center">
            <form className="text-center col-6 mt-5" action="" onSubmit={guardarUsuario}>
                <div className="card">
                    <div className="card-header">
                        <h1>Nuevo usuario</h1>
                    </div>
                    <div className="card-body">
                        {/* Campo de nombre */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            style={{ height: "50px" }}
                            id="nombre"
                            placeholder="Nombre"
                            autoFocus
                        />
                        
                        {/* Campo de usuario con filtrado */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            style={{ height: "50px" }}
                            id="usuario"
                            placeholder="Usuario"
                            value={searchUsuario} // Asigna el valor de búsqueda
                            onChange={(e) => setSearchUsuario(e.target.value)} // Actualiza el valor de búsqueda
                            list="datalistOptions-Usuarios" // Asociar al datalist
                        />
                        <datalist id="datalistOptions-Usuarios">
                            {usuariosFiltrados.map((usuario) => (
                                <option key={usuario.id} value={usuario.nombre} />
                            ))}
                        </datalist>

                        {/* Campo de contraseña */}
                        <input
                            type="text"
                            className="form-control"
                            style={{ height: "50px" }}
                            id="password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="card-footer">
                        <button style={{ height: "50px" }} className="btn btn-primary col w-100">
                            Guardar nuevo Usuario
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
