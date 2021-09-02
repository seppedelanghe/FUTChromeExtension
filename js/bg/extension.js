var popupPort = null;
var foregroundPort = null;

const inject = () => {
  chrome.tabs.query(
    { url: "https://www.ea.com/fifa/ultimate-team/web-app/" },
    (tabs) => {
      if (tabs.length === 1) {
        futTab = tabs[0];
        // Execute injection
        chrome.tabs.executeScript(
          futTab.id,
          { file: "./js/injection.js" },
          () => console.log("Injected backdoor!")
        );

        // Returners
        chrome.tabs.executeScript(
          futTab.id,
          { file: "./js/fg/returners.js" },
          () => console.log("Injected foreground!")
        );

        // Base actions
        chrome.tabs.executeScript(futTab.id, { file: "./js/fg/index.js" }, () =>
          console.log("Injected foreground!")
        );

        // API calls
        chrome.tabs.executeScript(
          futTab.id,
          { file: "./js/fg/futapi.js" },
          () => console.log("Injected foreground api calls!")
        );

        store.isInjected = true;
      } else {
        console.error("FUT Web app not found!");
      }
    }
  );
};

const popupListener = (msg) => {
  if (msg.action && msg.data) {
    handlers.popup[msg.action](msg.data);
  } else if (msg.action) {
    handlers.popup[msg.action]();
  }
};

const foregroundListener = (msg) => {
  if (msg.action && msg.data) {
    handlers.foreground[msg.action](msg.data);
  } else if (msg.action) {
    handlers.foreground[msg.action]();
  }
};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    popupPort = port;
    popupPort.onMessage.addListener(popupListener);
    console.log("popup port opened!");
  } else if (port.name === "foreground") {
    foregroundPort = port;
    foregroundPort.onMessage.addListener(foregroundListener);
    console.log("foreground port opened!");
  }
});

chrome.tabs.onRemoved.addListener(function (tabid, removed) {
  if (futTab && tabid === futTab.id) {
    store.isInjected = false;
  }
});
