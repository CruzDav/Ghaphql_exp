const { ApolloServer } = require("apollo-server");
const typeDefs = require(`./bd/shema`);
const resolvers = require(`./bd/resolvers`);
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const conectarDB = require("./config/db"); // declarar importar archivo de DB
//CONECTAR A LA BASE DE DATOS
conectarDB();

//servidor

const server = new ApolloServer({
  typeDefs, //Registro de los  typesDefs
  resolvers, //Registro de los  resolvers
  context: ({ req }) => {
    //console.log(req.headers["authorization"]);
    const token = req.headers["authorization"] || ""; //cuando autorizamos en el header guarda en token

    if (token) {
      // si
      try {
        const usuario = jwt.verify(token, process.env.SECRETA);
        console.log(usuario);

        return {
          usuario,
        };
      } catch (error) {
        console.log("HUBO UN ERROR");

        console.log(error);
      }
    }
  },
});

//arrancar el servidor
server.listen().then(({ url }) => {
  console.log(`Servior listo en la URL ${url}`);
});
