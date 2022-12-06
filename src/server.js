import express, { json, urlencoded } from "express";
import fs from "fs";
import routes from "./routes/index.js";
//importo socket
import { Server as IOServer } from "socket.io";
//dirname
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const products = [];
const messages = [];

const expressServer = app.listen(8080, () => {
  console.log("Server listening on por 8080");
});

const io = new IOServer(expressServer);

//app use
app.use(express.json());
app.use(urlencoded({ extended: true })); // middlewares
app.use(express.static(__dirname + "/public"));
app.use("/", routes);

// lo definimos SEteamos HBS
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: join(__dirname, "/views/layout/main.hbs"),
    layoutsDir: join(__dirname, "/views/layout"),
    partialsDir: join(__dirname, "/views/partials"),
  })
);

app.set("view engine", "hbs"); // se lo damos a express para q lo peuda setear
app.set("views", join(__dirname + "/views"));

io.on("connection", (socket) => {
  console.log(`New connection, socket ID: ${socket.id}`);

  // Cuando se conecta un nuevo cliente le emitimos a ese cliente todos los productos que se mandaron hasta el momento
  socket.emit("server:product", products);

  // Nos ponesmo a escuchar el evento "client:product" que recibe la info de un producto
  socket.on("client:product", (productInfo) => {
    //Actualizamos el arreglo de productos
    products.push(productInfo);
    fs.writeFileSync("./src/public/products.txt", JSON.stringify(products));
    console.log("Archivo creado");
    //Emitimos a TODOS los sockets conectados el arreglo de productos actualizados
    io.emit("server:product", products);
  });

  // MESSAGES
  socket.emit("server:message", messages);

  socket.on("client:message", (messageInfo) => {
    messages.push(messageInfo);

    fs.writeFileSync("./src/public/messages.txt", JSON.stringify(messages));
    console.log("Archivo creado");

    io.emit("server:message", messages);
  });
});
