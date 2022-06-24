const User= require('../models/user')
const jwt = require('jsonwebtoken');
const response = require('../utils/Response');
const log = require('../utils/bunyanLogger');
const Permission= require('../models/permissions');
const Roles= require('../models/role');
const { convertToObjectID } = require('../utils/misc');
const { populate } = require('../models/user');




async function protect(req, res, next,) {

    try {
        let auth_token;
        

        if (req.headers.authorization === "" || req.headers.authorization === undefined || req.headers.authorization === null) {
            throw new Error("Not authorised")

        }
        if (req.headers.authorization.startsWith("Bearer")) {

            auth_token = req.headers.authorization.split(" ")

            auth_token = auth_token[1] || auth_token[2]

        } else {

            auth_token = req.headers.authorization;
        }


        const tokenVerify = await jwt.verify(auth_token, process.env.sharedkey);
        
        if (tokenVerify.id) {
            req.user = await User.findById(tokenVerify.id)

        }
        if (!req.user.token) {
            throw new Error("Please relogin")
        }



        next();

    } catch (error) {
       
        error.statusCode=403
        next(error);

        // return response.errorResponse({ status: 400, errors: error.stack, result: error.message, res })
    }
}
function authorize(roles) {
   
    return async (req, res, next) => {
       
        try {
            const arr1= req.user.role;
           const arr2=[]
           await Promise.all(arr1.map(async item=>{
               const roleId= convertToObjectID(item);
               const role=  await Roles.findById(roleId).populate({
                   path:'permissions',
                   populate:{
                       path:'moduleTypes',
                       model:"Module",
                       select:'-__v'
                   },
                   model:'Permission',
                   select:'-__v'
               })
               arr2.push(role)
           }))
       
        let arr3=[],arr4=[]
           arr2.map(item=>{
              const permissions=item.permissions;
                const filteredPermissions=permissions.filter(item=>item.permissionType===roles.permissionType)
                   arr3.push(filteredPermissions[0]);
        });
         if(arr3.length===0){
             throw new Error("Not Authorised to access resource")
         }
      
        
          arr3.forEach(item=>{
              const res= item.moduleTypes;
              res.forEach(item1=>{
                     arr4.push(item1.moduleName)
              })
               arr4.push(item.moduleTypes)
          });
         arr4= arr4.filter(item=>item===roles.moduleName);
          if(arr4.length===0){
            throw new Error("Not Authorised to access resource")
        }
       
          
             next();
           
        }
        
    
    
        catch (error) {
            error.statusCode=403
        next(error);
            // return response.errorResponse({ status: 400, errors: error.stack, result: error.message, res })
        }

    }


}


module.exports = { protect, authorize }