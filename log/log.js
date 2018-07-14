var logger = {
    log : function(){},
    set_logger: function(type){
        if(type == null){
            logger.log = function(data){
                console.log(data);
            };
            console.log("set logger to console.log");

        }
    }
}

module.exports = logger;