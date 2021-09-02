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
    return hash.toString();
};

function checkMetaTag(onlyContent = true) {
    const metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === 'latestInjection') {
            if (onlyContent) {
                return metas[i].getAttribute('content').toString();
            } else {
                return metas[i];
            }
        }
    }

    return null;
}

if (checkMetaTag() === null || checkMetaTag() !== checksum(injection)) {
    // inject code into "forbidden side"
    var scr = document.createElement('script');
    // appending text to a function to convert it's src to string only works in Chrome, might also work like functions below, needs testing
    scr.textContent = injection;

    // Inject listeners
    (document.head || document.documentElement).appendChild(scr);
    // and hide remove the code to hide
    scr.parentNode.removeChild(scr);

    var meta = checkMetaTag(false);
    if (meta === null) {
        meta = document.createElement('meta');
        meta.name = "latestInjection";
        meta.content = checksum(injection);
        document.getElementsByTagName('head')[0].appendChild(meta);
    } else {
        meta.content = checksum(injection);
    }
    
    console.log('Updated injection.');
} else {
    console.log('Injection has not changed.');
}