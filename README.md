# Inventory Management System for Perishable Products (known as SGIPP in Spanish)

![NODE JS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Project in its basic version for the management of perishable or food products. The system allows to register product data and their respective entries in the warehouse, as well as the exits.
## :scroll: Contents
- [Functionalities](functionalities)
- [Access](access)
- [Execution](execution)
- [Data Format](data-format)
- [Tools](tools)
## :hammer: Functionalities
- `Sessions`: to log in we must enter correctly the credentials. You can use user: Daiana and password: root.
- `Product creation`: register a new product from the add product page adding SKU, name and description data.
- `Record entries`: within the product, you can enter the batch, quantity and expiration date data to record an entry.
- `Record outputs`: delete expired entries or those that have left the warehouse.
## :open_file_folder: Acces
1. Unzip the zip file downloaded from GITHUB.
2. Download PostgreSQL from this link https://www.postgresql.org/
3. Once installed, open pgAdmin4 and login to the PostgreSQL 15 server by typing the password you set in the installer.
4. Once inside, you are going to create a database by right clicking on Databases(1).
5. In the Database box, type the name of the database, in this case, inventario (although you can name it anything you want), and save the changes.
6. You are going to right click on the newly created database and we are going to restore the data with the file inventario.sql that I have left you uploaded.
7. Click on the folder icon and select from the window that opens the file inventario.sql. Once selected click on Restore.
## :wrench: Execution
1. You already have the database updated with the tables and data that the project needs. Now, as possibly your server password is different from mine, we will have to make changes in the db.js file of the project. You are going to open the db.js file located in the SGIPP/config folder in the text editor. In the createConnection function you are going to change the password field with your password. If you wanted to call the database other than inventario you also have to change the database field. Remember to save with changes.
2. Now we are going to install the project dependencies. For that we need the terminal.
3. When you open the terminal you are going to navigate to the project folder with the command $ cd followed by the path where you have the SGIPP folder. In my case, for example, it is $ cd /Desktop/SGIPP.
4. Once inside you are going to execute the command $npm install that creates the node_modules folder needed for the system to work.
5. As a last step, without changing the path, you are going to run node with the command $ node index. The system will be running on port 4000. Inside the browser go to http://localhost:4000 and you will be able to enter the credentials.
## :abacus: Data Format
- `SKU`: is an internal unique reference code. The code consists of 8 characters. The first two are the abbreviation of a country name and represent the origin of the commodity, such as DE for Germany or GN for Guinea. The next two represent the family to which the food belongs, such as 01 for vegetables or 02 for fruits. The last 4 refer to the specific type of food. An example would be RO597538, RO for Romania, 59 for seeds and 7538 for sunflower seeds.
- `Name`: has a maximum of 20 characters and all the words that compose it must begin with a capital letter, for example, Tomate De Arbol.
- `Description`: has a maximum of 280 characters and begins with a capital letter.
- `Batch`: is a code, which can be only numeric or contain letters, and tells us when a product has been produced, manufactured or packaged. This field, unlike the SKU, has different formats depending on the supplier.
- `Quantity`: this is a numeric data, to specify the unit of measure it can be added as a clarification in the product description.
## :toolbox: Tools
- JavaScript
- EJS
- Node JS
- Express
- PostgreSQL