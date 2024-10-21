const mysql = require("mysql")
//é usada para criar um pool de conexões
//Um pool de conexões é um conjunto de conexões que podem ser reutilizadas, o que melhora a eficiência e o desempenho de aplicativos que fazem muitas consultas ao banco de dados.
//Ao usar um pool de conexões, o seu aplicativo pode gerenciar eficientemente o acesso ao banco de dados, evitando a sobrecarga de abrir e fechar conexões repetidamente. Isso é particularmente útil em ambientes de alta demanda, onde múltiplas requisições ao banco de dados podem ocorrer simultaneamente.
var pool = mysql.createPool({
    //limite de conexões simultaneas
    "connectionLimit":1000,
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
})
//O Promise objeto representa a eventual conclusão (ou falha) de uma operação assíncrona e seu valor resultante.
exports.execute  = (query,params = [])=>{
    return new Promise((resolve, reject) => {
                pool.query(query,params,(error,result,fields)=>{
                    if (error) {
                        reject(error)
                    }else{
                        resolve(result)
                    }
                })
    })
}
module.exports.pool = pool
