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

  type Token {
    token: String
  }

  type Producto {
    id: ID
    nombre: String
    existencia: Int
    precio: Float
    creado: String
  }

  type Clientes {
    id: ID
    nombre: String
    apellido: String
    empresa: String
    email: String
    telefono: Int
    vendedor: ID
  }

  ##########################################3

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  input AutenticarInput {
    email: String!
    password: String!
  }

  input ProductoInput {
    nombre: String!
    existencia: Int!
    precio: Float!
  }

  input ClientesInput {
    nombre: String!
    apellido: String!
    empresa: String!
    email: String!
    telefono: String
  }

  ##########################################  CONSULTAR  #################################################

  type Query {
    ####  USUARIOS  ####

    obtenerUsuario(token: String!): Usuario

    ####  PRODUSTOS  ####

    obtenerProductos: [Producto]

    ###------ Obteniendo informacion de un solo producto de la BD ----##

    obtener_inf_Prod(id: ID!): Producto

    ## ----obteniendo todos los CLIENTES ----

    obtenerClientes: [Clientes]
    obtenerClientesVendedor: [Clientes]
    obtener_inf_Cliente(id: ID!): Clientes
  }

  ##########################################  AGREGAR #################################################

  type Mutation {
    ####  USUARIOS  ####

    nuevoUsuario(input: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token

    ####  PRODUCTOS ####

    nuevoProducto(input: ProductoInput): Producto
    actualizar_datos_Producto(id: ID!, input: ProductoInput): Producto
    eliminarProducto(id: ID!): String

    ####  CLIENTES ####

    nuevoCliente(input: ClientesInput): Clientes
    actualizar_datos_Cliente(id: ID!, input: ClientesInput): Clientes
  }
`;

module.exports = typeDefs;
