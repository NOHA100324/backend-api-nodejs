# LenovoStore - Ecosistema de Inventario y Análisis (Node.js, Docker, Python & Colab)

Este proyecto es una solución integral que demuestra la integración entre un backend RESTful, un frontend dinámico y herramientas de análisis de datos en la nube.

## 🎯 Objetivos de Aprendizaje Cumplidos

1.  **API RESTful con Node.js**: Backend completo desarrollado con Express.js que implementa todas las operaciones CRUD (Create, Read, Update, Delete).
2.  **Contenedores Docker**: Infraestructura orquestada mediante `docker-compose.yml` para levantar la API y una base de datos MySQL de forma automática y aislada.
3.  **Análisis con Python & Google Colab**: Notebook funcional (`api_and_colab_demo.ipynb`) que integra Google Drive para gestionar archivos en la nube, procesa datos con Pandas y consume la API de Node.js.
4.  **Comunicación Frontend-Backend**: Interfaz de usuario moderna inspirada en Lenovo que consume servicios web mediante el protocolo HTTP (fetch).
5.  **Gestión de Archivos y Colaboración**: Estructura de proyecto organizada, uso de archivos CSV para importación de datos y configuración mediante variables de entorno.

## 📁 Estructura del Proyecto

- `backend/`: Servidor Express, Dockerfile y scripts de base de datos (`init.sql`).
- `frontend/`: Aplicación cliente (HTML/CSS/JS) con estética de Lenovo.
- `api_and_colab_demo.ipynb`: Notebook para análisis y sincronización de datos.
- `laptops.csv`: Archivo de ejemplo para importar a la nube (Google Drive).
- `docker-compose.yml`: Orquestador de servicios.

## 🚀 Guía de Inicio Rápido

### Usando Docker (Recomendado)

1.  Asegúrate de tener Docker instalado.
2.  Desde la raíz del proyecto, ejecuta:
    ```bash
    docker compose up --build
    ```
3.  Accede a la API en `http://localhost:3000/api/products`.
4.  Accede al Frontend en `http://localhost:5500`.

### Configuración de Google Colab

1.  Sube el archivo `laptops.csv` a tu Google Drive (puedes crear una carpeta llamada `MyDrive`).
2.  Abre el archivo `api_and_colab_demo.ipynb` en [Google Colab](https://colab.research.google.com/).
3.  Sigue las instrucciones en el notebook para montar Drive, procesar los datos y visualizar el stock.

### Interfaz Web (Frontend)

La interfaz se levanta automáticamente con Docker en el puerto 5500. Si deseas ejecutarla de forma independiente para desarrollo, puedes usar un servidor de archivos estáticos en la carpeta `frontend`.

---
© 2026 LenovoStore - Proyecto Educativo de Integración Web.
