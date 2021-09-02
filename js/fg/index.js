// Interaction with background
var port = chrome.runtime.connect({ name: "foreground" });
// add event listener for messages
port.onMessage.addListener((response) => {
  switch (response.action) {
    case "transfers":
      runCode(window.actions.transferItems);
      break;

    case "getSessionId":
      runCode(window.actions.getSessionId);
      break;

    case "searchMarket":
      break;

    default:
      break;
  }
});

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
    console.error("Failed to execute code...");
  }

  if (e.detail.result && e.detail.action) {
    const result = e.detail.result;
    returners[e.detail.action](result);
  }
});

getVariable = (name) => {
  var event = document.createEvent("CustomEvent");
  event.initCustomEvent("GetCustomVariable", true, true, { request: name });
  window.dispatchEvent(event);
};

runCode = (code) => {
  var event = document.createEvent("CustomEvent");
  event.initCustomEvent("RunCustomCode", true, true, { code: code });
  window.dispatchEvent(event);
};

// Helpers
function calcTransactionFee(price) {
  return price * 0.95;
}

// Remote executed funtions
// Making functions ready for running via injection
window.actions = {};

window.actions.transferItems = (() => {
  try {
    services.Item.requestTransferItems().observe(this, (t, resp) => {
      let all = resp.data.items;
      let sold = resp.data.items.filter((item) =>
        item.getAuctionData().isSold()
      );
      let unsold = resp.data.items.filter(
        (item) =>
          !item.getAuctionData().isSold() && item.getAuctionData().isExpired()
      );
      let active = resp.data.items.filter((item) =>
        item.getAuctionData().isSelling()
      );
      let inactive = resp.data.items.filter((item) =>
        item.getAuctionData().isInactive()
      );

      let data = {
        all: all,
        sold: sold,
        unsold: unsold,
        active: active,
        inactive: inactive,
      };

      window.returnResponse("CustomCodeResponse", {
        status: "Got transfer items!",
        action: "transfers",
        result: data,
      });
    });
  } catch (e) {
    throw new Error("Failed to get transfer items...");
  }
}).toString();

window.actions.getSessionId = (() => {
  try {
    let id = services.Authentication.getUtasSession().id.toString();
    window.returnResponse("CustomCodeResponse", {
      status: "Got session id!",
      action: "setSessionId",
      result: id,
    });
  } catch (e) {
    throw new Error("Failed to get session id!");
  }
}).toString();

window.actions.other = (() => {
  try {
    var searchCriteria = getAppMain()
      .getRootViewController()
      .getPresentedViewController()
      .getCurrentViewController()
      .getCurrentController()._viewmodel.searchCriteria;
    if (searchCriteria) {
      window.returnResponse("CustomCodeResponse", {
        status: "Search criteria found!",
        result: searchCriteria,
      });
    } else {
      window.returnResponse("CustomCodeResponse", {
        status: "Search criteria not found... Check your page.",
      });
    }
  } catch (e) {
    throw new Error("Failed to get search filters.");
  }
}).toString();
