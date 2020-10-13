const Usuario = require("../models/Usuarios"); //obteniendo todos los metodos de mongos para insertar el registro
const Producto = require("../models/Productos");
const Cliente = require("../models/Clientes");
const Pedidos = require("../models/Pedidos");

const bcrypts = require("bcryptjs"); //comando pafa encriptar
//const { exists } = require("../models/Usuarios");
const jwt = require("jsonwebtoken"); //modulo constante para para autenticar verificar token, id de usuarios
const { error } = require("server/router");
const { Error } = require("mongoose");
const Clientes = require("../models/Clientes");
const Productos = require("../models/Productos");
require("dotenv").config({ path: "variables.env" });

const crearToken = (usuario, secreta, expiresIn) => {
  console.log(usuario);
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn }); //jwt para verificar token sifrado
};

//****************************RESOLVRES******************** son funciones de reultados buscados en schema

const resolvers = {
  //
  Query: {
    obtenerUsuario: async (_, { token }) => {
      //   OBTIENE id de usuario
      try {
        const usuarioID = await jwt.verify(token, process.env.SECRETA); //toma el token y si es valido gyarda enusuarioID
        return usuarioID;
      } catch (error) {
        console.log(error);
      }
    },

    // Oteniendo todos los Productos de DB

    obtenerProductos: async (_, { token }) => {
      try {
        //   OBTIENE DATOS DE PRODUCTOS
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
      }
    },

    //Obteniendo un producto especifico consutando su exitencia

    obtener_inf_Prod: async (_, { id }) => {
      //revisar si el producto existe

      const producto = await Producto.findById(id); // encuentra por id

      if (!producto) {
        throw new Error("PRODUCTO NO EXISTE EN DB");
      }
      return producto;
    },

    //  *** OBTENER TODOS LOS CIENTES***
    obtenerClientes: async () => {
      try {
        //   OBTIENE DATOS DE PRODUCTOS
        const clientes = await Clientes.find({});
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },

    // OBTENER CLIENTES DE UN VENDEDOR ESP.

    obtenerClientesVendedor: async (_, {}, ctx) => {
      try {
        //
        const clientes = await Clientes.find({
          vendedor: ctx.usuario.id.toString(),
        });
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },

    //obtener cliente especifico con id

    obtener_inf_Cliente: async (_, { id }, ctx) => {
      //revisar si el producto existe

      const cliente = await Clientes.findById(id); // encuentra por id

      if (!cliente) {
        throw new Error("PRODUCTO NO EXISTE EN DB");
      }

      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        //compara si la consulta la hace el mismo usuario quien dio de alta a ese id de vendedor
        throw new Error("NO TIENES LAS CREDENCIALES ");
      }
      return cliente;
    },

    // obtener todos los pedidos

    obtenerPedidos: async () => {
      try {
        //   OBTIENE DATOS DE PEDIDOS
        const pedidos = await Pedidos.find({});
        return pedidos;
      } catch (error) {
        console.log(error);
      }
    },

    obtenerPedidosVendedor: async (_, {}, ctx) => {
      console.log("****************************");
      console.log(ctx);
      try {
        //   OBTIENE DATOS DE PEDIDOS
        const pedidos = await Pedidos.find({ vendedor: ctx.usuario.id }); //obtiene todos lis usuarios de el vendedor
        return pedidos;
      } catch (error) {
        console.log(error);
      }
    },

    obtener_Pedido_especifico: async (_, { id }, ctx) => {
      //verificar si pedido existe o no
      const pedido = await Pedidos.findById(id);
      if (!pedido) {
        throw new Error("NO EXISTE ESTE PEDIDO EN BD");
      }

      //  solo quien lo creo puede verlo
      if (pedido.vendedor.toString() !== ctx.usuario.id) {
        // ingresa a la db de pedido, consigue vendedor, lo hace string si es diferente al usuario que esta autenticado=es un error o trampajj

        throw new Error("NO TIENES LAS CREDENCIALES");
      }
      return pedido;
    },

    // obteer pedidos seun estado de pedido

    obtenerPedidos_segunEstado: async (_, { estado }, ctx) => {
      const pedido = await Pedidos.find({ vendedor: ctx.usuario.id, estado });
      return pedido;
    },

    // CONSULTAS AVANZADAS

    mejoresClientes: async () => {  // coge los cliente con pedidos completos, pagos 
      const clientes = await Pedidos.aggregate([
        { $match: { estado: "COMPLETADO" } }, // une algo en comun
        {
          $group: {
            // agrupa
            _id: "$cliente",
            total: { $sum: "$totalapagar" },
          },
        },
        {
          $lookup: {
            from: "clientes",
            localField: "_id",
            foreignField: "_id",
            as: "cliente",
          },
        },
        {
          $limit :10
        },
        {
          $sort:{total: -1}
        }
      ]);

      return clientes;
    },

    mejoresVendedores:async()=>{
      const vendedor = await Pedidos.aggregate([
        { $match: { estado: "COMPLETADO" } }, // une algo en comun
        {
          $group: {
            // agrupa
            _id: "$vendedor",
            total: { $sum: "$totalapagar" },
          },
        },
        {
          $lookup: {
            from: "usuarios",
            localField: "_id",
            foreignField: "_id",
            as: "vendedor"
          },
        },

        {
          $limit :3  
        },
        {
          $sort:{total: -1}
        }
      ]);

      return vendedor;
    },


    buscar_Producto:async(_,{text})=>{
const producto = Productos.find({$text:{$search:text}}).limit(10)
return producto;
    
  },
},


  ///////////////////////////////////////   MUTATIONS  //////////////////////////////////////

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
        //************* */ //Guardaro en DB //*********** */

        const usuario = new Usuario(input); //una nueva instancia del modelo usuario
        usuario.save(); //guardando en db
        return usuario; //retorna el usuario creasdo en db
      } catch (error) {
        console.log("ERROR YA EXISTE USUARIO");
      }
    },

    // PARA AUTENTICAR = INGRESAR USUARIO A SISTEMA ......validar su usuario y email

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
        token: crearToken(existeUsuario, process.env.SECRETA, "24h"), // palabrea secreta para firmar token y verificar
      };
    },

    nuevoProducto: async (_, { input }) => {
      //  guardar nuevo producto
      try {
        const producto = new Producto(input);
        //almacenar en BD
        const resultado = await producto.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },

    // ***************** Actualizar datos  un usuario tomando un id e input

    actualizar_datos_Producto: async (_, { id, input }) => {
      //revisar si el producto existe

      let producto = await Producto.findById(id); // encuentra por id y guarda en let

      if (!producto) {
        throw new Error("PRODUCTO NO EXISTE EN DB");
      }

      // en caso de que si exista en db se guarda y con let se lo obtiene para luego reasignarle
      producto = await Producto.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return producto;
    },

    // ******** Eiminar Productos de DB

    eliminarProducto: async (_, { id }) => {
      //revisar si el producto existe

      let producto = await Producto.findById(id); // encuentra por id y guarda en let

      if (!producto) {
        throw new Error("PRODUCTO NO EXISTE EN DB");
      }

      //Eliminar
      await Producto.findOneAndDelete({ _id: id });
      return "PRODUCTO ELIMINADO DE DB";
    },

    // **** CLIENTES *****//

    nuevoCliente: async (_, { input }, ctx) => {
      // llama al context
      console.log(ctx);
      const { email } = input;
      //Revisar si el usuario ya esta logiado

      const existeCliente = await Clientes.findOne({ email }); // para buscar un dato

      if (existeCliente) {
        throw new Error("El cliente ya existe");
      }

      const nuevoCliente = new Clientes(input);
      nuevoCliente.vendedor = ctx.usuario.id; // para que se asigne automaticamente

      //********* */ //Guardaro en DB //*********** */
      try {
        const resultado = await nuevoCliente.save(); //guardando en db
        return resultado; //retorna el usuario creasdo en db
      } catch (error) {
        console.log("ERROR");
      }
    },

    actualizar_datos_Cliente: async (_, { id, input }, ctx) => {
      //revisar si el producto existe

      let cliente = await Clientes.findById(id); // encuentra por id y guarda en let

      if (!cliente) {
        throw new Error("CLIENTE NO EXISTE EN DB");
      }

      // verificicar si el vendedor es quien edita o actualiza
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        //compara si la consulta la hace el mismo usuario quien dio de alta a ese id de vendedor

        throw new Error("NO TIENES LAS CREDENCIALES ");
      }

      // en caso de que si exista en db se guarda y con let se lo obtiene para luego reasignarle
      cliente = await Clientes.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return cliente;
    },

    //Eliminando clientes

    eliminarCliente: async (_, { id }, ctx) => {
      //revisar si el producto existe

      let cliente = await Cliente.findById(id); // encuentra por id y guarda en let

      if (!cliente) {
        throw new Error("CLIENTE NO EXISTE EN DB");
      }

      // verificicar si el vendedor es quien ELIMINA
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        //compara si la consulta la hace el mismo usuario quien dio de alta a ese id de vendedor

        throw new Error("NO TIENES LAS CREDENCIALES ");
      }

      //Eliminar
      await Cliente.findOneAndDelete({ _id: id });
      return "CLIENTE ELIMINADO DE DB";
    },

    // **** CLIENTES *****//

    nuevoPedido: async (_, { input }, ctx) => {
      const { cliente } = input; //solo obtiene dato cliente del arreglo input !!!!!!!!!!!!!!!!

      // verificar si cliente existe o no
      let clienteExiste = await Clientes.findById(cliente); // encuentra por cliente y guarda en let

      if (!clienteExiste) {
        throw new Error("CLIENTE NO EXISTE EN DB");
      }
      console.log("------------------>cliente");
      console.log(clienteExiste);
      console.log("------------------>cliente");
      //verificar si el usuarioes es quien dio alta al cliente

      if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
        //compara si la consulta la hace el mismo usuario quien dio de alta a ese id de vendedor

        throw new Error("NO TIENES LAS CREDENCIALES ");
      }

      // verificar si hay priductos en stock

      for await (const articulo of input.pedido) {
        // el for obtiene TODOS(bucle) los productos solicitados // guarda arreglo(input.pedido) en articulo
        const { id, cantidad } = articulo; // obtiene id y cantidad del pedido
        const producto = await Producto.findById(id); // busca el id y guarda en producto

        if (cantidad > producto.existencia) {
          // si es mayor a la existencia de cantidad en stock
          throw new Error(
            `EL ARTICULO: ${producto.nombre} excede la cantida disponible es stock`
          );
        } else {
          //restar la cantidad a lo disponible
          producto.existencia = producto.existencia - cantidad;
          await producto.save();
        }

        //crear un nuevo pedido

        const nuevoPedido = new Pedidos(input);

        // asignar un vendedor

        nuevoPedido.vendedor = ctx.usuario.id;
        //Guardar en BD

        const resultado = await nuevoPedido.save();
        return resultado;
      }
    },

    actualizar_Pedido: async (_, { id, input }, ctx) => {
      const { cliente } = input;

      //verificar si el Pedido existe
      const pedidoexiste = await Pedidos.findById(id);
      if (!pedidoexiste) {
        throw new Error("PEDIDO NO EXISTE ");
      }

      //verificar si el cliente existe
      const clienteexiste = await Clientes.findById(cliente);
      if (!clienteexiste) {
        throw new Error("CLIENTE NO EXISTE ");
      }

      //verif si el cliente y pedido pertenecen al vendedor
      if (clienteexiste.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("NO TIENES LAS CREDENCIALES ");
      }

      //revisar si hay Stock
      if (input.pedido) {
        for await (const articulo of input.pedido) {
          // el for obtiene TODOS(bucle) los productos solicitados // guarda arreglo(input.pedido) en articulo
          const { id, cantidad } = articulo; // obtiene id y cantidad del pedido
          const producto = await Producto.findById(id); // busca el id y guarda en producto

          if (cantidad > producto.existencia) {
            // si es mayor a la existencia de cantidad en stock
            throw new Error(
              `EL ARTICULO: ${producto.nombre} excede la cantida disponible es stock`
            );
          } else {
            //restar la cantidad a lo disponible
            producto.existencia = producto.existencia - cantidad;
            await producto.save();
          }
        }
      }
      //guardar el pedido
      const resultado = await Pedidos.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return resultado;
    },

    eliminar_Pedido: async (_, { id }, ctx) => {
      //Verificar si el pedido existe
      const pedidoexiste = await Pedidos.findById(id);
      if (!pedidoexiste) {
        throw new Error("PEDIDO NO EXISTE ");
      }

      //Verificar si quien borra es el vendedor

      if (pedidoexiste.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("NO TIENES LAS CREDENCIALES ");
      }

      //ELIMINAR DE BD
      await Pedidos.findOneAndDelete({ _id: id });
      return "PEDIDO ELIMINADO";
    },
  },
};

module.exports = resolvers;
