const Usuario = require("../models/Usuarios"); //obteniendo todos los metodos de mongos para insertar el registro
const bcrypts = require("bcryptjs"); //comando pafa encriptar
//const { exists } = require("../models/Usuarios");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "variables.env" });

const crearToken = (usuario, secreta, expiresIn) => {
  console.log(usuario);
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn });
};

//RESOLVRES........................son funciones de reultados buscados en schema

const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioID = await jwt.verify(token, process.env.SECRETA);
      return usuarioID;
    },
  },
  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      const { email, password } = input;

      //Revisar si el usuario ya esta logiado
      const existeUsuario = await Usuario.findOne({ email }); // para buscar un dato

      if (existeUsuario) {
        throw new Error("El usuario ya existe");
      }

      //hashear su password = encriptar

      const salt = await bcrypts.genSalt(10);
      input.password = await bcrypts.hash(password, salt);

      try {
        //Guardaro en DB
        const usuario = new Usuario(input); //una nueva instancia del modelo usuario
        usuario.save(); //guardando en db
        return usuario; //retorna el usuario creasdo en db
      } catch (error) {
        console.log("ERROR YA EXISTE USUARIO");
      }
    },

    // PARA AUTENTICAR = INGRESAR USUARIO A SISTEMA

    autenticarUsuario: async (_, { input }) => {
      // autenticar=ingresar usuario ya registrado
      const { email, password } = input;

      //verif si usuario ya existe
      const existeUsuario = await Usuario.findOne({ email }); // para buscar un dato....finOne=busca el 1er ingresado
      if (!existeUsuario) {
        throw new Error("El usuario NO existe");
      }

      //REVISAR SI PASSWORD ES CORRECTO
      const passwordCorrecto = await bcrypts.compare(
        password,
        existeUsuario.password
      ); // compara password con paswrod ingresado y encontrado arriba
      if (!passwordCorrecto) {
        throw new Error("El PASSWORD ES INCORRECTO");
      }

      //CREAR TOKEN
      return {
        token: crearToken(existeUsuario, process.env.SECRETA, "24h"),
      };
    },
  },
};

module.exports = resolvers;
