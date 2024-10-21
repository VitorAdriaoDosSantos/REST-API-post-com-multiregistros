
const mysql = require("../mysql")

exports.getProducts = async(req,res,next)=>{
    try {

        // é opcional que depois de colocar a categoria ele adicione o nome na query
        // portanto ela inicia vazia
        let name = ""
        if (req.query.name){
            name = req.query.name
        }

        const query = `
        SELECT * 
        FROM products
        WHERE categoryId = ? 
        AND name LIKE "%${name}%"
        `
        //metodo Filtro com query string. Ao invez de passar o ID pela rota usando :id, passamos pela url, permitindo que você use essas informações no backend pela URL
        // Esses valores são enviados na URL e podem ser acessados ​​no backend para personalizar a resposta.
     const result = await mysql.execute(query,[req.query.categoryId])

        const response = {
            quantity:result.length,
            products: result.map( prod=> {
                 return {
                    ProductId:prod.productId,
                    Name: prod.name,
                    Price:prod.price,
                    ProductImage: prod.productImage,
                    Request:{
                        Type:"GET",
                        Description: "retorna de um produto",
                        Url:process.env.URL_API + "produtos/" + prod.productId
                }
            }
        })
    }
        return res.status(200).send(response) 
} catch (error) {
        return res.status(500).send({error:error})
}

}
exports.postProduct = async(req,res,next)=>{
    console.log(req.file)
    try {
        const result = await mysql.execute( 
        "INSERT INTO PRODUCTS (name,price,productImage,categoryId) VALUES(?,?,?,?)",
        [req.body.name,
        req.body.price,
        req.file.path,
        req.body.categoryId])

        const response = {
            Message: "Produto inserido com Sucesso",
            ProductCreated:{
                productId: result.insertId,
                Name: req.body.name,
                Preco: req.body.price,
                ProductImage:req.file.path,
                categoryId: req.body.categoryId,
                Request:{
                    Type:"get",
                    Description: "retorna todos os produtos",
                    Url:process.env.URL_API + "produtos/"+ result.insertId
                }
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send({error:error})
    }
   
}
exports.idProduct = async(req,res,next)=>{

try {
    const result = await mysql.execute(
        "SELECT * FROM products WHERE productId = ?",
        [req.params.productId]
        )
        const response = {  
            ProductSelected:{
                ProductId: result[0].productId,
                Name: result[0].name,
                Price: result[0].price,
                ProductImage: result[0].productImage,
                Request:{
                    Type:"get",
                    Description: "Retorna todos os produto",
                    Url:process.env.URL_API + "produtos/"
                }
            }
        }
        return res.status(200).send(response)

} catch (error) {
    if(error){return res.status(500).send({error:error})}
}
   
}
exports.UpdateProduct = async(req,res,next)=>{

    try {
      await mysql.execute(`UPDATE products 
        SET name = ?, 
        price = ? 
        WHERE 
        productId = ?`,

        [
        req.body.name,
        req.body.price, 
        req.params.productId
    ])

    const response = {
        Message: "Produto atualizado com sucesso",
        UpdateProduct:{
            ProductId: parseInt(req.params.productId),
            Name: req.body.name,
            Price: req.body.price,
            Request:{
                Type:"get",
                Description: "retorna de um produto",
                Url:process.env.URL_API + "produtos/" + req.params.productId
            }
        }
    }
    return res.status(202).send(response)

    } catch (error) {
        return res.status(500).send({error:error})
    }
   

}
exports.deleteProduct = async(req,res,next)=>{
    try {
        await mysql.execute(
        `DELETE FROM products WHERE productId = ?`,
        [req.params.productId])

    const response ={
        message: "Produto removido com sucesso",
        Request:{
            Type:"post",
            Description:"Inseri um produto",
            Url:process.env.URL_API + "produtos",
            Body:{
                name:"String",
                price:"Number"
            }

        }
    }
    return res.status(202).send(response)

} catch (error) {
    return res.status(500).send({error:error})
}
   
}
exports.postImagem = async(req,res,next)=>{
    
    try {
        const result = await mysql.execute( 
        "INSERT INTO productImages (productId,patch) VALUES(?,?)",
        [req.params.productId,req.file.path])
        
        const response = {
            Message: "imagem inserida com sucesso",
            CreatedImage:{
                ProductId: parseInt(req.params.productId) ,
                ImageId: result.insertId,
                ImagemProduct:process.env.URL_API+ req.file.path,

                Request:{
                    Type:"get",
                    Description: "retorna todos as imagens",
                    Url:process.env.URL_API + "produtos/"  + req.params.productId +"/imagens"
                }
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send({error:error})
    }
   
}
exports.getImagensProduto = async(req,res,next)=>{
    try {
     const result = await mysql.execute("SELECT * FROM productImages WHERE productId = ?",[req.params.productId])

        const response = {
            quantity:result.length,
            Images: result.map( img=> {
                 return {
                    ProductId: img.productId,
                    ImageId: img.imageId,
                    Path: process.env.URL_API + img.patch,
                    Url:process.env.URL_API + "produtos/",
            }
        })
    }
        return res.status(200).send(response) 
} catch (error) {
        return res.status(500).send({error:error})
}
    
    
}