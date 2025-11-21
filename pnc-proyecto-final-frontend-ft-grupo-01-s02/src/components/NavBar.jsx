import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

import navbar1 from '/src/assets/futbol-americano-negro.png';

function NavBar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar items-center justify-between bg-[#FFF7ED] shadow-sm px-6">

      {/* LOGO + NOMBRE */}
      <div className="flex items-center gap-2 flex-1">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={navbar1}
            alt="Logo"
            className="w-8 h-8"
          />
          <p className="text-2xl font-bold text-black">
            Sport<span className="text-[#FF9900]">Match</span>
          </p>
        </Link>
      </div>

      {/* NAV LINKS */}
      <div className="hidden md:flex items-center justify-center">
        <ul className="menu menu-horizontal px-1 text-black font-medium">

          <li><Link className="hover:text-[#FF9900]" to="/">Inicio</Link></li>

          {token && role === 'CLIENTE' && (
            <>
              <li><Link className="hover:text-[#FF9900]" to="/info_canchas">Canchas</Link></li>
              <li><Link className="hover:text-[#FF9900]" to="/reservar">Crear reservación</Link></li>
              <li><Link className="hover:text-[#FF9900]" to="/mis_reservaciones">Mis reservaciones</Link></li>
            </>
          )}

          {token && role === 'ADMIN' && (
            <>
              <li><Link className="hover:text-[#FF9900]" to="/reservaciones">Reservaciones</Link></li>
              <li><Link className="hover:text-[#FF9900]" to="/usuarios">Usuarios</Link></li>
              <li><Link className="hover:text-[#FF9900]" to="/lugares">Lugares</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* ICONO DE USUARIO / LOGIN */}
      <div className="flex items-center">

        {!token ? (
          <Link to="/login">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              viewBox="0 0 24 24"
              className="w-9 h-9 hover:text-[#FF9900] transition"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-.047 12c2.568 0 4.78-1.517 5.683-3.708-.845-1.499-2.478-2.517-4.266-2.517h-2.88c-1.788 0-3.421 1.018-4.266 2.517C7.174 17.233 9.385 18.75 11.953 18.75Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn-circle">
              <div className="w-10 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="black"
                  viewBox="0 0 24 24"
                  className="size-10 hover:text-[#FF9900] transition"
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
              className="menu menu-sm dropdown-content bg-[#FFF7ED] border border-[#FF9900] rounded-box mt-3 w-52 p-2 shadow"
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
  );
}

export default NavBar;
