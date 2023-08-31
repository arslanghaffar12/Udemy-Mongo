const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");

const employee = require("./routes/employeRoute")



dotenv.config({ path: "./config.env" })

const path = require("path")

mongoose.connect(process.env.database_local, {
   
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(employee)

const port = process.env.port;
app.listen(port, () => {
    console.log("server is started")
})