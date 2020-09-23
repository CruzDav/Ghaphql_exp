const { ApolloServer } = require("apollo-server");
const typeDefs = require(`./bd/shema`);
const resolvers = require(`./bd/resolvers`);

//servidor
const server = new ApolloServer({
  typeDefs, //Registro de los  typesDefs
  resolvers, //Registro de los  resolvers
});

//arrancar el servidor
server.listen().then(({ url }) => {
  console.log(`Servior listo en la URL ${url}`);
});
