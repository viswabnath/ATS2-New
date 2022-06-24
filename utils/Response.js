const log = require('./bunyanLogger');
class Response {

    constructor() {

        if(!Response.instance){
            Response.instance=this;
        }
        this.response = {
            status: "",
            message: "",
            result: "",
            errors: ""

        }
        this.successReponse = this.successReponse.bind(this);
        this.errorResponse = this.errorResponse.bind(this)
        return Response.instance;

    }
    errorResponse(params) {
        this.response.message = "Failure",
        this.response.status = params.status;
        this.response.result = params.result
        this.response.errors = params.errors;
        const res = params.res;
        
        return res.status(200).json(this.response)
    }
    successReponse(params) {

        delete this.response.errors
        this.response.message = "Success",
            this.response.status = params.status;
        this.response.result = params.result
        const res = params.res
       
        return res.status(200).json(this.response)


    }


}
const response=  new Response();
Object.freeze(response);
module.exports =response;