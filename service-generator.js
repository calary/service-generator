/*
Service Generator
config = {
  apiName: {
    url: string,
    method: string (get/post, default get),
    fakeData: json
  }
}
*/
(function(){
  var href = window.location.href;
  var isConnected = !/duapp/.test(href);
  var isOnline = /http/.test(href);
  function ajax(url, type, data, succ, fail){
    $.ajax( {    
      url: url,
      data: data,    
      type: type,    
      cache: false,    
      dataType: 'json',    
      success: function(data) {
        if(succ) {
          succ(data);
        }
      },    
      error: function() {    
        if(fail) {
          fail();
        }
      }    
    });  
  }
  function serviceGenerator(config){
    var apiName, apiInfo, gene = {};
    for(apiName in config) {
      gene[apiName] = (function(curApiName){
        var apiInfo = config[apiName];
        return function(data, succ, fail) {
          if(isConnected && isOnline) {
            ajax(apiInfo.url, apiInfo.method || 'GET', data, succ, fail);
          } else if ( !isConnected && isOnline && apiInfo.fakeJson){
            ajax(apiInfo.fakeJson, apiInfo.method || 'GET', data, succ, fail);
          } else {
            succ && setTimeout(function(){
              succ(apiInfo.fakeData);
            }, 1000);
          }
        }
      })(apiName);
    }
    return gene;
  }
  window.serviceGenerator = serviceGenerator;
})();