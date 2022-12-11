const socket = io();

//Defino constantes de formulario productos
const productNameInput = document.getElementById("productNameInput");
const productPriceInput = document.getElementById("productPriceInput");
const productThumbnailInput = document.getElementById("productThumbnailInput");
const productListPool = document.getElementById("productListPool");
const productsForm = document.getElementById("productsForm");

//Defino constantes de formulario mensajes
const mesaggesForm = document.getElementById("mesaggesForm");
const inputEmail = document.getElementById("inputEmail");
const inputMesagge = document.getElementById("inputMesagge");
const mesaggesPool = document.getElementById("mesaggesPool");

//Defino la funcion q manda los products
const sendProduct = (productInfo) => {
  //Emito el evento "client:product" para mandar la info del product nuevo al back a traves de socket
  socket.emit("client:product", productInfo);
};

//Defino la funcion q manda los mensajes
const sendMessage = (messageInfo) => {
  socket.emit("client:message", messageInfo);
};

//Defino funcion q renderiza productos
const renderProduct = (productData) => {
  const html = productData.map((productInfo) => {
    return `
                <tr >
                    <td>${productInfo.name}</td>
                    <td>$${productInfo.price}</td>
                    <td><img src="${productInfo.thumbnail}" alt="${productInfo.thumbnail}" width="100px" height="100px"></td>
                </tr>    
        `;
  });

  console.log("Arreglo de string de productos", html);

  productListPool.innerHTML = html.join("");
};

// Defino la funcion q renderiza los mensajes
const renderMesagge = (messageData) => {
  let date = new Date();
  let dateOficial = date.toLocaleString();

  const html = messageData.map((messageInfo) => {
    return `
              <div class="d-flex justify-content-center ">
                <p class="m-1" style="color: blue;"> ${messageInfo.email}</p> 
                <span class="m-1" style="color: brown;">[${dateOficial}]:</span> 
                <span class="m-1" style="color: green; font-style: italic;">${messageInfo.message}</span>
              </div>

              `;
  });
  mesaggesPool.innerHTML = html.join("");
};

// Defino la funcion submit handler, se ejecuta cuando dispara el evento submit del form
const submitHandler = (event) => {
  //Ejecutamos la funcion preventDefault() para evitar que se recargue la pagina
  event.preventDefault();

  // Definimos la informacion del producto, es un obejto con una propiedad "name" , "price" y "thumbnail"
  const productInfo = {
    name: productNameInput.value,
    price: productPriceInput.value,
    thumbnail: productThumbnailInput.value,
  };

  sendProduct(productInfo);

  //Vaciamos los inputs para q quede libre para escribir otro producto
  productNameInput.value = "";
  productPriceInput.value = "";
  productThumbnailInput.value = "";
};

//Defino la funcion submit handler de messagges
const submitHandlerMessages = (event) => {
  event.preventDefault();
  const messageInfo = {
    email: inputEmail.value,
    message: inputMesagge.value,
  };

  sendMessage(messageInfo);

  //Vaciamos los inputs para q quede libre para escribir otro producto
  inputEmail.value = "";
  inputMesagge.value = "";
};

//le genero un evento al form para q registre cuando tocamos en enviar y ejecute la funcion submitHandler
productsForm.addEventListener("submit", submitHandler);

//le genero un evento al form para q registre cuando tocamos en enviar y ejecute la funcion submitHandler
mesaggesForm.addEventListener("submit", submitHandlerMessages);

//Renderizamos los prodcuts
socket.on("server:product", renderProduct);

//Renderizamos los messages
socket.on("server:message", renderMesagge);
