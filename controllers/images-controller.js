const mysql = require("../mysql")

exports.deleteImage = async(req,res,next)=>{
    try {
        await mysql.execute(
        `DELETE FROM productImages WHERE imageId = ?`,
        [req.params.imageId])

    const response ={
        message: "imagem removida com sucesso",
        Request:{
            Type:"post",
            Description:"Inseri um produto",
            Url:process.env.URL_API + "products/"+ req.body.productId +"/images",
            Body:{
                ProductId:"Number",
                ImageId:"File"
            }

        }
    }
    return res.status(202).send(response)

} catch (error) {
    return res.status(500).send({error:error})
}
   
}