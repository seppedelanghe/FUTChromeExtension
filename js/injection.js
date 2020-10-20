if (typeof injection !== 'undefined') { delete injection; };

var injection = '(' + function () {
    window.returnResponse = (name, data) => {
        var event = document.createEvent("CustomEvent");  
        event.initCustomEvent(name, true, true, data);
        window.dispatchEvent(event);
    };

    window.addEventListener("GetCustomVariable", function (e) {
        var value = window[e.detail.request];
        window.returnResponse('CustomVariableResponse', {'value': value});
    });

    window.addEventListener("RunCustomCode", function (e) {
        var code = e.detail.code;
        eval(code)();
        window.returnResponse('CustomCodeResponse', {'status': 'Execute success!', 'code': code});
    });

    console.log('hello');
} + ')();';

function checksum(s) {
    var hash = 0, strlen = s.length, i, c;
    if ( strlen === 0 ) {
      return hash;
    }
    for ( i = 0; i < strlen; i++ ) {
      c = s.charCodeAt( i );
      hash = ((hash << 5) - hash) + c;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

if (typeof window.latestInjetion === 'undefined' || (window.latestInjetion !== checksum(injection))) {
    // inject code into "forbidden side"
    var scr = document.createElement('script');
    // appending text to a function to convert it's src to string only works in Chrome, might also work like functions below, needs testing
    scr.textContent = injection;

    // Inject listeners
    (document.head || document.documentElement).appendChild(scr);
    // and hide remove the code to hide
    scr.parentNode.removeChild(scr);

    // Save checksum to prevent dubble injections
    window.latestInjetion = checksum(injection);

    console.log('Updated injection. ' + window.latestInjetion);
} else {
    console.log('Injection has not changed. ' + window.latestInjetion);
}