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

  type Pedido {
    id: ID
    pedido: [PedidoGrupo]
    totalapagar: Float
    cliente: ID
    vendedor: ID
    fecha: String
    estado: EstadoPedido
  }

  type PedidoGrupo {
    id: ID
    cantidad: Int
  }

  ##########################################

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

  input PedidoProductoInput { ## campos q tiene ese arreglo pedido
    id: ID
    cantidad: Int
  }

  input PedidoInput {
    pedido: [PedidoProductoInput] ##-- Pedido es un arreglo(Array) por lo tanto tbm habra input tipo ARREGLO{}
    totalapagar: Float!
    cliente: ID!
    estado: EstadoPedido
  }

  enum EstadoPedido { ##--- Defice que solo que campos va a asignarce en Estadopedido
    PENDIENTE
    COMPLETADO
    CANCELADO
  }

  ##########################################  CONSULTAR  #################################################

  type Query {
    ####  USUARIOS  ####

    obtenerUsuario(token: String!): Usuario

    ####  PRODUSTOS  ####

    obtenerProductos: [Producto]

    ###------ Obteniendo informacion de un solo producto de la BD ----##

    obtener_inf_Prod(id: ID!): Producto

    ####  CLIENTES  ####

    ## ----obteniendo todos los CLIENTES ----

    obtenerClientes: [Clientes]
    obtenerClientesVendedor: [Clientes]
    obtener_inf_Cliente(id: ID!): Clientes

    ####  PEDIDOS  ####
    obtenerPedidos: [Pedido]
    obtenerPedidosVendedor: [Pedido]
    obtener_Pedido_especifico(id: ID!): Pedido
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
    eliminarCliente(id: ID!): String

    ####  PEDIDOS ####

    nuevoPedido(input: PedidoInput): Pedido
  }
`;

module.exports = typeDefs;
