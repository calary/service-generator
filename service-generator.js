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
(function() {
  var href = window.location.href;
  function ajax(info, data, succ, fail, interceptor) {
    if(info.hasLock) {
      if(info.lock) {
        return;
      }
      info.lock = true;
    }
    $.ajax({
      url: info.url,
      type: info.type || 'GET',
      data: data,
      cache: false,
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        if(info.hasLock) {
          info.lock = false;
        }
        if (interceptor(data, succ, fail)) {
          return;
        }
        succ && succ(data);
      },
      error: function() {
        if (interceptor(null, succ, fail)) {
          return;
        }
        fail && fail();
      }
    });
  }
  function ajax2(info, data, succ, fail, interceptor) {
    if(info.hasLock) {
      if(info.lock) {
        return;
      }
      info.lock = true;
    }
    setTimeout(function() {
      if(info.hasLock) {
         info.lock = false;
      }
      if (interceptor(info.fakeData, succ, fail)) {
        return;
      }
      succ && succ(info.fakeData);
    }, 1000);
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
          call(apiInfo, data, succ, fail, interceptor);
        }
      })(apiName);
    }
    return gene;
  }
  window.serviceGenerator = serviceGenerator;
})();