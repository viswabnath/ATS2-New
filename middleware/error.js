const response= require('../utils/Response')


const errorHandler = (err, req, res, next) => {
  let error = { ...err };
        
  error.message = err.message;
  console.log(error)
  // Log to console for dev
  // console.log(err.code,err.name);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
   return response.errorResponse({status:400,result:message,errors:err.stack,res})
  }
  //Token Expired Error
  if(err.name==="TokenExpiredError"){
    const message=" Session Expired Please Relogin...";
    return response.errorResponse({status:403,result:message,errors:err.stack,res})
  }
  

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate Entry. Please recheck...';
      return response.errorResponse({status:400,result:message,errors:err.stack,res})
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
     return response.errorResponse({status:400,result:message,errors:err.stack,res})
  }

//   res.status(error.statusCode || 500).json({
//     success: false,
//     error: error.message || 'Server Error'
//   });
response.errorResponse({status:error.statusCode || 500,result:error.message||'Server Error',errors:err.stack,res})
};

module.exports = errorHandler;