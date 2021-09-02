const baseUrl = "https://utas.external.s2.fut.ea.com/ut/game/fifa21/";

const futTypes = {
  levels: ["bronze", "silver", "gold", "SP"],
  zones: ["defense", "midfield", "attacker"],
  position: [
    "GK",
    "RWB",
    "RB",
    "CB",
    "LB",
    "LWB",
    "CDM",
    "RM",
    "CM",
    "LM",
    "CAM",
    "RF",
    "CF",
    "LF",
    "RW",
    "ST",
    "LW",
  ],
};

function buildSearchQuery(
  page = 0,
  num = 21,
  level = null,
  zone = null,
  position = null,
  bid = null,
  bin = null
) {
  let query = `?num=${num}&start=${page}&type=player`;

  if (level !== null && level in futTypes.levels) {
    query += `&lev=${level}`;
  }

  if (zone !== null && zone in futTypes.position) {
    query += `&zone=${zone}`;
  } else {
    if (position !== null && position in futTypes.positions) {
    }
  }

  if (bid !== null && typeof bid === "object") {
    if ("min" in bid && bid.min !== null && bid.min !== 0) {
      query += `&micr=${bid.min}`;
    }

    if ("max" in bid && bid.max !== null && bid.max !== 0) {
      query += `&macr=${bid.max}`;
    }
  }

  if (bin !== null && typeof bid === "object") {
    if ("min" in bin && bin.min !== null && bin.min !== 0) {
      query += `&minb=${bin.min}`;
    }

    if ("max" in bin && bin.max !== null && bin.max !== 0) {
      query += `&maxb=${bin.max}`;
    }
  }

  return query;
}

function searchMarketForPlayer(sessionId, page, num, playerId) {
  let query = `?num=${num}&start=${page}&type=player`;
  query += `&maskedDefId=${playerId}`;
  searchMarket(sessionId, query);
}

function searchMarket(sessionId, seachQuery) {
  const suburl = "transfermarket";
  let fullUrl = baseUrl + suburl + seachQuery;

  fetch(fullUrl, {
    headers: {
      "accept": "*/*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-ut-sid": sessionId,
    },
    referrer: "https://www.ea.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "omit",
  })
    .then((resp) => resp.json())
    .then((data) => returners["searchMarket"](data));
}

function bidPlayer(sessionId, tradeId, amount, bin=true) {
  const suburl = `trade/${tradeId}/bid`;
  let fullUrl = baseUrl + suburl;
  let body = JSON.stringify({
    bid: amount
  });

  fetch(fullUrl, {
    headers: {
      "accept": "*/*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-ut-sid": sessionId
    },
    referrer: "https://www.ea.com/",
    referrerPolic: "strict-origin-when-cross-origin",
    body: body,
    method: "PUT",
    mode: "cors",
    credentials: "omit"
  })
    .then((resp) => resp.json())
    .then((data) => returners["bidPlayer"](data));
}

function updateTradeStaus(sessionId, ids) {
  const suburl = "trade/status/lite";
  let query = `?tradeIds=${ids.join(",")}`;
  let fullUrl = baseUrl + suburl + query;

  fetch(fullUrl, {
    headers: {
      "accept": "*/*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-ut-sid": sessionId,
    },
    referrer: "https://www.ea.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "omit",
  })
    .then((resp) => resp.json())
    .then((data) => console.log(data));
}
