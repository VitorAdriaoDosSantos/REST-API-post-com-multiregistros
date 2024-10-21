const mysql = require("../mysql")

exports.getOrders = async(req,res,next)=>{

try {
    const result = await mysql.execute(`
    SELECT 
    orders.orderId,
    orders.quantity,
    products.productId,
    products.name,products.price
    FROM 
    orders INNER JOIN products ON products.productId = orders.productId`)

    const response = {
        Quantity:result.length,
        Orders: result.map( order=> {
            return {
                OrderId:order.orderId,
                Quantity:order.quantity,
                Product:{
                    id_produto: order.productId,
                    Name: order.name, 
                    Price:order.price
                },
                Request:{
                    Type:"get",
                    Description: "retorna um pedido",
                    Url:process.env.URL_API + "orders/" + order.orderId
                }
            }
        })
    }
    return res.status(200).send(response)
} catch (error) {
    return res.status(500).send({error:error})
}
    

}
exports.postOrder = async(req,res,next)=>{
    try {
       
        const queryProduct = 'SELECT * FROM products WHERE productId = ?';
        const resultProduct = await mysql.execute(queryProduct, [req.body.productId]);
        //verificar se existe o prodduto pedido no estoque
        if (resultProduct.length == 0) {
            return res.status(404).send({ message: 'Produto não encontrado'});
        }
        //se sim, ele inserir o pedido
        const result = await mysql.execute('INSERT INTO orders(productId,quantity) VALUES(?,?)',[req.body.productId, req.body.quantity])
        const response = {
            message: "Pedido inserido com sucesso",
            CreatedOrder:{
                OrderId: result.orderId,
                ProductId: req.body.productId,
                Quantity: req.body.quantity,
            
                Request:{
                    Type:"get",
                    Description: "retorna todos os pedidos",
                    Url:process.env.URL_API + "orders/"
                }
            }
        }
        return res.status(201).send(response)

    } catch (error) {
        return res.status(500).send({error:error})
    }
}
exports.getIdOrder = async (req,res,next)=>{

    try {
        const result = await mysql.execute("SELECT * FROM orders WHERE orderId = ?",[req.params.orderId])

        const response = {
                    
            Order:{
                OrderId: result[0].orderId,
                ProductId: result[0].productId,
                Quantity:  result[0].quantity,
                request:{
                    Type:"get",
                    Description: "Retorna todos os pedidos",
                    Url:process.env.URL_API + "pedidos/"
                }
            }
        }
        return res.status(202).send(response)
    } catch (error) {
        return res.status(500).send({error:error})
    }
}
exports.deleteOrder= async(req,res,next)=>{

try {
    await mysql.execute(`DELETE FROM orders WHERE orderId = ?`,
    [req.params.orderId ])

    const response ={
        message: "Pedido removido com sucesso",
        Request:{
            Tipy:"post",
            Description:"Inseri um pedido",
            Url:process.env.URL_API + "produtos",
            Body:{
                ProductId:"Number",
                Quantity:"Number"
            }
        }
    }
    return res.status(202).send(response)
} catch (error) {
    return res.status(500).send({error:error})
}   
}