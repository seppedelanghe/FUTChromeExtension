// Functions to return data
// Function name needs to be same as action name!
var returners = {};

returners.transfers = (data) => {
  port.postMessage({ action: "transfers", data: data });
};

returners.setSessionId = (data) => {
  searchMarket(data, buildSearchQuery());
  port.postMessage({ action: "setSessionId", data: data });
};

returners.searchMarket = (data) => {
  port.postMessage({ action: "searchMarket", data: data });
};


returners.bidPlayer = (data) => {
  port.postMessage({ action: "bidPlayer", data: data });
}