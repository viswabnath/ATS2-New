const mongoose= require('mongoose');

const moduleschema = mongoose.Schema({

moduleName:{
    type:String,
    unique:true
}

});




module.exports = mongoose.model("Module", moduleschema);