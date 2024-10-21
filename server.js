//criando o servidor
const http = require("http")
//biblioteca nativa para criar server
const app = require("./app")
const port = process.env.PORT || 3000

const server =  http.createServer(app)
server.listen(port)
 