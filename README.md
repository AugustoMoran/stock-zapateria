# Stock Zapatería - Sistema de Gestión Profesional

Sistema Full Stack profesional para el control de stock, ventas, cambios y devoluciones de una zapatería. Desarrollado con el stack de Full Stack Open.

## 🚀 Tecnologías

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Diseño Responsive & Moderno)
- **Context API** (Gestión de estado global)
- **Axios** (Cliente HTTP con interceptores para Refresh Token)
- **Lucide React** (Iconografía)
- **React Hot Toast** (Notificaciones)

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** (Access Token + HttpOnly Refresh Token Cookies)
- **Bcryptjs** (Seguridad de contraseñas)

## 🛠️ Arquitectura
- **Separación por capas**: Controllers, Services, Models, Routes, Middlewares.
- **Seguridad**: Renovación automática de tokens, protección de rutas, auditoría completa.
- **Validaciones**: Control de stock en tiempo real en cada operación.

## 📦 Instalación

1. Clonar el repositorio.
2. Configurar variables de entorno en `backend/.env` (ver `backend/.env.example`).
3. Instalar dependencias en ambas carpetas:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. Ejecutar el seed para datos iniciales (opcional):
   ```bash
   cd backend && npm run build && node dist/seed.js
   ```
5. Iniciar en desarrollo:
   - Backend: `npm run dev` (puerto 5000)
   - Frontend: `npm run dev` (puerto 5173)

## 🔐 Credenciales por Defecto (Seed)
- **Usuario Operativo**: `usuario1` / `user123`
- **Contraseña Admin**: `admin123`

## 📊 Funcionalidades
- **Ventas**: Carrito multi-producto, descuento automático de stock, cálculo de ganancia neta.
- **Cambios**: Sistema de entrada/salida automática con cálculo de diferencia de precio.
- **Devoluciones**: Ingreso automático a stock y registro de egreso de caja.
- **Auditoría**: Registro de cada login, venta, cambio, devolución y modificación de stock.
- **Panel Admin**: Dashboard financiero, gestión de productos, reportes por fecha, logs de sistema.

## 🚀 Deploy

### Frontend (Vercel)
Vite detectará automáticamente la configuración. Asegúrate de configurar la variable `VITE_API_URL` apuntando a tu backend.

### Backend (Render / Railway)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- Configurar variables de entorno en el dashboard del proveedor.
