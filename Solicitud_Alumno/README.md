# Solicitud Alumno - Frontend

Este proyecto es el frontend de la aplicación **Solicitud Alumno**, desarrollado en React + TypeScript + Vite.

## Requisitos previos

- Node.js (recomendado v18 o superior)
- npm (v9 o superior) o yarn

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd Solicitud_Alumno_Frontend/Solicitud_Alumno
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   # o si usas yarn
   # yarn install
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en la raíz del proyecto y añade la URL de tu backend, por ejemplo:

   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Inicia el servidor de desarrollo:**

   ```bash
   npm run dev
   # o
   # yarn dev
   ```

   El frontend estará disponible en [http://localhost:5173](http://localhost:5173) por defecto.

## Scripts útiles

- `npm run dev` — Inicia el servidor de desarrollo con recarga en caliente.
- `npm run build` — Genera la versión optimizada para producción.
- `npm run preview` — Previsualiza la build de producción localmente.
- `npm run lint` — Ejecuta el linter para comprobar la calidad del código.

## Notas

- Asegúrate de que el backend esté funcionando y accesible desde el frontend.
- Si cambias el puerto del backend o frontend, actualiza las URLs en el archivo `.env`.

---

¡Listo! Ya puedes empezar a desarrollar o probar la aplicación.