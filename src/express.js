/* eslint-disable no-undef */
const Contenedor = require("./class.js");

const objetoContenedor = new Contenedor("productos.json");

const express = require("express"); // Import express
const app = express(); // Server app
const router = express.Router();
const handlebars = require("express-handlebars"); // Import handlebars module

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "/views/layouts/index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.set("views", "/views"); // Establezco directorio donde se encuentran los archivos
app.set("view engine", "hbs"); // Motor template

app.use(express.json()); // Transform to json
app.use(
  express.urlencoded({ extended: true }) // Receives a parameter for the body
);

app.use(express.static("public")); // Static file folder

app.use("/api/productos", router); // Router

app.get("/test", (req, res) => {
  res.render("main", {
    data,
    exist: true
  });  
  //res.sendFile(__dirName + "./public/index.html");
});

// app.get("/front", (req, res) => {
//   res.sendFile(__dirName + "./public/index.html");
// });

app.get("/", (req, res) => {
  res.send("Servidor Express");
});

// Api paths products
router.get("/", async (req, res) => {
  const lista = await objetoContenedor.getAll();
  res.status(200).send(lista);
});

// Filter id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const productoById = await objetoContenedor.getById(id);
  try {
    if (productoById) {
      res.status(200).send(productoById);
    } else {
      res.status(400).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Random product
app.get("/api/productoRandom", async (req, res) => {
  let arrayProducts = await objetoContenedor.getAll();
  let max = arrayProducts.length;
  let randomId = Math.floor(Math.random() * max);
  let randomProduct = arrayProducts[randomId];
  res.send(randomProduct);
});

// Add product
router.post("/", async (req, res) => {
  const { body } = req;
  await objetoContenedor.save(body);
  res.status(200).send(body);
});

// Update product
router.put("/:id", async (req, res) => {
  //Desestructuración
  const {
    body,
    params: { id },
  } = req;
  const anterior = await objetoContenedor.getById(id);
  const nuevo = await objetoContenedor.updateById(id, body);

  if (anterior) {
    res.status(200).send({ anterior, nuevo });
  } else {
    res.status(400).json({ error: "Producto no encontrado" });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const borrado = await objetoContenedor.deleteById(id);

  if (borrado) {
    console.log("Producto borrado", borrado);
    res.status(200).send({ borrado });
  } else {
    res
      .status(400)
      .json({ error: "El producto que se intenta borrar no existe." });
  }
});

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(
    `Servidor express corriendo en el puerto http://localhost:${PORT}`
  );
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));






const data = [
  {
    nombre: "Nombre 1",
    estilo: "estilo1"
  },
  {
    nombre: "Nombre 2",
    estilo: "estilo2"
  },
  {
    nombre: "Nombre 3",
    estilo: "estilo3"
  },
];