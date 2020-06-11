var helpers = {
    serializeJson: function(formId){
        var formDataArray = jQuery(formId).serializeArray();
        var formDataJson = {};
        formDataArray.map(function(o){
            formDataJson[o.name] = o.value;
        });
        return formDataJson;
    },
    get: function(url, token){
        var headers = {};
        
        if(token){
            headers = {
                Authorization: 'Bearer '+token
            };
        }
        return jQuery.get({
            url: url,
            headers: headers
        });
    },
    post: function(url, package, token) {
        var headers = {};
        if(token){
            headers = {
                Authorization: 'Bearer '+token
            };
        }
        return jQuery.post({
            url: url,
            data: package,
            headers: headers
        });
    }
}