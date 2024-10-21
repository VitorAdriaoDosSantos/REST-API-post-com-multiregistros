const mysql = require("../mysql")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


exports.createUser = async(req,res,next)=>{
    try {
            let users2 = req.body.users
            const lista = []
            for (let i = users2.length - 1; i >= 0; i--) {
                const query = "SELECT * FROM users WHERE email = ?"
                console.log(users2[i].email)
                let result = await mysql.execute(query,users2[i].email )

                if (result.length > 0) {
                    users2.splice(i,1)
                    lista.push({message:`usuario ${[i]} ja cadastrado (removida)`})
                }
                else{
                    lista.push({message:`usuario ${[i]} cadastrado`})
                }
              }

            
            if(users2.length>0){
                //const usersfiltrado um arrays de objetos
                const usersfiltrado =  users2.map(user =>[
                user.email,             
                bcrypt.hashSync(user.password, 10)
                ])

                query = "INSERT INTO users (email,password) VALUES ?"
                result = await mysql.execute(query,[usersfiltrado])

                const response = {
                message:"usuarios criados com sucesso",
                CreatedUsers:usersfiltrado.map(user=> {
                    return {email:user[0]}
                }),
                listadeusuarios: lista
            }
            return res.status(201).send(response)
            }

            else{
                //No JavaScript, quando você tenta concatenar um objeto com uma string, 
                //o objeto é convertido para uma string, e o resultado é "[object Object]".
            return res.status(201).send({message:"nenhum usuario disponivel para o cadastro",listadeusuarios: lista})
            }
    } catch (error) {
            return res.status(500).send({error:error})
    } 
}
exports.login = async(req,res,next)=>{

    try {
        const query = "SELECT * FROM users  WHERE  email = ?"
        var result = await mysql.execute(query,[req.body.email])

        if(result.length<1){
            return res.status(401).send({
                mensagem:"falha na autenticação"
            })
        }

        if(await bcrypt.compareSync(req.body.password,result[0].password)){
                  
            const token = jwt.sign({
                id_usuario:result[0].id_usuario,
                email:result[0].email
            },
            process.env.JWT_KEY,
            {
                expiresIn:"1h"
            })
            return res.status(200).send({
                mensagem:"Autenticado com Sucesso",
                token:token
        })
        }

        return res.status(401).send({mensagem:"falha na autenticação"})
        
    } catch (error) {
        return res.status(500).send({ mensagem:"falha na autenticação"})
    }

}