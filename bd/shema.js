const { gql } = require("apollo-server");

//SCHEMA.......................  para definir que es lo que se llama, campos, datos, lo que se requiere
// type curso define tipo de datos
// type Query guarda los datos en la funcion obtenerCursos

const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  input UsuarioInput {
    nombre: String
    apellido: String
    email: String
    password: String
  }

  type Query {
    obtenerCurso: String
  }
  type Mutation {
    nuevoUsuario: String
  }
`;

module.exports = typeDefs;
