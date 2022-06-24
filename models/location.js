const mongoose= require('mongoose');

const locationSchema=mongoose.Schema({
    locationname:String,
})

module.exports = mongoose.model('Locations',locationSchema);