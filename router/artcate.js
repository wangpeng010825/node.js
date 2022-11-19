let express=require('express')
let artcateHandler=require('../router-handler/artcate.js')
let router=express.Router()
router.get('/cates',artcateHandler.getArticleCates)
router.post('/addcates',artcateHandler.addArticleCates)
router.get('/deletecate/:id',artcateHandler.deleteCateById)
router.get('/cates/:id', artcateHandler.getArticleCateById)
router.post('/updatecate', artcateHandler.updateCateById)
module.exports=router