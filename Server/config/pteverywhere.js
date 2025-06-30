exports.default = {
    pteverywhere: function(api){
        return {
			systemTimeout: 1440,
			sysAdminClientId : "PtEverywhere",
			
            email : '<no-reply@pteverywhere.com>', 
			
            url: "http://172.16.5.184:9002/",
            apiUrl: "https://api.pteverywhere.com/api/",

            dbUrl : 'mongodb://localhost:27017/pte_dev',
            dbOptions : {poolSize : 60},
        }
    }
}
