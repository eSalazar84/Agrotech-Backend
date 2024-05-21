# Backend Agrotech

[![NestJS](https://img.shields.io/badge/NestJS-v7.0.0-red)](https://nestjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Descripción

Este proyecto aloja el servidor de Agrotech, y esta construido en [NestJS](https://nestjs.com/), permitiendo exponer Rest API. La idea es lograr una correcta comunicacion 
entre la base de datos y el cliente que peticiona, devolviendo una respuesta efectiva.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación de la API](#documentación-de-la-api)
- [Pruebas](#pruebas)
- [Contacto](#contacto)

## Instalación

### Prerrequisitos

- Node.js (versión 12.x o superior)
- npm (versión 6.x o superior)

### Pasos de Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/eSalazar84/Agrotech-Backend.git
    cd tu-repositorio
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Configura las variables de entorno:
    - Crea un archivo `.env.local` en la raíz del proyecto.
    - Añade las siguientes variables según sea necesario:
      ```env
      PORT=3000
      DATABASE_URL= Comunicate con nosotros :)
      ...
      ```

## Uso

### Levantar el Servidor

Para iniciar el servidor en modo desarrollo:

``` bash
  npm run start:dev
  ```

## Estructura del proyecto

src/
│
├── app.module.ts
├── main.ts
│
├── helpers/
│
├── modules/
│   ├── auth/
│   ├── invoice/
│   ├── invoice-details/
│   ├── user/
│   └── products/
│
├── uploads/

## Documentacion de la API

La documentación de la API se genera automáticamente utilizando Swagger.

Para acceder a la documentación de la API, levanta el servidor y navega a http://localhost:3000/api

## Pruebas Unitarias

Pruebas Unitarias
Para ejecutar las pruebas unitarias, usa el siguiente comando:

``` bash
npm run test
```

Pruebas End-to-End
Para ejecutar las pruebas end-to-end, usa el siguiente comando:

``` bash
npm run test:e2e
```

## Autores

 - Autores, e-mail de contacto y link al perfil de GitHub 

    Anabel Assann 
      assannanabel@gmail.com
      [perfil de GitHub](https://github.com/AssannAnabel)      

    Fabricio Cordoba
      fabricio.cbe@gmail.com, 
      [perfil de GitHub](https://github.com/FabricioCordoba)

    Emiliano Salazar
      salazaremiliano84@gmail.com
      [perfil de GitHub](https://github.com/eSalazar84)


