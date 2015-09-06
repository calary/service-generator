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
(function($) {
  var href = window.location.href;
  function ajax(info, data, succ, fail, interceptor) {
    var defer = $.Deferred();
    if(info.hasLock) {
      if(info.lock) {
        defer.reject();
        return defer.promise();
      }
      info.lock = true;
    }
    $.ajax({
      url: info.url,
      type: info.type || 'GET',
      data: data,
      cache: false,
      dataType: info.jsonp ? 'jsonp' : 'json',
      jsonp: info.jsonp,
      timeout: 10000,
    }).then(function(data){
        if(info.hasLock) {
          info.lock = false;
        }
        if (interceptor(data, succ, fail)) {
          defer.reject();
          return;
        }
        succ && succ(data);
        defer.resolve(data);
    }, function(){
      fail && fail();
      defer.reject();
    });
    return defer.promise();
  }
  function ajax2(info, data, succ, fail, interceptor) {
    var defer = $.Deferred();
    if(info.hasLock) {
      if(info.lock) {
        defer.reject();
        return defer.promise();
      }
      info.lock = true;
    }
    setTimeout(function() {
      if(info.hasLock) {
         info.lock = false;
      }
      if (interceptor(info.fakeData, succ, fail)) {
        defer.reject();
        return;
      }
      succ && succ(info.fakeData);
      defer.resolve(info.fakeData);
    }, 1000);
    return defer.promise();
  }
  function serviceGenerator(config) {
    var apiName, apiInfo, gene = {},
    debug = config.debug || false,
    interceptor = config.interceptor ||
    function() {};
    delete config.debug;
    delete config.interceptor;
    for (apiName in config) {
      gene[apiName] = (function(apiName) {
        var apiInfo = config[apiName];
        return function(data, succ, fail) {
          var call = debug ? ajax2 : ajax;
          return call(apiInfo, data, succ, fail, interceptor);
        }
      })(apiName);
    }
    return gene;
  }
  window.serviceGenerator = serviceGenerator;
})(jQuery);