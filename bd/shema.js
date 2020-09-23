const { gql } = require("apollo-server");

//SCHEMA.......................  para definir que es lo que se llama, campos, datos, lo que se requiere
// type curso define tipo de datos
// type Query guarda los datos en la funcion obtenerCursos

const typeDefs = gql`
  type Query {
    obtenerCurso: String
  }
`;

module.exports = typeDefs;
