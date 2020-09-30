const mongoose = require("mongoose");

//definimos un schema

const ClientesSchema = mongoose.Schema({
  //definimos funcion Schema

  nombre: {
    type: String, //de tipo string
    require: true, //campo obligatorio
    trim: true, //elimina espacion que de el usuario
  },

  apellido: {
    type: String, //de tipo string
    require: true, //campo obligatorio
    trim: true, //elimina espacion que de el usuario
  },
  empresa: {
    type: String, //de tipo string
    require: true, //campo obligatorio
    trim: true, //elimina espacion que de el usuario
  },

  email: {
    type: String, //de tipo string
    require: true, //campo obligatorio
    trim: true, //elimina espacion que de el usuario
    unique: true, // que no se repitan clientes
  },

  telefono: {
    type: String, //de tipo string
    trim: true, //elimina espacion que de el usuario
  },

  creado: {
    type: Date, //de tipo fecha
    default: Date.now(), //guarda el dato justo en el tiempo creado
    trim: true, //elimina espacion que de el usuario
  },

  //para saber que vendedor dio de alta al usuario

  vendedor: {
    type: mongoose.Schema.Types.ObjectId, //  //para saber que vendedor dio de alta al usuario
    required: true,
    ref: "Usuario",
  },
});

module.exports = mongoose.model("Cliente", ClientesSchema); //agregamos un modelo SCHEMA

// ASIGNANDO UN VENDEDOR A CADA CLIENTE

// al generar un nuevo usuario o vendedor , y luego de autenticarlo = logearlo = ingresarlo ,
//se genera un token de vendedor,
// ese token cifrado se asigna(copia pega) al agregar un nuevo cliente en el apartado HTTP HEADERS
// y en la base de datos se registra un cliente con su respectico vendedor o usuario
