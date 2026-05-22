#README - Proyecto Full Stack (Python + React/Vite)
📌 Descripción
Este proyecto está dividido en dos partes:
Backend: API desarrollada en Python.
Frontend: Aplicación React usando Vite.

#🚀 Requisitos Previos
Antes de iniciar, asegúrese de tener instalado:
Backend
Python 3.10+
pip
MySQL

#Frontend
Node.js 18+
pnpm


Instalar pnpm globalmente:
npm install -g pnpm

⚙️ Configuración del Backend
1. Clonar el proyecto
git clone <URL_DEL_REPOSITORIO>cd backend

2. Crear y activar entorno virtual (venv)
Windows
python -m venv venvvenv\Scripts\activate
3. Instalar dependencias

El proyecto utiliza un archivo requirements.txt.

pip install -r requirements.txt
4. Crear la base de datos

⚠️ La base de datos debe crearse manualmente antes de ejecutar las migraciones.

Ejemplo en PostgreSQL:

CREATE DATABASE nombre_db;

5. Configurar variables de entorno

Crear un archivo .env en la raíz del backend.

Ejemplo:

DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
SECRET_KEY=mi_clave_secreta
6. Ejecutar migraciones con Alembic

Inicializar la estructura de la base de datos:
python -m alembic revision --autogenerate -m "create_all_tables" 
python alembic upgrade head

7. Ejecutar el backend

Ejemplo con FastAPI:

uvicorn app:app --reload

🎨 Configuración del Frontend (React + Vite)
1. Entrar a la carpeta del frontend
cd frontend
2. Instalar dependencias con pnpm
pnpm install
3. Configurar variables de entorno

Crear archivo .env.

Ejemplo:

VITE_API_URL=http://localhost:8000
4. Ejecutar el frontend
pnpm run dev

La aplicación estará disponible en:

http://localhost:5173


