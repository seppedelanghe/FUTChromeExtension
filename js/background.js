var futTab = null;

var values = [
    { id: 'tradepile-total', value: 12 },
    { id: 'tradepile-sold', value: 2 },
    { id: 'tradepile-unsold', value: 4 },
    { id: 'tradepile-active', value: 5 },
    { id: 'tradepile-inactive', value: 1 },

    { id: 'transfers-total', value: 19 },
    { id: 'transfers-active', value: 5 },
    { id: 'transfers-watching', value: 9 },
    { id: 'transfers-won', value: 2 },
    { id: 'transfers-expired', value: 3 },
];

var data = {};

chrome.tabs.query({ url: 'https://www.ea.com/fifa/ultimate-team/web-app/' }, (tabs) => {
    if (tabs.length === 1) {
        futTab = tabs[0];
        //chrome.tabs.insertCSS(null, {file: './css/app.css'});
        chrome.tabs.executeScript(futTab.id, {file: './js/injection.js'}, () => console.log('Injected backdoor!'));
        chrome.tabs.executeScript(futTab.id, {file: './js/foreground.js'}, () => console.log('Injected foreground!'));
    } else {
        console.warn('FUT Web app not found!');
    }
});

var popupPort = null;
var foregroundPort = null;

var popupListener = (msg) => {
    console.log(msg);

    if (msg.action === 'init') {
        // Trigger transfer data request => next step in forgegroundListener (1)
        foregroundPort.postMessage({action: 'transfers'})
    } else if (msg.action === 'update') {
        popupPort.postMessage({ action: 'update', update: { id: msg.update.id, value: 1600 } });
    }
}

var foregroundListener = (msg) => {
    if (msg.action && msg.data) {
        responses.foreground[msg.action](msg.data);
    } 
}

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup') {
        popupPort = port;
        popupPort.onMessage.addListener(popupListener);
        console.log('popup port opened!');
    } else if (port.name === 'foreground') {
        foregroundPort = port;
        foregroundPort.onMessage.addListener(foregroundListener);
        console.log('foreground port opened!');
    }
});





// Action responses
var responses = {}
// Foreground
responses.foreground = {}

responses.foreground.transfers = (data) => {
    console.log(data);
    // Save data for quick access
    data.transfers = data;
    // Send info to popup
    let lengths = [
        {
            id: 'tradepile-total',
            value: data.all.length,
        },
        {
            id: 'tradepile-sold',
            value: data.sold.length,
        },
        {
            id: 'tradepile-unsold',
            value: data.unsold.length,
        },
        {
            id: 'tradepile-active',
            value: data.active.length,
        },
        {
            id: 'tradepile-inactive',
            value: data.inactive.length,
        },
    ];
    console.log(lengths);
    popupPort.postMessage({action: 'init', updates: lengths});
}