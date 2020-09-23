const { AddArgumentsAsVariables } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {});
    console.log("CONEXION A DB EXITOSA");
  } catch (error) {
    console.log("HUBO UN ERROR DE CONEXION DE DB");
    console.log(error);
    process.exit(1); //detener la app
  }
};

module.exports = conectarDB;
