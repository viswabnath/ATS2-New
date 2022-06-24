// const aws = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const uuid = require('uuid').v4;
// const Candidate= require('../models/candidate');
// const response = require('../utils/Response');

// const path = require('path');
// const express = require('express');


// const s3= new aws.S3({
//     accessKeyId:process.env.AWSHemanthID,
//     secretAccessKey:process.env.AWSHemanthKey
// });


// var unique;
// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'hemanth-upload',
//         metadata: (req,file, cb)=>{
//             cb(null,{fieldName: file.fieldname});
//         },
//         key:(req, file, cb) =>{
//             const ext = file.originalname;
//             unique = uuid();
//             cb(null, `${unique}-${ext}`);
//             console.log(unique);
//         },
//     })
// });



// const router = express.Router();


// router.post("/uploads",upload.array('file'),(req,res,next)=>{
//     console.log(req.body);
// });

// module.exports = router;














// const s3 = new aws.S3({apiVersion: '2006-03-01'});

// const storage = multer.diskStorage({
//     destination:(req,file,cb) =>{
//         cb(null,'uploads');
//     },
//     filename:(req,file,cb)=>{
//         const { originalname }=file;
//         cb(null, `${uuid()}-${originalname}`);
//     }
// });

// const upload = multer({storage});