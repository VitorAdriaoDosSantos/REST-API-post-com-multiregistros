const express =  require("express")
const app = express()
const morgan = require("morgan")
const bodyParser = require("body-parser")
const productsRoute = require("./routes/products-route")
const categoriesRoute = require("./routes/category-route")
const ordersRoute = require("./routes/orders-route")
const usersRoute = require("./routes/users-route")
const routerImages = require("./routes/images-route")

app.use(bodyParser.urlencoded({extended: false})) // apenas dados simples
app.use(bodyParser.json()) // so vai aceitar formatos json de entrada
app.use(morgan("dev"))//monitora nosso ambiente mostra as rotas e verbos acessado e o status 
//nosso diretorio uploads esta disponivel publicamente 
const path = require('path');
//app.use("/uploads", express.static("uploads"))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//CORS
//configura que tipos de dados podem ser acessados da ming API
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization")

        if(req.method === "OPTIONS"){
            res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET")
            return res.status(200).send({})
        }

        next()
})
app.use("/products", productsRoute)
app.use("/categories", categoriesRoute)
app.use("/orders", ordersRoute)
app.use("/users", usersRoute)
app.use("/images", routerImages)

//rotas nao encontrada
app.use((req,res,next)=>{
    const error = new Error("Não encontrado")
    error.status = 404
    next(error)
})
app.use((error, req,res,next)=>{
    res.status(error.status || 500)
    return res.send({
        erro :{
            mensagem:error.message
        }
    })
})
module.exports = app;