// src/pages/admin/Usuarios.jsx  (ajusta la ruta si la tienes distinta)

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardUsuario from "../../components/CardUsuarios";
import { useAuth } from "../../context/AuthProvider";
import api from "../../config/api";

function Usuarios() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 4;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/api/usuarios");
        const data = res.data;

        // Solo clientes
        const soloClientes = data.filter((usuario) => usuario.rol === "CLIENTE");
        setUsuarios(soloClientes);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (token) {
      fetchUsuarios();
    }
  }, [token]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagina]);

  const totalPaginas = Math.ceil(usuarios.length / porPagina) || 1;
  const inicio = (pagina - 1) * porPagina;
  const usuariosPaginados = usuarios.slice(inicio, inicio + porPagina);

  const handleVerReservas = (usuarioId) => {
    navigate(`/usuario/${usuarioId}/reservas`);
  };

  const handleEliminar = async (usuarioId) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (!confirmar) return;

    try {
      const res = await api.delete(`/api/usuarios/${usuarioId}`);
      alert(res.data.mensaje);
      setUsuarios((prev) => prev.filter((u) => u.idUsuario !== usuarioId));
    } catch (error) {
      alert(error.response?.data?.mensaje || "Ocurrió un error al eliminar el usuario.");
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8">
      <div className="max-w-5xl mx-auto canchitas-section">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
              Usuarios
            </h1>
            <p className="text-sm text-[var(--canchitas-text-muted)] mt-1">
              Listado de clientes registrados en la plataforma.
            </p>
          </div>
        </header>

        {/* Lista de usuarios */}
        <section className="space-y-4">
          {usuariosPaginados.map((usuario, index) => (
            <CardUsuario
              key={usuario.idUsuario}
              usuario={{
                id: usuario.idUsuario,
                nombre: `${usuario.nombre} ${usuario.apellido}`,
                correo: usuario.correo,
              }}
              index={inicio + index}
              onVerReservas={handleVerReservas}
              onEliminar={handleEliminar}
            />
          ))}

          {usuarios.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-black/20 bg-white/60 px-4 py-6 text-center text-sm text-[var(--canchitas-text-muted)]">
              No hay usuarios registrados como clientes en este momento.
            </div>
          )}
        </section>

        {/* Paginación */}
        {usuarios.length > 0 && totalPaginas > 1 && (
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setPagina((prev) => prev - 1)}
              disabled={pagina === 1}
              className="inline-flex items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-sm font-semibold text-[var(--canchitas-primary)] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm font-medium text-[var(--canchitas-primary)]">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((prev) => prev + 1)}
              disabled={pagina === totalPaginas}
              className="inline-flex items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-sm font-semibold text-[var(--canchitas-primary)] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Usuarios;
