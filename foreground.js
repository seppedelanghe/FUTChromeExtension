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

// Listen for variables
window.addEventListener("CustomVariableResponse", function (e) {
    console.log(e);
    var data = e.detail.value;
    console.log(data);
});

// Listen for status of functions
window.addEventListener("CustomCodeResponse", function (e) {
    if (e.detail.status) {
        console.info(e.detail.status);
    } else {
        console.error('Failed to execute code...');
    }

    if (e.detail.result) {
        const result = e.detail.result;
        console.log(result);
    }    
});

getVariable = (name) => {
    var event = document.createEvent("CustomEvent");  
    event.initCustomEvent("GetCustomVariable", true, true, {"request": name});
    window.dispatchEvent(event);
}

runCode = (code) => {
    var event = document.createEvent("CustomEvent");  
    event.initCustomEvent("RunCustomCode", true, true, {"code": code});
    window.dispatchEvent(event);
}


// Helpers
function calcTransactionFee(price) {
    return price * 0.95;
}

// Remote executed funtions
// Making functions ready for running via injection
window.actions = {}

window.actions.getTransferItems = (() => {
    try {
        services.Item.requestTransferItems().observe(this, (t, resp) => {
            let sold = resp.data.items.filter(item => item.getAuctionData().isSold());
            let unsold = resp.data.items.filter(item => !item.getAuctionData().isSold() && item.getAuctionData().isExpired());
            let active = resp.data.items.filter(item => item.getAuctionData().isSelling());
            let available = resp.data.items.filter(item => item.getAuctionData().isInactive());
    
            let data = {
                'sold': sold,
                'unsold': unsold,
                'active': active,
                'available': available,
            }
    
            window.returnResponse('CustomCodeResponse', {'status': 'Got transfer items!', 'result': data}); 
        });
    } catch (e) {
        throw new Error("Failed to get transfer items...");
    }
}).toString();

window.actions.other = (() => {
    try {
        var searchCriteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._viewmodel.searchCriteria;
        if (searchCriteria) {
            window.returnResponse('CustomCodeResponse', {'status': 'Search criteria found!', 'result': searchCriteria});
        } else {
            window.returnResponse('CustomCodeResponse', {'status': 'Search criteria not found... Check your page.',});
        }
    } catch (e) {
        throw new Error('Failed to get search filters.');
    }
}).toString();

//runCode(window.actions.other);