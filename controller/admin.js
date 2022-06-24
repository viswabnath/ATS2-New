const response= require('../utils/Response');
const User= require('../models/user');
const log= require('../utils/bunyanLogger')
const Role= require('../models/role')
const {convertToObjectID}= require('../utils/misc')



class AdminController{


    async getUsers(req,res,next){

        let query={}
         
         switch(req.query.approvalLevel){
             case '0':query={
                email:{
                    $ne:'jayrao@sellcraft.net'
                },
              }
              break;
          case '1':query={
            email:{
                $ne:'jayrao@sellcraft.net'
            },
            level1Verified:true,
            level2Verified:false
          }
             break;
          case '2': query={
            email:{
                $ne:'jayrao@sellcraft.net'
            },
            level1Verified:true,
            level2Verified:true
          }
             break;
          case '3': query={
            email:{
                $ne:'jayrao@sellcraft.net'
            },
            level1Verified:false,
            level2Verified:false
          }
             break;  
              
          
      }
    
      
        try {
            const user= await User.find(query).select(' -password -__v');
            response.successReponse({status:200,result:user,res})
        } catch (error) {
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
        }
    }
    async firstApproval(req,res,next){
         try {
             const user = await User.findOne({_id:req.body.id});
             if(!user){
                 throw new Error("User Not Found");
             }
             await User.updateOne({_id:user._id},{level1Verified:true});
             response.successReponse({status:200,result:'User Approved',res})
         } catch (error) {
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
         }
    }
    async secondApproval(req,res,next){
         try {
             const user = await User.findOne({_id:req.body.id});
             if(!user){
                 throw new Error("User Not Found");
             }
             await User.updateOne({_id:user._id},{level2Verified:true,level1Verified:true});
             response.successReponse({status:200,result:'User Approved',res})
         } catch (error) {
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
         }
    }
    async assignRoleToUser(req,res,next){
        try {
            
              const roleid= convertToObjectID(req.params.roleid)
              const role=await Role.findById(roleid) ;
              if(!role){
                  throw new Error("Role does not exist")
              }
              const userid=convertToObjectID(req.params.userid);
              const user = await User.findById(userid);
              if(!user){
                  throw new Error("User does not exist");
              }
              const updatedUser=await User.updateOne({_id:user._id},{
                  $addToSet:{
                      role:roleid
                  }
              },{new:true,runValidators:true})

             

            response.successReponse({status:200,result:'Role Assignment Complete',res})
        } catch (error) {
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
        }
    }
}

const adminController = new AdminController();
module.exports= adminController;