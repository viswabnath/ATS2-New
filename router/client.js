const express= require('express');
const clientRouter= express.Router();
const clientController= require('../controller/client')
const multer= require('multer');
const upload= multer({dest: 'uploads/'});
clientRouter.post("/",clientController.createClient);
clientRouter.get("/",clientController.listClient);
clientRouter.get("/list",clientController.listsclient);
clientRouter.put("/", upload.single('cv'),clientController.updateClient);

module.exports=clientRouter