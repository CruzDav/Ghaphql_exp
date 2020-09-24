const mongoose = require("mongoose");

//definimos un schema

const UsuariosSchema = mongoose.Schema({
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
  email: {
    type: String, //de tipo string
    require: true, //campo obligatorio
    trim: true, //elimina espacion que de el usuario
    unique: true,
  },
  password: {
    type: String, //de tipo string
    require: true, //campo obligatorio
    trim: true, //elimina espacion que de el usuario
  },
  creado: {
    type: Date, //de tipo fecha
    default: Date.now(), //guarda el dato justo en el tiempo creado
    trim: true, //elimina espacion que de el usuario
  },
});

module.exports = mongoose.model("Usuario", UsuariosSchema); //agregamos un modelo SCHEMA
