const mongoose= require('mongoose');

const permissionSchema =  mongoose.Schema({


    moduleTypes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Module',
    }
     
    ],
    

permissionName:String,
permissionType:{
    type:String,
    enum:['READ','WRITE','DELETE'],
    default:'READ'
}


});




module.exports = mongoose.model("Permission", permissionSchema);