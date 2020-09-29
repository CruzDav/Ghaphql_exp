const mongoose = require("mongoose");

//definimos un schema

const ProductosSchema = mongoose.Schema({
  //definimos funcion Schema
  nombre: {
    type: String, //de tipo string
    require: true, //campo obligatorio
    trim: true, //elimina espacion que de el usuario
  },

  existencia: {
    // productos en stock
    type: Number, // tipo numero cualquiera
    require: true, //obligatorio
    trim: true,
  },

  precio: {
    type: Number,
    require: true, //obligatorio
    trim: true,
  },

  creado: {
    // para saber cuando se registro
    type: Date, //de tipo fecha
    default: Date.now(), //guarda el dato justo en el tiempo creado
    trim: true, //elimina espacion que de el usuario
  },
});

module.exports = mongoose.model("Producto", ProductosSchema); //agregamos un modelo SCHEMA
