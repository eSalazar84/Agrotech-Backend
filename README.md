# Backend Agrotech

## Descripción

Este proyecto aloja el servidor de Agrotech, el mismo esta construido en [NestJS](https://nestjs.com/), permitiendo exponer Rest API. La idea es lograr una correcta comunicacion 
entre la base de datos y el cliente que peticiona, devolviendo una respuesta efectiva.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Dependencias](#dependencias)
- [Documentación de la API](#documentación-de-la-api)
- [Pruebas](#pruebas)
- [Contacto](#contacto)

## Instalación

### Prerrequisitos

- Node.js (versión 12.x o superior)
- npm (versión 6.x o superior)
- Git (versión 2.45.2)
- MySQL (versión 8.0.37)

### Pasos de Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/eSalazar84/Agrotech-Backend.git
    cd repositorio-para-alojar-el-programa
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

```
src/
│
├── app.module.ts
├── main.ts
│
├── modules/
│   ├── auth/
├── ├── helpers/
│   ├── invoice/
│   ├── invoice-details/
├── ├── mail/
│   ├── products/
│   └── user/
│
├── uploads/
└── uploads-images/
```

## Dependencias

- [NestJS](https://nestjs.com/)
- [TypeORM - MySQL](https://docs.nestjs.com/techniques/database)
- [class-transformer_class-validator](https://docs.nestjs.com/techniques/validation)
- [bcrypt](https://docs.nestjs.com/security/encryption-and-hashing)
- [cloudinary](https://cloudinary.com/documentation/node_integration)
- [multer](https://docs.nestjs.com/techniques/file-upload#array-of-files)
- [fast-csv](https://www.npmjs.com/package/fast-csv)
- [nodemailer](https://www.nodemailer.com/)



## Documentacion de la API

La documentacion de la API esta generada mediante SWAGGER

Para acceder a la documentación de la API, dirigite a http://localhost:3000/agrotech-api

## Pruebas Unitarias

Pruebas Unitarias
Para ejecutar las pruebas unitarias, usa el siguiente comando:

``` bash
npm run test:watch
```

Coverage
Para conocer la covertura de testeo de la aplicación, usa el siguiente comando:

``` bash
npm run test:cov
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


