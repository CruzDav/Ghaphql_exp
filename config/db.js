const { AddArgumentsAsVariables } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("CONEXION A DB EXITOSA");
  } catch (error) {
    console.log("HUBO UN ERROR DE CONEXION DE DB");
    console.log(error);
  }
};

module.exports = conectarDB;
