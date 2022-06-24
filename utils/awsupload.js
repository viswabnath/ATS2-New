const AWS= require('aws-sdk');


const Id=process.env.AWS_S3_ACCESS;
const secret=process.env.AWS_S3_SECRET;

const s3= new AWS.S3({
    accessKeyId:Id,
    secretAccessKey:secret
});
const uploadFile=async  (file,bucket)=>{
    const fs= require('fs');
       try{
        const params={
            Bucket:bucket,
            Key:file.originalname,
            Body:fs.createReadStream(file.path)
        };
        const size=file.size/(1024*1024);
            if(size>1){
               
                fs.unlinkSync(file.path);
                throw new Error("File size should be max 1MB");
            
            }
            const ext= file.originalname.split('.');
            const fileExt= ext[ext.length-1];
           
            if(!((fileExt==='pdf')||(fileExt==='docx')||(fileExt==='doc'))){
                fs.unlinkSync(file.path);
                throw new Error("File extensions should be pdf/doc/docx");
           }
        const data= await s3.upload(params).promise();
        fs.unlinkSync(file.path);
        return data.Location;
    }catch(err){
        console.log(err);
        throw new Error(err.message)
    }

}

module.exports= uploadFile