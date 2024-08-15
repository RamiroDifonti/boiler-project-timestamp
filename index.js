// variables de entorno
require("dotenv").config();

// express
var express = require("express");
var app = express();

// asi la api se puede testear remotamente
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));


app.get("/api/:date?", (req,res) => {
  let input = req.params.date;

  // Primero comprobamos si la fecha pasda es una fecha valida
  // validas : 2024-01-13
  // invalidas: 2002-100-13, 513513513, ...
  // Si es invalida devuelve un NaN
  let isValidDate = Date.parse(input); 

  // Comprobamos si se le ha pasado un numero de milisegundos, sin letras, ni caracteres
  let isValidNumber = /^[0-9]+$/.test(input);
  let isEmpty = (input == "" || input == null);
  let unix_output = 0;
  let utc_output  = "";
  if (isValidDate) {
    unix_output = new Date(input);
    utc_output = unix_output.toUTCString();
  } else if(isValidNumber) {
    unix_output = parseInt(input);
    utc_output = new Date(unix_output).toUTCString();
  } else if(isEmpty) {
    unix_output = new Date();
    utc_output = unix_output.toUTCString();
  } else {
    return res.json({error: "Invalid Date"});
  }
  return res.json({unix: unix_output.valueOf(), utc: utc_output});  
});


app.get('/', (req, res) => {
  var absolute_path = __dirname + '/views/index.html';
  res.sendFile(absolute_path);
});




// ESCUCHAR DESDE EL PUERTO DE LA VARIABLE DE ENTORNO O 3000 DE DEFAULT
var listener = app.listen(process.env.PORT || 3000, '0.0.0.0', function() {
  console.log('La app esta funcionando en el puerto ' + listener.address().port)
});