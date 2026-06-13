# Stock Zapatería - Guía de Despliegue (Producción)

Este documento detalla los pasos y variables necesarias para desplegar la aplicación en **Render** (Backend) y **Vercel** (Frontend).

---

## 🚀 Backend (Render)

1. **Crear un nuevo "Web Service"** vinculado a tu repo de GitHub.
2. **Build Command:** `npm install && npm run build`
3. **Start Command:** `npm start`
4. **Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render lo asigna automáticamente, pero es bueno tener un default)
   - `MONGODB_URI`: Tu URL de MongoDB Atlas.
   - `JWT_SECRET`: Una frase larga y aleatoria.
   - `JWT_REFRESH_SECRET`: Otra frase larga y aleatoria.
   - `APP_USERNAME`: Usuario inicial (ej: `admin`).
   - `APP_PASSWORD`: Contraseña inicial (ej: `ingreso2024`).
   - `ADMIN_PASSWORD`: Clave administrativa inicial (ej: `seguridad2024`).
   - `CORS_ORIGINS`: La URL de tu frontend en Vercel (ej: `https://tu-app.vercel.app`).

---

## ⚡ Frontend (Vercel)

1. **Importar el proyecto** desde GitHub.
2. **Framework Preset:** `Vite` (Vercel lo detecta solo).
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Environment Variables:**
   - `VITE_API_URL`: La URL de tu backend en Render (ej: `https://tu-app-backend.onrender.com`).

---

## 🛡️ Notas de Seguridad

- **Seed Database:** Si necesitas cargar productos iniciales, puedes ejecutar `npx ts-node src/seed.ts` localmente apuntando al URI de producción ANTES de subir, o crear un script temporal en el servidor.
- **CORS:** Asegúrate de que `CORS_ORIGINS` en Render coincida exactamente con la URL que te de Vercel (sin la barra final `/`).
