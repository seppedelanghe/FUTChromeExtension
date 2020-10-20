var port = null;

// Getters
fetchLowestForFilters = async () => {
    port.postMessage({action: 'update', update: { id: 'result-lowest-price', data: 'getLowestForFilters' }});
}

responseHandeler = (response) => {
    if (response.action === 'init') {
        if (response.updates && response.updates.length > 0) {
            response.updates.forEach(u => {
                document.getElementById(u.id).innerText = u.value;
            });
        } else {
            console.warn('Could not get UI updates');
        }
    } else if (response.action === 'update' && response.update) {
        document.getElementById(response.update.id).innerHTML = response.update.value;
        
        console.log('updated a element');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Open connection with background
    port = chrome.runtime.connect({name: "popup"});

    // Ask for initial data
    port.postMessage({action: 'init'});

    // add event listener for messages
    port.onMessage.addListener(responseHandeler);

    // Event listeners
    document.getElementById('btn-lowest-price').addEventListener('click', fetchLowestForFilters);
    
});