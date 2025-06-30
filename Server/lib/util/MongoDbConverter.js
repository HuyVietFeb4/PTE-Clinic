var mongoose = require("mongoose");

AttributeListConverter = function (attributeList) {
    var selectList = '';
    if( attributeList == null || attributeList == undefined)
        return selectList;
    attributeList.forEach(function(att){
        selectList += att + " ";
    });
    return selectList;
};

RemoveUndefinedAtrribute = function (dataIn) {
    if( dataIn == null || dataIn == undefined)
        return null;
    for(var index in dataIn) {
        if(dataIn[index] === undefined)
            delete dataIn[index];
    }
    return dataIn;
};

ConvertJsonObjectToMongoModel = function(model, schema, dataIn){
    try
    {
		for(fieldName in dataIn){            
		    if(schema.paths[fieldName]){
                if(dataIn[fieldName] != null)
                {
                    if(Array.isArray(dataIn[fieldName]))
                    {
                        for(arrItem in dataIn[fieldName])
                        {
                            model[fieldName].push(dataIn[fieldName][arrItem]);
                        }
                    }
                    else
                    {
                        var fieldValue = "";
                        fieldValue =  dataIn[fieldName] + "";
                        model[fieldName] = fieldValue.trim();
                    }
                }
                else
                {
                    model[fieldName] = "";
                }
		    }else{
               console.error("*********************invalid type specified:", fieldName + " = " + fieldValue);
		    }
		}
		return model;
    }
    catch (err){
    	console.log("==============ERROR=============");
    	console.log(err);
        throw  err;
    }
}

RemoveAllSpace = function(dataIn){
    if( dataIn == null || dataIn == undefined)
        return null;
    for(var index in dataIn) {
        if(dataIn[index] != null)
        {
            dataIn[index] = dataIn[index] + "";
            dataIn[index] = dataIn[index].trim();    
        }
    }
    return dataIn;
}

GetIndexCondition = function (dataIn, indexs) {
    if( dataIn == null || dataIn == undefined)
        return {};
    if( indexs == null || indexs == undefined)
        return {};

    var result = {};
    if(Array.isArray(indexs)) // multiple indexs
    {        

        
        var conditions = [];
        for(var i = 0; i < indexs.length; i++){
            var itemObj = {};
            for(var index in indexs[i])
            {
                if(dataIn[index])
                    itemObj[index] = dataIn[index];
                else
                {
                    console.log('Index does not exist :' + index);
                    return {};
                }
            }
            conditions.push(itemObj);
        }
        result = {
            $or: conditions
        };
    }
    else // single index
    {
        for(var index in indexs)
        {
            if(dataIn[index])
                result[index] = dataIn[index];
            else
            {
                console.log('Index does not exist :' + index);
                return {};
            }
        }
    }
    
    return result;
};

SetUpdateFieldToObject = function (dataIn, dataUpdate, indexs) {
    if( dataIn == null || dataIn == undefined)
        return {};

    if( indexs == null || indexs == undefined)
        return {};
    
    for(var index in dataUpdate)
    {
        if(!indexs[index])
            dataIn[index] = dataUpdate[index];
    }
    return dataIn;
};

module.exports = {
    AttributeListConverter: AttributeListConverter,
    ConvertJsonObjectToMongoModel: ConvertJsonObjectToMongoModel,
    RemoveUndefinedAtrribute: RemoveUndefinedAtrribute,
    GetIndexCondition: GetIndexCondition,
    SetUpdateFieldToObject: SetUpdateFieldToObject,
    RemoveAllSpace: RemoveAllSpace,
}