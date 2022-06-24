
const Requirements= require('../models/requirements');
const log = require('../utils/bunyanLogger');
const response = require('../utils/Response');
const Client= require('../models/client');
const { convertToObjectID } = require('../utils/misc');
const req = require('express/lib/request');
class RequirementClass{

    async createRequirement(req,res,next){
        try {
           
           const client= await Client.findById(convertToObjectID(req.body.ClientId))
           if(!client){
               throw new Error("Client does not exist")
           }
           const existingRequirement= await Requirements.find();
   
           
           if(existingRequirement.length===0){
               req.body.InternalJobCode="SELL-1";
           }else{
               
               req.body.InternalJobCode=`SELL-${+existingRequirement.reverse()[0].InternalJobCode.split("-")[1]+1}`
           }
           req.body.AssignedAM=client.AM;
           const date= new Date();
           req.body.CreatedDate= `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
            const requirement= await Requirements.create(req.body)

            response.successReponse({status:201,result:requirement,res})
        } catch (error) {
            error.statusCode=400;
            next(error)
        }
    }
    async listRequirement(req,res,next){
        try {
            // const pageNo = +req.query.pageNo || 0;
            // const itemsPerPage = +req.query.itemsPerPage || 10;
            let requirements,count;
            if(req.query.name){
                 requirements=await Requirements.find({RequirementName:req.query.name}).populate("ClientId","-_id -AM -__v")
                 count=await Requirements.countDocuments({RequirementName:req.query.name})
            }else{

                 requirements= await Requirements.find().populate("ClientId","-_id -AM -__v")
                  count= await Requirements.countDocuments();
            }
           
            response.successReponse({status:200,result:{count,requirements},res})
        } catch (error) {
            error.statusCode=400;
            next(error)
        }
        }

        async SingleRequirementDetails(req,res,next){
            const reqid = req.body.id
            console.log(reqid)
            try {
            const singlereq = await Requirements.findById(reqid)
            if(!singlereq){
                throw new Error("Requirement not found!")
            }
                response.successReponse({status:200,result:singlereq,res})
            } catch (error) {
                error.statusCode=400;
                next(error)
            }
            }
            
        // async SingleRequDetails(req,res,next){
        //     const reqid = req.body.id
        //     try {
        //     const singlereq = await Requirements.findById(reqid)
        //     if(!singlereq){
        //         throw new Error("Requirement not found!")
        //     }
        //         response.successReponse({status:200,result:singlereq,res})
        //     } catch (error) {
        //         error.statusCode=400;
        //         next(error)
        //     }
        //     }

   async changeRequirementStatus(req,res,next){
       try {
           
       } catch (error) {
           
       }

   }

// -- token based access to req's and am's working  (to be done based on role of the authlogedin and if-conditions to be added to display list of req's)
   async reqonjwtreqs(req,res,next){
    let tokenreqid=convertToObjectID("617fae90c4382d07246e6b1e")
    let requirements
    try{
        requirements= await Requirements.find({AssignedIA:tokenreqid} ).populate("ClientId","-_id -AM -__v")
        response.successReponse({status:200,result:{requirements},res})
    }catch (error) {
        error.statusCode=400;
        next(error)
    }

   }
    

// -- asign functionality working
   async AssignIAtoReq(req,res,next){
       let reqid , amid
       reqid = req.body.reqid;
       amid = convertToObjectID(req.body.amid);
       try{
           const checkreqid = await Requirements.findById(reqid)
           if(!checkreqid){
            throw new Error("Requirement  not found!")
           }
           const checkamid = await Requirements.findOne({AssignedAM:amid})
           if(!checkamid){
            throw new Error("Not an authorized AM!")
           }

          await Requirements.findByIdAndUpdate(reqid,{AssignedIA:req.body.AssignedIA});
          response.successReponse({status:201,result:"Updated",res})
       }catch (error) {
        error.statusCode=400;
        next(error)
    }
   }

}

const requirementInstance= new RequirementClass();
module.exports= requirementInstance