# persistencia_construccionDeApi
TP final de persistencia de datos. Construcción de una API utilizando NodeJS, Sequelize. Con autorización y paginación.

     mkdir api_v1
     cd api_v1/
     npm install --save sequelize
     npm init -y
     sudo apt-get install mariadb
     sudo apt-get install mariadb-server
     npm install --save mariadb
     sudo npm install express-generator -g
     npm install 
     npm install sequelize --save
     npm install sequelize-cli --save
     npx sequelize init
     DEBUG=api:* npm start

    ~


     npx sequelize-cli model:generate --name carrera --attributes nombre:string
     npx sequelize db:migrate

     npx sequelize-cli model:generate --name materias --attributes nombre:string,id_carrera:integer
        npx sequelize-cli model:generate --name user --attributes name:string,password:string,email:string

´´{"nombre":"Matematica" } 
{} 

{
    "nombre":"Matematica",
    "Carreara-Realacionada":{
        "id":1,
        "nombre":"Arquitectura"
    } 
} 
