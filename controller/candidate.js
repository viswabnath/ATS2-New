
const Candidate= require('../models/candidate');
const log = require('../utils/bunyanLogger');
const response = require('../utils/Response');
const Requirements= require('../models/requirements');
const { convertToObjectID } = require('../utils/misc');
class CandidateClass{

    async createCandidate(req,res,next){
        try {
           const requirementid= await Requirements.findById(convertToObjectID(req.body.RequirementId))
           if(!requirementid){
               throw new Error("Requirement does not exist")
           }
           const existingCandidate= await Candidate.findOne({pannumber:req.body.pannumber, candidateemail:req.body.candidateemail});
   
           if(existingCandidate){
            throw new Error("Candidate details already exists")
           }
            const candidate= await Candidate.create(req.body)

            response.successReponse({status:201,result:candidate,res})
        } catch (error) {
            error.statusCode=400;
            next(error)
        }
    }
  
    async assignedCandidates(req,res,next){
     try{
        const listcandidates = await Candidate.find({RequirementId:req.body.RequirementId})
        if(!listcandidates){
            throw new Error("No Candidates available")
        }
        response.successReponse({status:200,result:listcandidates,res})

     } catch (error) {
        error.statusCode=400;
        next(error)
    }
    }

    //get suitable candidates for specific req's

    async listReqCandidates(req,res,next){
        try{
            const requirementid= await Requirements.findById(convertToObjectID(req.body.reqid))
            if(!requirementid){
                throw new Error("Requirement does not exist")
            }
            const Candidates = await Candidate.find({candidateskills:{ $all : requirementid.Skills }})
            response.successReponse({status:200,result:Candidates, res})
        } catch (error) {
        error.statusCode=400;
        next(error)
    }
    }
    

}

const candidateInstance= new CandidateClass();
module.exports= candidateInstance