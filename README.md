# Sistema de Gestión Hotelera - Hotel Real 5★ (UPN 2026-2)

Aplicación web distribuida desarrollada con **Spring Boot (Backend)** y **Angular (Frontend)** para la gestión integral de reservas, habitaciones, categorías y clientes.

---

## 🚀 Inicio Automático Universal (Cualquier PC con Windows)

El proyecto incluye un iniciador inteligente y portable:

1. Haz **doble clic en `start.bat`** (o ejecútalo desde la consola).
2. El script revisa automáticamente:
   - **Java JDK (versión 21 o 25)**: Si no está en el sistema, lo busca en rutas conocidas o descarga automáticamente una versión portable en `.tools/jdk`.
   - **Node.js y npm**: Si no está instalado, lo busca en rutas comunes o descarga una versión portable en `.tools/node`.
   - **Dependencias de Frontend**: Si falta `node_modules`, ejecuta `npm install` automáticamente.
   - **Dependencias de Backend**: El Maven Wrapper (`mvnw.cmd`) descarga Maven y las dependencias de Spring Boot de forma autónoma.
3. Levanta el backend en el puerto `9494`, el frontend en el puerto `4200` y abre el navegador automáticamente.

---

## 🌐 URLs del Sistema

| Módulo | URL Local | Descripción |
|---|---|---|
| **Frontend Web** | [http://localhost:4200/](http://localhost:4200/) | Aplicación Angular con interfaz moderna |
| **Backend API** | [http://localhost:9494/](http://localhost:9494/) | Redirige automáticamente a Swagger UI |
| **Documentación Swagger** | [http://localhost:9494/swagger-ui.html](http://localhost:9494/swagger-ui.html) | Especificación interactiva OpenAPI 3 |

---

## 🔐 Credenciales de Prueba Precargadas

- **Administrador**: `testing1@example.com` / Contraseña: `123` (Roles: `ADMIN`, `DBA`)
- **Usuario Estándar**: `testing2@example.com` / Contraseña: `123` (Rol: `USER`)

---

## 📦 Módulos Disponibles en el Sistema

1. **Habitaciones (`/pages/room`)**: Mantenimiento completo, precio por noche, asignación de categoría y disponibilidad con badge interactivo.
2. **Categorías (`/pages/category`)**: Gestión de tipos de habitación (Suite, Matrimonial, Doble, etc.).
3. **Clientes (`/pages/customer`)**: Registro y edición de huéspedes con validación de documentos y correo.
4. **Reservas - Bookings (`/pages/booking`)**: Creación y control de reservas con fechas de check-in / check-out, selección de huésped y habitación.
