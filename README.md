# Sistema de Gestión de Inventarios para Productos Perecederos (SGIPP)

![NODE JS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Proyecto en su versión básica para la gestión de productos perecederos o alimentarios. El sistema permite registrar datos de producto y sus respectivas entradas en almacén, asi como realizar las salidas.
## :scroll: Contenido
- [Funcionalidades](funcionalidades)
- [Acceso](acceso)
- [Ejecución](ejecución)
- [Herramientas](herramientas)
## :hammer: Funcionalidades
- `Sesiones`: para entrar debemos introducir correctamente las credenciales. Puedes usar usuario: Daiana y contraseña: root.
- `Creación de producto`: registrar un nuevo producto desde la página de agregar producto añadiendo los datos de SKU, nombre y descripción.
- `Registro de entradas`: dentro del producto, se pueden introducir los datos de lote, cantidad y fecha de caducidad para hacer constancia de una entrada.
- `Constar salidas`: eliminar entradas caducadas o que han salido de almacén.
## :open_file_folder: Acceso
1. Descomprime el archivo zip descargado de GITHUB.
2. Descarga PostgreSQL desde este link https://www.postgresql.org/
3. Una vez instalado, abre pgAdmin4 y entra en el servidor PostgreSQL 15 escribiendo la contraseña que has establecido en el instalador.
4. Una vez dentro, vas a crear una base de datos haciendo clic derecho sobre Databases(1).
5. En la casilla Database vas a escribir el nombre de la base de datos, en este caso, inventario (aunque le puedes poner el nombre que quieras), y vas a guardar los cambios.
6. Vas a hacer clic derecho sobre la base de datos recién creada y vamos a restaurar los datos con el archivo inventario.sql que te he dejado subido a la tarea.
7. Haz clic en el icono de la carpeta y selecciona desde la ventana que se abre el archivo inventario.sql. Una vez seleccionado haz clic en Restore.
## :wrench: Ejecución
1. Ya tienes la base de datos actualizada con las tablas y datos que necesita el proyecto. Ahora bien, como posiblemente la contraseña de tu servidor sea distinta a la mía, tendremos que hacer cambios en el archivo db.js del proyecto. Vas a abrir el fichero db.js que se encuentra en la carpeta SGIPP/config en el editor de texto. En la función crearConexion vas a cambiar el campo password con tu contraseña. Si has querido llamar la base de datos de otra forma distinta a inventario también tienes que cambiar el campo database. Acuérdate de guardar con cambios.
2. Ahora vamos a instalar las dependencias del proyecto. Para eso necesitamos la terminal.
3. Al abrir la terminal vas a navegar a la carpeta proyecto con el comando $ cd seguido de la ruta donde tengas la carpeta SGIPP. En mi caso, por ejemplo, es $ cd /Desktop/SGIPP.
4. Una vez dentro vas a ejecutar el comando $npm install que Con crea la carpeta node_modules necesaria para el funcionamiento del sistema.
5. Como último paso, sin cambiar de ruta, vas a ejecutar node con el comando $ node index. El sistema va a estar funcionando en el puerto 4000. Dentro del navegador vas a http://localhost:4000 y ya podrás introducir las credenciales.
## :toolbox: Herramientas
- JavaScript
- EJS
- Node JS
- Express
- PostgreSQL
