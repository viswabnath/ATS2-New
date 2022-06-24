const log = require('../utils/bunyanLogger');
const User= require('../models/user');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken')
const {verifyemail}= require('../utils/mailcontent')
const response= require('../utils/Response')
const xlsx= require('read-excel-file/node');
const { convertToObjectID } = require('../utils/misc');
const Role= require('../models/role')

class UserClass{

    async UserSignUp(req,res,next){
        try {
         const input= req.body;
      
       
               const user= await User.findOne({email:input.email});
               if(user){
                   throw new Error("User with this email already exists")
               }
           
            if(input.password!==input.confirmpassword){
                throw new Error("Password and ConfirmPassword must match")
            }
            const emailVerifyCode= Math.floor(100000 + Math.random() * 900000);
            input.emailVerifyCode= emailVerifyCode;
            input.emailVerified=true
            const salt= await bcrypt.genSalt(10);
            input.password=  await bcrypt.hash(input.password,salt);
            const newUser=await User.create(input);
            log.info({module:"User"},newUser)
            // await verifyemail(input.email,emailVerifyCode);
            response.successReponse({status:201,result:newUser,res})
          
          
        } catch (error) {
            // next(error)
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
        }
    }

    async UserLogin(req,res,next){
        try {
            const {email,password}= req.body;
              if(!email ||!password){
                  throw new Error("Email or Password Not provided")
              }
              const user= await User.findOne({email});
              if(!user){
                  throw new Error(`User with email ${email} does not exist`)
              }
             
              if(!user.emailVerifed){
                    // await verifyemail(email,user._doc.emailVerifyCode);
                  throw new Error("Please verify your email.Verification code sent to your email")
              }
             
              if(!user.level1Verified){
                  throw new Error("Pending Approval from Admin. Please contact admin at support@sellcraft.net")
              }
              const comparePassword= await bcrypt.compare(password,user.password);
              if(!comparePassword){
                  throw new Error("Incorrect Password")
              }
              const token= jwt.sign({ id: user._id }, 
                process.env.sharedkey, 
                { expiresIn: process.env.tokenExpiry });
                const updatedUser= await User.findByIdAndUpdate({_id:user._id},
                    {token},
                    { new:true,runValidators:true,fields:{password:0,__v:0}})
                    .populate({path:'role',
                    populate:{
                        path:'permissions',
                        populate:{
                            path:'moduleTypes',
                            model:'Module',
                            select:' -__v'
                        },
                        model:"Permission",
                        select:" -__v"
                    },
                    select:' -__v'
                })
               
                response.successReponse({status:200,result:updatedUser,res})
        } catch (error) {
            // response.errorResponse({status:400,result:error.message,res,errors:error.stack})
            error.statusCode=400;
            next(error)
        }
    }
    async CreateBulk(req,res,next){
        try {
            if(!req.file){
                throw new Error("File not found")
            }
            const fileName= req.file.originalname;
            log.info({module:"FileUpload"},fileName.split('.')[1])

            const extension= fileName.split('.')[1];
             if(extension!=='xlsx'){
                 throw new Error("Please download the template and use ")
             }
           
            response.successReponse({status:200,result:'done',res})
            
        } catch (error) {
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
        }
    }
    async verifyEmail(req,res,next){
        try {
            const input= req.body;
            const user= await User.findOne({email:input.email});
            if(!user){
                throw new Error(`User with email ${input.email} does not exist`)
            };
             const code= user.emailVerifyCode;
             if(code!==input.code){
                    throw new Error("OTP mismatch try again")
             }
            await User.findByIdAndUpdate(user._id,{emailVerifed:true,emailVerifyCode:null},{new:true,runValidators:true});
            

            response.successReponse({status:200,result:"Email Verified",res})
        } catch (error) {
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
        }
    }
    async getUser(req,res,next){
        try {
            const id= convertToObjectID("614ad81616108a13e643fb0c")
            const user= await User.findById(id)
                              .select(' -__v  -password -emailVerifyCode')
                             .populate({path:'role',
                                    populate:{
                                        path:'permissions',
                                        populate:{
                                            path:'moduleTypes',
                                            model:'Module',
                                            select:' -__v'
                                        },
                                        model:"Permission",
                                        select:" -__v"
                                    },
                                    select:'-_id -__v'
                                })
           

            response.successReponse({status:200,result:user,res})
        } catch (error) {
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
        }
    }
    async getAM(req,res,next){
        try {
            const role= await Role.findOne({roleName:"Account Manager"});
             const id= role._id;
            const users=await User.find({role:id}).select('_id firstname lastname')
            response.successReponse({status:200,result:users,res})
            
        } catch (error) {
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
        }
}

async getListofIr(req,res,next){
    try{
        const irs = await User.find({roleApplied:"INTERNAL-RECRUITER"})
        response.successReponse({status:200,result:irs,res})
    } catch (error) {
            response.errorResponse({status:400,result:error.message,res,errors:error.stack})
        }
}

}



const userInstance= new UserClass();
module.exports= userInstance;