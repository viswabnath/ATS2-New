const mongoose= require('mongoose');

const clientSchema =  mongoose.Schema({

clientName:String,
location:String,
POCName:String,
POCNumber:String,
POCEmail:String,
AM:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
zone:{
    type:String,
    enum:["NORTH","SOUTH","EAST","WEST"]
}
    

});




module.exports = mongoose.model("Client", clientSchema);