const express = require('express');
const UserRouter= require('./user');
const ModuleRouter= require('./module');
const PermissionRouter= require('./permission')
const AdminRouter=require('./admin');
const roleRouter = require('./role');
const clientRouter=require('./client')
const requirementRouter= require('./requirements');
const candidateRouter= require('./candidate');
const skillRouter= require('./skill');
const locationRouter= require('./location');
const fileRouter= require('./fileUpload');

const router = express.Router();

router.use("/user",UserRouter);
router.use("/module",ModuleRouter)
router.use("/permission",PermissionRouter);
router.use("/admin",AdminRouter);
router.use('/role',roleRouter);
router.use("/client",clientRouter);
router.use("/requirement",requirementRouter);
router.use("/candidate",candidateRouter);
router.use("/skill",skillRouter);
router.use("/location",locationRouter);
router.use("/fileupload",fileRouter);





module.exports= router;