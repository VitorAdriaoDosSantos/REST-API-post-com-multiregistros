const mysql = require("../mysql")

exports.getCategories = async(req,res,next)=>{
    try {
     const result = await mysql.execute("SELECT * FROM categories")

        const response = {
            quantity:result.length,
           Categories: result.map( category=> {
                 return {
                    category:category.category,
                    name: category.name,
            }
        })
    }
        return res.status(200).send(response) 
} catch (error) {
        return res.status(500).send({error:error})
}

}
exports.postCategory = async(req,res,next)=>{
    console.log(req.file)
    try {
        const result = await mysql.execute( 
        "INSERT INTO CATEGORIES (name) VALUES(?)",[req.body.name,])

        const response = {
            Message: "Categoria inserida com Sucesso",
            CreatedCategory:{
                categoryId: result.insertId,
                Name: req.body.name,
                Request:{
                    Type:"get",
                    Description: "retorna todas as categoris",
                    Url:process.env.URL_API + "categories/"+ result.insertId
                }
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send({error:error})
    }
   
}