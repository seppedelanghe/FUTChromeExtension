console.log('Autobuyer background started!');

chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {
        if (current_tab_info.url.includes('https://www.ea.com/fifa/ultimate-team/web-app/')) {
            //chrome.tabs.insertCSS(null, {file: './css/style.css'});
            //chrome.tabs.executeScript(null, {file: './helpers.js'}, () => console.log('Helpers injected!'));
            chrome.tabs.executeScript(null, {file: './foreground.js'}, () => console.log('Foreground injected!'));
        }
    })
});