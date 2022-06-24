const express= require('express');

const { authorize,protect }= require('../middleware/user');
const Candidate= require('../controller/candidate')

const candidateRouter= express.Router();

candidateRouter.post("/createCandidate",protect,Candidate.createCandidate);
// authorize({permissionType:"WRITE",moduleName:"Candidate"} authorize({permissionType:"WRITE",moduleName:"Candidate"})
candidateRouter.post("/assignedcandidates",protect, Candidate.assignedCandidates);
// requirementRouter.post("/singleRequirement",protect, authorize({permissionType:"READ",moduleName:"Requirements"}),Requirement.SingleRequirementDetails);
candidateRouter.get("/listreqcandidates",protect, Candidate.listReqCandidates);


module.exports= candidateRouter