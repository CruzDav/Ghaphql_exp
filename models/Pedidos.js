const mongoose = require("mongoose");

//definimos un schema

const PedidosSchema = mongoose.Schema({
  //definimos funcion Schema

  pedido: {
    type: Array,
    require: true,
  },
  totalapagar: {
    type: Number,
    require: true,
  },

  cliente: {
    // guardar el di del modelo de cliente
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Cliente", // toma referecia del objectID del CLIENTE
  },

  vendedor: {
    // guardar el di del modelo de usuario
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Usuario", // toma referecia del objectID del USUARIO
  },

  estado: {
    type: String,
    default: "PENDIENTE", //  Estado endiente para poner msj a almacen entrega etc
  },

  creado: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Pedido", PedidosSchema); //agregamos un modelo SCHEMA
