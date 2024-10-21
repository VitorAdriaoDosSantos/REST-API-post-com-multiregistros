const express = require("express")
const router = express.Router()
const multer = require("multer")
const login = require("../middleware/login")
const productController = require("../controllers/product-controller")

//configurando o path da imagem e o nome do arquivo
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        //null seria o callback de erro
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
        let data = new Date().toISOString().replace(/:/g,'-')+'-'
        cb(null, data + file.originalname)
    }
})
//aceita somente imaagens png jpeg jpg
const filtro = (req,file,cb)=>{
    if(file.mimetype ==='image/jpeg'||file.mimetype ==='image/jpg'||file.mimetype ==='image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const upload = multer({
    storage:storage,
    limits:{
        // tamanho limite da imagem, 10mb
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: filtro
})
//METODOs HTTP
//MOSTRA TODOS OS PRODUTOS
router.get("/",productController.getProducts)
//INSERI UM PRODUTO
router.post("/",login.required, upload.single("ProdutoImagem"),productController.postProduct)
//RETORNA DADOS DE UM PRODUTO
router.get("/:productId",productController.idProduct)
//ALTERA UM PRODUTO
router.patch("/:productId",login.required, productController.UpdateProduct)
//DELETA UM PRODUTO
router.delete("/:productId",login.required, productController.deleteProduct)
//INSERIR VARIAS IMAGENS PARA UM PRODUTO
router.post("/:productId/image",login.required,upload.single("ProdutoImagem"), productController.postImagem)
router.get("/:productId/images",login.required, productController.getImagensProduto)

module.exports = router


