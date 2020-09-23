const cursos = [
  {
    titulo: "JavaScript Moderno Guía Definitiva Construye +10 Proyectos",
    tecnologia: "JavaScript ES6",
  },
  {
    titulo: "React – La Guía Completa: Hooks Context Redux MERN +15 Apps",
    tecnologia: "React",
  },
  {
    titulo: "Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s",
    tecnologia: "Node.js",
  },
  {
    titulo: "ReactJS Avanzado – FullStack React GraphQL y Apollo",
    tecnologia: "React",
  },
];

//RESOLVRES........................son funciones de reultados buscados en schema

const resolvers = {
  Query: {
    //Llama a Query el qur tiene el tipo de datos
    obtenerCursos: (_, { input }, ctx) => {
      // devuelve el valor y guarda en obtenerCursos lo que tiene en cursos
      const resultado = cursos.filter(
        (curso) => curso.tecnologia === input.tecnologia //en cursos buscamos de uno en uno,tecnologias y comparamos con input (entrada tecnologia)
      );
      return resultado;
    },
  },
};

module.exports = resolvers;
