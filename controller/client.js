const ClientModel= require("../models/client");
const user = require("../models/user");
const log = require("../utils/bunyanLogger");
const response = require('../utils/Response');
const { convertToObjectID } = require('../utils/misc');

class Client{
    constructor(){

    }

    async createClient(req,res,next){
        try {
            log.info(req.body.AM)
            const employee= await user.findById(convertToObjectID(req.body.AM))
            const Client= await ClientModel.findOne({clientName:req.body.clientName,location:req.body.location})
               log.info(employee)
            if(!employee|| employee.roleApplied!=="MANAGER" || employee.roleApplied!=="ADMIN"){
                throw new Error("AM not found")
            }
              if(Client){
                  throw new Error("Client Already exists")
              }
            
            req.body.AM= employee._id
             const newClient= await ClientModel.create(req.body);
             response.successReponse({ status: 200, result: newClient, res })
            
        } catch (error) {
            response.errorResponse({
                status: 400,
                result: error.message,
                res, errors: error.stack
            })
        }
    }
    async listClient(req,res,next){
        try {
            const clientList= await ClientModel.find().populate('AM','_id email firstname lastname')
            response.successReponse({ status: 200, result: clientList, res })
           
       } catch (error) {
           response.errorResponse({
               status: 400,
               result: error.message,
               res, errors: error.stack
           })
        }
        

    }

    async listsclient(req,res,next){
        try {
            const clientList= await ClientModel.find()
            response.successReponse({ status: 200, result: clientList, res })
           
       } catch (error) {
           response.errorResponse({
               status: 400,
               result: error.message,
               res, errors: error.stack
           })
        }
        
    }



    async updateClient(req,res,next){
        try {
            const {name}= req.body;
            const file= req.file;
                if(!req.file){
                throw new Error("Please upload a file")
            }
            const fileUpload= require('../utils/awsupload')
           const result=await fileUpload(file,process.env.AWS_CV_BUCKET);
                   
          
            response.successReponse({ status: 200, result: "Done", res })
            
        } catch (error) {
            response.errorResponse({
                status: 400,
                result: error.message,
                res, errors: error.stack
            })
        }
            
        }
    }



const clientInstance = new Client();
module.exports = clientInstance;