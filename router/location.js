const express= require('express');
const locationRouter= express.Router();
const locationController= require('../controller/location');

locationRouter.post('/createlocation',locationController.addLocation);
locationRouter.get('/getlocationss',locationController.viewLocations)


module.exports= locationRouter;