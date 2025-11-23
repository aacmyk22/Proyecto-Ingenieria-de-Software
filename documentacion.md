# Documentación técnica del proyecto

> Resumen y guía técnica para el proyecto "SportMatch" (frontend).

## 1. Resumen del proyecto
- Tipo: Aplicación frontend en React + Vite.
- Objetivo: Interfaz para reservar canchas (gestión de usuarios, reservas, páginas de administración y usuario).
- Stack principal: React 19, Vite, TailwindCSS.

## 2. Ubicación del código
- Carpeta principal del frontend: `pnc-proyecto-final-frontend-ft-grupo-01-s02/`
- Archivo de entrada: `index.html` dentro de la carpeta del frontend.
- Código fuente: `src/` (componentes, páginas, layouts, routes, context, assets, config).

## 3. Estructura de carpetas (alta nivel)
- `src/`
  - `assets/` — Imágenes y recursos estáticos.
  - `components/` — Componentes reutilizables (Button, NavBar, Footer, Card, Input, etc.).
  - `pages/` — Páginas visibles por rutas (Home, InicioSesion, Registro, InfoCanchitas, y subcarpetas `admin/` y `usuario/`).
  - `layouts/` — Layouts de aplicación (`MainLayout`, `AuthLayout`).
  - `context/` — Contextos React (por ejemplo `AuthProvider` para autenticar y proporcionar token/rol).
  - `routes/` — Rutas y helpers de navegación (p. ej. `RutaProtegida`, `RutaPublica`, `ScrollTop`).
  - `config/` — Configuraciones, por ejemplo `api.js` con la URL base y utilidades de llamada.
  - `index.css` — estilos globales (Tailwind).
  - `main.jsx`, `App.jsx` — bootstrap de la app y definición de rutas.

## 4. Dependencias y scripts
### Scripts principales
- `dev`: `vite` — arranca el servidor de desarrollo (hot-reload).
- `build`: `vite build` — genera artefactos de producción.
- `lint`: `eslint .` — ejecuta ESLint sobre el proyecto.
- `preview`: `vite preview` — sirve el build localmente para prueba.

### Dependencias destacadas
- `react`, `react-dom` — librería UI.
- `react-router-dom` — enrutamiento (v7).
- `axios` — peticiones HTTP.
- `react-icons` — iconos.
- `date-fns` / `react-datepicker` — manejo y selección de fechas.
- `tailwindcss`, `daisyui` — utilidades y componentes UI.

### DevDependencies
- `vite`, `@vitejs/plugin-react` — bundler / dev server.
- `eslint`, `@eslint/js` y plugins de React — linting.
- `postcss`, `autoprefixer` — procesamiento CSS.

## 5. Configuración y variables de entorno
- No hay un `.env` público incluido en el repo — si la aplicación necesita variables (p. ej. `VITE_API_URL`), se recomienda crear un archivo `.env` en la raíz del frontend con las variables necesarias.
- `src/config/api.js` contiene la lógica/URL base para llamadas a la API; revisarlo para saber qué variables esperar.

## 6. Flujo de autenticación (alta nivel)
- `AuthProvider` en `src/context/AuthProvider.jsx` expone `token`, `role` y funciones de login/logout.
- Las rutas protegidas usan `RutaProtegida` para verificar `token` y `role` antes de permitir acceso.
- Componentes y páginas consultan `useAuth()` para adaptar UI (p. ej. botones visibles si `role` es `CLIENTE` o `ADMIN`).

## 7. Componentes y páginas importantes
- `components/Button.jsx` — componente botón estilizado reutilizable.
- `components/NavBar.jsx`, `components/Footer.jsx` — navegación y pie de página.
- `pages/Home.jsx` — página principal / hero / galerías / testimonios.
- `pages/InicioSesion.jsx`, `pages/Registro.jsx` — formularios de acceso y registro.
- `pages/admin/*` — panel y vistas para usuarios administradores (ListadoCanchas, Reservaciones, Usuarios, etc.).
- `pages/usuario/*` — flujo y gestión de reservas por parte del cliente.

## 8. Cómo ejecutar el proyecto (desarrollo)
1. Abrir terminal y situarse en la carpeta del frontend:

```powershell
cd "pnc-proyecto-final-frontend-ft-grupo-01-s02"
```

2. Instalar dependencias:

```powershell
npm install
```

3. Ejecutar en modo desarrollo:

```powershell
npm run dev
```

4. Abrir `http://localhost:5173` (o la URL que muestre Vite).

## 9. Build y despliegue
- Generar build de producción:

```powershell
npm run build
```

- Servir localmente para comprobar el build:

```powershell
npm run preview
```

- Para despliegue, subir el contenido de `dist/` (la carpeta generada por Vite) al proveedor que se use (Netlify, Vercel, S3 + CloudFront, etc.).

## 10. Notas sobre pruebas
- No hay scripts de test definidos en `package.json` actualmente.
- Recomendación: añadir `vitest` o `jest` y pruebas básicas para componentes críticos y utilidades.

## 11. Extensiones y mejoras sugeridas
- Añadir tipado con TypeScript para mayor robustez (opcional).
- Implementar tests unitarios y de integración (componentes, hooks, servicios API).
- Añadir CI (GitHub Actions) para `lint`, `build` y pruebas automáticas.
- Documentar las variables de entorno esperadas en un `.env.example`.

## 12. Mapa resumen de archivos (ejemplos)
- `pnc-proyecto-final-frontend-ft-grupo-01-s02/src/main.jsx` — punto de arranque React.
- `pnc-proyecto-final-frontend-ft-grupo-01-s02/src/App.jsx` — rutas y layout principal.
- `pnc-proyecto-final-frontend-ft-grupo-01-s02/src/config/api.js` — cliente/URL de la API.
- `pnc-proyecto-final-frontend-ft-grupo-01-s02/src/context/AuthProvider.jsx` — proveedor de autenticación.

