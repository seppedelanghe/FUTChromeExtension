// Foreground
handlers.foreground = {};

handlers.foreground.transfers = (data) => {
  console.log(data);

  // Format tradepile data
  let lengths = [
    {
      id: "tradepile-total",
      value: data.all.length,
    },
    {
      id: "tradepile-sold",
      value: data.sold.length,
    },
    {
      id: "tradepile-unsold",
      value: data.unsold.length,
    },
    {
      id: "tradepile-active",
      value: data.active.length,
    },
    {
      id: "tradepile-inactive",
      value: data.inactive.length,
    },
  ];

  // send to popup
  popupPort.postMessage({ action: "init", updates: lengths });
};

handlers.foreground.setSessionId = (data) => {
  console.log(data);
  store.sessionId = data;
};

handlers.foreground.searchMarket = (data) => {
  console.log(data);
  store.search = data.auctionInfo;
};


handlers.foreground.bidPlayer = (data) => {
  console.log(data);
}




// Popup
handlers.popup = {};

handlers.popup.inject = () => {
  try {
    inject();
    popupPort.postMessage({ action: "inject", data: { success: true } });
  } catch (e) {
    console.error(e);
    popupPort.postMessage({ action: "inject", data: { success: false } });
  }
};

handlers.popup.init = () => {
  // When popup is opened
  foregroundPort.postMessage({ action: "getSessionId" });
  foregroundPort.postMessage({ action: "transfers" });
};

handlers.popup.update = () => {
  searchMarket();
  popupPort.postMessage({
    action: "update",
    update: { id: msg.update.id, value: 1600 },
  }); // testing
};

handlers.popup.checkInjection = () => {
  popupPort.postMessage({
    action: "checkInjection",
    isInjected: store.isInjected,
  });
};


handlers.popup.searchPlayers = (query) => {
  console.log("Searching for players named: " + query);

  let result = [];
  query = query.toLowerCase();

  for (let i = 0; i < store.players.length; i++) {
    const player = store.players[i];
    let name = player.Name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // normalize special characters
    name = name.toLowerCase();

    if (name === query || name.includes(query)) { // check for exact match or partial match
      result.push(player);
    }

    if (result.length === 10) {
      break;
    }
  }

  function sortByOverall(a, b) {
    let val = 0;

    if (a.Overall < b.Overall) {
      val = -1;
    }

    if (a.Overall > b.Overall) {
      val = 1;
    }

    if (asc) {
      val *= -1;
    }

    return val;
  }

  result.sort(sortByOverall);
  console.log(result);
  
  popupPort.postMessage({
    action: 'searchPlayers',
    data: result,
  })
}