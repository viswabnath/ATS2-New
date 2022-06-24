const bunyan = require('bunyan')
const log = bunyan.createLogger({
    name: "Sellcraft CRM2",
    serializers: bunyan.stdSerializers,
    streams:[ {
        level: 'info',
        stream: process.stdout            // log INFO and above to stdout
      },
     
     
      {
        level: 'error',
        stream:process.stdout}],
        src:true,
        
  });

  module.exports=log;