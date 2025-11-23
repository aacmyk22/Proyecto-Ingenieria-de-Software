import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

import navbar1 from '/src/assets/futbol-americano-negro.png';

function NavBar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Cerrar menú cuando cambia la ruta
  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  // Cerrar menú al redimensionar a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuAbierto(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuAbierto(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Links de navegación según rol
  const getNavLinks = () => {
    const links = [{ to: '/', label: 'Inicio' }];

    if (token && role === 'CLIENTE') {
      links.push(
        { to: '/info_canchas', label: 'Canchas' },
        { to: '/reservar', label: 'Crear reservación' },
        { to: '/mis_reservaciones', label: 'Mis reservaciones' }
      );
    }

    if (token && role === 'ADMIN') {
      links.push(
        { to: '/reservaciones', label: 'Reservaciones' },
        { to: '/usuarios', label: 'Usuarios' },
        { to: '/lugares', label: 'Lugares' }
      );
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="navbar-container bg-[#FFF7ED] shadow-sm relative">
      <div className="navbar items-center justify-between px-4 md:px-6 py-2">

        {/* LOGO + NOMBRE */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={navbar1}
              alt="Logo"
              className="w-8 h-8"
            />
            <p className="text-xl md:text-2xl font-bold text-black">
              Sport<span className="text-[#FF9900]">Match</span>
            </p>
          </Link>
        </div>

        {/* NAV LINKS - Desktop */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <ul className="menu menu-horizontal px-1 text-black font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  className={`hover:text-[#FF9900] transition-colors ${
                    location.pathname === link.to ? 'text-[#FF9900]' : ''
                  }`}
                  to={link.to}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ICONOS DERECHA */}
        <div className="flex items-center gap-2">

          {/* Botón hamburguesa - Solo móvil */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#FF9900]/10 transition-colors"
            onClick={toggleMenu}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? (
              // Icono X (cerrar)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Icono hamburguesa
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          {/* ICONO DE USUARIO / LOGIN */}
          {!token ? (
            <Link to="/login" className="p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
                viewBox="0 0 24 24"
                className="w-8 h-8 md:w-9 md:h-9 hover:fill-[#FF9900] transition"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-.047 12c2.568 0 4.78-1.517 5.683-3.708-.845-1.499-2.478-2.517-4.266-2.517h-2.88c-1.788 0-3.421 1.018-4.266 2.517C7.174 17.233 9.385 18.75 11.953 18.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ) : (
            <div className="dropdown dropdown-end hidden md:block">
              <div tabIndex={0} role="button" className="btn-circle">
                <div className="w-10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="black"
                    viewBox="0 0 24 24"
                    className="size-10 hover:fill-[#FF9900] transition"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-[#FFF7ED] border border-[#FF9900] rounded-box mt-3 w-52 p-2 shadow z-50"
              >
                <li>
                  <button
                    className="btn btn-ghost text-black hover:text-[#FF9900]"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuAbierto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#FFF7ED] border-t border-[#FF9900]/20 px-4 py-3">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-[#FF9900] text-white'
                      : 'text-black hover:bg-[#FF9900]/10 hover:text-[#FF9900]'
                  }`}
                  onClick={() => setMenuAbierto(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Cerrar sesión en menú móvil */}
            {token && (
              <li className="mt-2 pt-2 border-t border-[#FF9900]/20">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Overlay para cerrar menú al tocar fuera */}
      {menuAbierto && (
        <div
          className="md:hidden fixed inset-0 top-[60px] bg-black/20 z-40"
          onClick={() => setMenuAbierto(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}

export default NavBar;
